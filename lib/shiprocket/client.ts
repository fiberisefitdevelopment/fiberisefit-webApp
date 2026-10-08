import { SHIPROCKET_CONFIG, isShiprocketConfigured } from './config'

const AUTH_URL = `${SHIPROCKET_CONFIG.baseUrl}/auth/login`
const PRINT_INVOICE_URL = `${SHIPROCKET_CONFIG.baseUrl}/orders/print/invoice`
const ORDERS_URL = `${SHIPROCKET_CONFIG.baseUrl}/orders`

/** Cached token; valid 240 hours (10 days). */
let cachedToken: string | null = null
let tokenExpiry = 0
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000 // refresh 1 day before expiry

export interface ShiprocketAuthResponse {
  token: string
  user: unknown
}

export interface ShiprocketPrintInvoiceResponse {
  status?: number
  status_code?: number
  message?: string
  is_invoice_created?: boolean
  invoice_url?: string
  pdf_url?: string
  url?: string
  not_created?: unknown[]
  irn_no?: string
}

export interface ShiprocketOrder {
  id: number
  order_id?: string
  order_number?: string
  /** Order number from sales channel (e.g. Shopify order #1021) */
  channel_order_id?: string
  channel_id?: string
  [key: string]: unknown
}

export interface ShiprocketOrdersResponse {
  data?: { data?: ShiprocketOrder[] } | ShiprocketOrder[]
  orders?: ShiprocketOrder[]
}

/**
 * Get Bearer token. Uses SHIPROCKET_TOKEN if set, else login with SHIPROCKET_EMAIL/SHIPROCKET_PASSWORD (cached).
 */
export async function getShiprocketToken(): Promise<string> {
  if (!isShiprocketConfigured()) {
    throw new Error('Shiprocket is not configured. Set SHIPROCKET_TOKEN or SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env.local')
  }
  if (SHIPROCKET_CONFIG.token) return SHIPROCKET_CONFIG.token
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: SHIPROCKET_CONFIG.email,
      password: SHIPROCKET_CONFIG.password,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shiprocket auth failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as ShiprocketAuthResponse
  if (!data?.token) {
    throw new Error('Shiprocket auth did not return a token')
  }
  cachedToken = data.token
  tokenExpiry = Date.now() + TOKEN_TTL_MS
  return cachedToken
}

/**
 * Get invoice PDF URL for given Shiprocket order IDs.
 * External API (apiv2.shiprocket.in) - tries multiple body formats if "Order ids required".
 */
export async function getShiprocketInvoicePdfUrl(orderIds: number[]): Promise<string> {
  if (orderIds.length === 0) {
    throw new Error('At least one order ID is required')
  }
  const token = await getShiprocketToken()
  const headers = { Authorization: `Bearer ${token}` }

  const tryRequest = async (body: string, contentType: string): Promise<Response> =>
    fetch(PRINT_INVOICE_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': contentType },
      body,
    })

  const parseResponse = async (res: Response): Promise<ShiprocketPrintInvoiceResponse> => {
    const text = await res.text()
    try {
      return JSON.parse(text) as ShiprocketPrintInvoiceResponse
    } catch {
      return { message: text || `HTTP ${res.status}` }
    }
  }

  const payloads: { body: string; contentType: string }[] = [
    { body: JSON.stringify({ order_ids: orderIds }), contentType: 'application/json' },
    { body: JSON.stringify({ order_ids: orderIds.map(String) }), contentType: 'application/json' },
    { body: JSON.stringify({ ids: orderIds }), contentType: 'application/json' },
    {
      body: new URLSearchParams({ order_ids: orderIds.join(',') }).toString(),
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      body: new URLSearchParams(
        orderIds.map((id) => ['order_ids[]', String(id)] as [string, string])
      ).toString(),
      contentType: 'application/x-www-form-urlencoded',
    },
  ]

  for (const { body, contentType } of payloads) {
    const res = await tryRequest(body, contentType)
    const data = await parseResponse(res)
    if (res.ok) {
      const url = data.invoice_url ?? data.pdf_url ?? data.url
      if (url && typeof url === 'string') return url
      throw new Error(data?.message ?? 'Shiprocket did not return an invoice URL')
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(data?.message ?? 'Shiprocket unauthorized')
    }
    if (res.status === 400 && (data?.message?.includes('Order ids required') ?? false)) {
      continue
    }
    throw new Error(data?.message ?? `Shiprocket invoice failed (${res.status})`)
  }

  throw new Error('Order ids required. Shiprocket did not accept any request format.')
}

/**
 * Normalize Shiprocket orders list response (API can return data.data, data as array, data.orders, or orders).
 */
function parseOrdersResponse(data: ShiprocketOrdersResponse): ShiprocketOrder[] {
  const raw = data?.data ?? data?.orders
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const inner = (raw as { data?: ShiprocketOrder[]; orders?: ShiprocketOrder[] })
    if (Array.isArray(inner.data)) return inner.data
    if (Array.isArray(inner.orders)) return inner.orders
  }
  return []
}

/**
 * Fetch orders from Shiprocket (paginated). Does not support filter by order_id in API; use findOrderByChannelOrderNumber to search.
 */
export async function getShiprocketOrders(params?: {
  page?: number
  perPage?: number
}): Promise<ShiprocketOrder[]> {
  const token = await getShiprocketToken()
  const search = new URLSearchParams()
  if (params?.page != null) search.set('page', String(params.page))
  if (params?.perPage != null) search.set('per_page', String(params.perPage ?? 100))
  const url = `${ORDERS_URL}?${search.toString()}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shiprocket orders list failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as ShiprocketOrdersResponse
  return parseOrdersResponse(data)
}

/**
 * Find a Shiprocket order by channel order number (e.g. Shopify order #1021).
 * Fetches up to maxPages of orders and matches on channel_order_id, order_id, or order_number.
 */
export async function findOrderByChannelOrderNumber(orderNumber: string, maxPages = 5): Promise<ShiprocketOrder | null> {
  const normalized = String(orderNumber).trim()
  if (!normalized) return null
  for (let page = 1; page <= maxPages; page++) {
    const orders = await getShiprocketOrders({ page, perPage: 100 })
    const match = orders.find(
      (o) =>
        String(o.channel_order_id ?? '').trim() === normalized ||
        String(o.order_id ?? '').trim() === normalized ||
        String(o.order_number ?? '').trim() === normalized
    )
    if (match) return match
    if (orders.length < 100) break
  }
  return null
}
