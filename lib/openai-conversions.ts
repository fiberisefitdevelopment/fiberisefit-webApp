import { createHash } from 'crypto'

const EVENTS_URL = 'https://bzr.openai.com/v1/events'

type ShopifyLineItem = {
  title?: string
  quantity?: number
  price?: string
  sku?: string
  variant_id?: number | string
  product_id?: number | string
  variant_title?: string | null
}

type ShopifyNoteAttribute = {
  name?: string
  value?: string
}

export type ShopifyOrderForConversion = {
  id?: number | string
  test?: boolean
  email?: string | null
  phone?: string | null
  total_price?: string
  currency?: string
  created_at?: string
  order_status_url?: string
  browser_ip?: string | null
  client_details?: { user_agent?: string | null } | null
  customer?: { id?: number | string; email?: string | null; phone?: string | null } | null
  shipping_address?: {
    first_name?: string | null
    last_name?: string | null
    city?: string | null
    province?: string | null
    zip?: string | null
    country_code?: string | null
    phone?: string | null
  } | null
  billing_address?: {
    first_name?: string | null
    last_name?: string | null
    city?: string | null
    province?: string | null
    zip?: string | null
    country_code?: string | null
    phone?: string | null
  } | null
  note_attributes?: ShopifyNoteAttribute[]
  line_items?: ShopifyLineItem[]
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

function noteValue(order: ShopifyOrderForConversion, name: string): string {
  const match = order.note_attributes?.find((attr) => attr.name === name)
  return typeof match?.value === 'string' ? match.value.trim() : ''
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function normalizePhone(phone: string): string {
  let digits = phone.replace(/[\s().-]/g, '')
  if (digits.startsWith('+')) digits = digits.slice(1)
  digits = digits.replace(/^0+/, '')
  if (digits.length === 10) digits = `91${digits}`
  if (digits.length < 8 || digits.length > 15) return ''
  return digits
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '')
}

function minorUnits(amount: string | undefined, currency: string): number {
  const value = Number.parseFloat(amount || '0')
  if (!Number.isFinite(value) || value <= 0) return 0
  const zeroDecimal = new Set(['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'])
  if (zeroDecimal.has(currency)) return Math.round(value)
  return Math.round(value * 100)
}

function hashedList(values: string[]): string[] | undefined {
  const unique = [...new Set(values.filter(Boolean))].slice(0, 3)
  if (!unique.length) return undefined
  return unique.map(sha256)
}

export async function sendOpenAiOrderCreated(order: ShopifyOrderForConversion): Promise<void> {
  const apiKey = process.env.OPENAI_CONVERSION_KEY
  const pixelId = process.env.OPENAI_PIXEL_ID || process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID
  if (!apiKey || !pixelId) {
    console.warn('[OpenAI Ads] Skipping order event: pixel id or conversion key is not set')
    return
  }
  if (!order.id || order.test) return

  const currency = (order.currency || 'INR').toUpperCase()
  const amount = minorUnits(order.total_price, currency)
  const createdAt = order.created_at ? Date.parse(order.created_at) : NaN
  const timestampMs = Number.isFinite(createdAt) ? createdAt : Date.now()
  const shipping = order.shipping_address
  const billing = order.billing_address
  const email = normalizeEmail(order.email || order.customer?.email || '')
  const phone = normalizePhone(order.phone || shipping?.phone || billing?.phone || order.customer?.phone || '')
  const firstName = normalizeName(shipping?.first_name || billing?.first_name || '')
  const lastName = normalizeName(shipping?.last_name || billing?.last_name || '')
  const oppref = noteValue(order, 'openai_oppref')
  const obref = noteValue(order, 'openai_obref')
  const emails = hashedList(email ? [email] : [])
  const phones = hashedList(phone ? [phone] : [])
  const externalIds = order.customer?.id ? hashedList([String(order.customer.id)]) : undefined
  const firstNames = hashedList(firstName ? [firstName] : [])
  const lastNames = hashedList(lastName ? [lastName] : [])

  const contents = (order.line_items || [])
    .map((item) => {
      const id = String(item.sku || item.variant_id || item.product_id || '').trim()
      if (!id) return null
      const quantity = Number.isInteger(item.quantity) && (item.quantity as number) > 0 ? (item.quantity as number) : 1
      return {
        id,
        ...(item.title ? { name: item.title } : {}),
        content_type: 'product',
        quantity,
        amount: minorUnits(item.price, currency),
        currency,
        ...(item.variant_title ? { variant_dict: { variant: item.variant_title } } : {}),
      }
    })
    .filter(Boolean)

  const user = {
    ...(obref ? { obref } : {}),
    ...(emails ? { emails_sha256: emails } : {}),
    ...(phones ? { phone_numbers_sha256: phones } : {}),
    ...(externalIds ? { external_ids_sha256: externalIds } : {}),
    ...(firstNames ? { first_names_sha256: firstNames } : {}),
    ...(lastNames ? { last_names_sha256: lastNames } : {}),
    ...(shipping?.city || billing?.city ? { cities: [shipping?.city || billing?.city].filter(Boolean).slice(0, 3) } : {}),
    ...(shipping?.province || billing?.province
      ? { regions: [shipping?.province || billing?.province].filter(Boolean).slice(0, 3) }
      : {}),
    ...(shipping?.zip || billing?.zip ? { postal_codes: [shipping?.zip || billing?.zip].filter(Boolean).slice(0, 3) } : {}),
    ...(shipping?.country_code || billing?.country_code
      ? { countries: [shipping?.country_code || billing?.country_code].filter(Boolean).slice(0, 3) }
      : {}),
    ...(order.browser_ip ? { ip_address: order.browser_ip } : {}),
    ...(order.client_details?.user_agent ? { user_agent: order.client_details.user_agent } : {}),
  }

  const event = {
    id: `shopify_${order.id}`,
    type: 'order_created',
    timestamp_ms: timestampMs,
    ...(oppref ? { oppref } : {}),
    source_url: order.order_status_url || 'https://fiberisefit.com',
    action_source: 'web',
    ...(Object.keys(user).length ? { user } : {}),
    data: {
      type: 'contents',
      amount,
      currency,
      ...(contents.length ? { contents } : {}),
    },
  }

  const response = await fetch(`${EVENTS_URL}?pid=${encodeURIComponent(pixelId)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      validate_only: false,
      integration_source: 'fiberise_web',
      events: [event],
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`OpenAI conversions API ${response.status}: ${body.slice(0, 500)}`)
  }
}
