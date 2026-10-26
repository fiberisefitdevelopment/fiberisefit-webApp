import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

async function readError(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({}))
  return typeof body.error === 'string' ? body.error : fallback
}

export async function requestWhatsAppOtp(phoneDigits: string) {
  const digits = phoneDigits.replace(/\D/g, '').slice(-10)
  const response = await fetch('/api/otp/whatsapp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: digits }),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(typeof body.error === 'string' ? body.error : 'Could not send the WhatsApp code.')
  }
  return {
    alreadySent: Boolean(body.alreadySent),
    expiresIn: typeof body.expiresIn === 'number' ? body.expiresIn : 300,
  }
}

export async function signInWithWhatsAppOtp(phoneDigits: string, otp: string) {
  const response = await fetch('/api/otp/whatsapp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phoneDigits, otp }),
  })
  if (!response.ok) {
    throw new Error(await readError(response, 'That code did not match. Please try again.'))
  }
  const body = await response.json()
  if (typeof body.token !== 'string') {
    throw new Error('Could not start the login session.')
  }
  const credential = await signInWithCustomToken(auth, body.token)
  return credential.user.getIdToken(true)
}
