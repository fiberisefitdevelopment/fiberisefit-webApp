import { createHash, timingSafeEqual } from 'node:crypto'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

const OTP_TTL_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5
const MAX_SENDS = 3
const SEND_WINDOW_MS = 30 * 60 * 1000
const FIRST_BLOCK_MS = 30 * 60 * 1000
const REPEAT_BLOCK_MS = 12 * 60 * 60 * 1000

export class WhatsAppOtpError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'WhatsAppOtpError'
    this.status = status
  }
}

export type WhatsAppSendResult = {
  alreadySent: boolean
  expiresIn: number
}

function digitsOnly(phone: string) {
  return phone.replace(/\D/g, '').slice(-10)
}

export function indianMobile(phone: string) {
  const digits = digitsOnly(phone)
  if (!/^[6-9]\d{9}$/.test(digits)) return null
  return { digits, destination: `91${digits}`, e164: `+91${digits}` }
}

function hashCode(destination: string, code: string) {
  return createHash('sha256').update(`${destination}:${code}`).digest()
}

function toMillis(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed < 1e12 ? parsed * 1000 : parsed
  }
  if (value && typeof value === 'object') {
    const stamp = value as { toMillis?: () => number; seconds?: number; _seconds?: number }
    if (typeof stamp.toMillis === 'function') return stamp.toMillis()
    const seconds = stamp.seconds ?? stamp._seconds
    if (typeof seconds === 'number') return seconds * 1000
  }
  return 0
}

function secondsUntil(until: number) {
  return Math.max(1, Math.ceil((until - Date.now()) / 1000))
}

function waitLabel(remainingMs: number) {
  const minutes = Math.max(1, Math.ceil(remainingMs / 60000))
  return minutes === 1 ? '1 minute' : `${minutes} minutes`
}

export async function sendWhatsAppOtp(phone: string): Promise<WhatsAppSendResult> {
  const mobile = indianMobile(phone)
  if (!mobile) {
    throw new WhatsAppOtpError('Enter a valid 10-digit Indian mobile number.')
  }
  const apiKey = process.env.AISENSY_API_KEY
  if (!apiKey || !adminDb) {
    throw new WhatsAppOtpError('WhatsApp OTP is not configured.', 503)
  }

  const challenges = adminDb.collection('otp_challenges')
  const ref = challenges.doc(mobile.destination)
  const [directSnap, matchedSnap] = await Promise.all([
    ref.get(),
    challenges.where('digits', '==', mobile.digits).limit(5).get(),
  ])
  const candidates = [directSnap, ...matchedSnap.docs]
  const now = Date.now()
  const activeSnap = candidates.find((item) => {
    const itemData = item.data()
    return typeof itemData?.codeHash === 'string' && itemData.codeHash.length > 0 && toMillis(itemData.expiresAt) > now
  })
  const data = (activeSnap?.data() || directSnap.data() || {}) as Record<string, unknown>
  const expiresAt = toMillis(data.expiresAt)
  const attempts = Number(data.attempts || 0)
  const codeIsActive = typeof data.codeHash === 'string' && data.codeHash.length > 0 && expiresAt > now

  if (codeIsActive && attempts >= MAX_ATTEMPTS) {
    throw new WhatsAppOtpError(
      `Too many wrong codes. You can request a new one in ${waitLabel(expiresAt - now)}.`,
      429
    )
  }

  if (codeIsActive) {
    if (activeSnap && activeSnap.ref.id !== ref.id) {
      await ref.set(activeSnap.data() || {})
    }
    return { alreadySent: true, expiresIn: secondsUntil(expiresAt) }
  }

  if (typeof data.blockedUntil === 'number' && data.blockedUntil > now) {
    throw new WhatsAppOtpError(
      `Too many WhatsApp codes were requested. Try again in ${waitLabel(data.blockedUntil - now)}.`,
      429
    )
  }

  const recentSends = (Array.isArray(data.sendTimestamps) ? data.sendTimestamps : []).filter(
    (stamp): stamp is number => typeof stamp === 'number' && now - stamp < SEND_WINDOW_MS
  )
  if (recentSends.length >= MAX_SENDS) {
    const repeat = Number(data.sendStrikes || 0) >= 1
    const blockMs = repeat ? REPEAT_BLOCK_MS : FIRST_BLOCK_MS
    await ref.set(
      {
        sendTimestamps: repeat ? [] : recentSends,
        sendStrikes: repeat ? 0 : 1,
        blockedUntil: now + blockMs,
        codeHash: null,
        expiresAt: 0,
        attempts: 0,
      },
      { merge: true }
    )
    throw new WhatsAppOtpError(
      `Too many WhatsApp codes were requested. Try again in ${waitLabel(blockMs)}.`,
      429
    )
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const response = await fetch(
    process.env.AISENSY_API_URL || 'https://backend.aisensy.com/campaign/t1/api/v2',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        campaignName: process.env.AISENSY_CAMPAIGN_NAME || 'fiberise_login_otp',
        destination: mobile.destination,
        userName: 'Fiberise Fit',
        templateParams: [code],
        source: 'fiberise-login',
        media: {},
        buttons: [
          {
            type: 'button',
            sub_type: 'url',
            index: 0,
            parameters: [{ type: 'text', text: code }],
          },
        ],
        carouselCards: [],
        location: {},
        attributes: {},
        paramsFallbackValue: { FirstName: code },
      }),
    }
  )
  const body = await response.json().catch(() => ({}))
  if (!response.ok || body.success === 'false' || body.success === false) {
    console.error('AiSensy OTP send failed:', body)
    throw new WhatsAppOtpError('Could not send the WhatsApp code. Try SMS instead.', 502)
  }

  const nextExpiry = Date.now() + OTP_TTL_MS
  await ref.set({
    digits: mobile.digits,
    codeHash: hashCode(mobile.destination, code).toString('hex'),
    expiresAt: nextExpiry,
    attempts: 0,
    sendTimestamps: [...recentSends, Date.now()],
    sendStrikes: Number(data.sendStrikes || 0),
    blockedUntil: 0,
  })
  return { alreadySent: false, expiresIn: Math.ceil(OTP_TTL_MS / 1000) }
}

export async function verifyWhatsAppOtp(phone: string, otp: string) {
  const mobile = indianMobile(phone)
  const code = otp.replace(/\D/g, '')
  if (!mobile || code.length !== 6) {
    throw new WhatsAppOtpError('Enter the 6-digit code from WhatsApp.')
  }
  if (!adminAuth || !adminDb) {
    throw new WhatsAppOtpError('WhatsApp OTP is not configured.', 503)
  }

  const ref = adminDb.collection('otp_challenges').doc(mobile.destination)
  const snap = await ref.get()
  const data = snap.data()
  if (!data || typeof data.codeHash !== 'string' || toMillis(data.expiresAt) <= Date.now()) {
    throw new WhatsAppOtpError('That code has expired. You can request a new one.')
  }
  if (Number(data.attempts || 0) >= MAX_ATTEMPTS) {
    throw new WhatsAppOtpError('Too many wrong codes. Request a new one after this code expires.', 429)
  }

  const expected = Buffer.from(data.codeHash, 'hex')
  const actual = hashCode(mobile.destination, code)
  const matches = expected.length === actual.length && timingSafeEqual(expected, actual)
  if (!matches) {
    const attempts = Number(data.attempts || 0) + 1
    await ref.update({ attempts })
    if (attempts >= MAX_ATTEMPTS) {
      throw new WhatsAppOtpError('Too many wrong codes. Request a new one after this code expires.', 429)
    }
    const left = MAX_ATTEMPTS - attempts
    throw new WhatsAppOtpError(`That code did not match. ${left} ${left === 1 ? 'try' : 'tries'} left.`)
  }
  await ref.set(
    {
      codeHash: null,
      expiresAt: 0,
      attempts: 0,
      sendTimestamps: Array.isArray(data.sendTimestamps) ? data.sendTimestamps : [],
      blockedUntil: typeof data.blockedUntil === 'number' ? data.blockedUntil : 0,
    },
    { merge: true }
  )

  let user
  try {
    user = await adminAuth.getUserByPhoneNumber(mobile.e164)
  } catch (error) {
    const codeName = (error as { code?: string }).code
    if (codeName !== 'auth/user-not-found') throw error
    user = await adminAuth.createUser({ phoneNumber: mobile.e164 })
  }

  return adminAuth.createCustomToken(user.uid)
}
