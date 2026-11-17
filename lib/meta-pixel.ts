import { trackOpenAiCheckout, trackOpenAiContents } from '@/lib/openai-pixel'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function shopifyNumericId(value?: string | null): string {
  if (!value) return ''
  const clean = String(value).split('::')[0]
  const last = clean.split('/').pop() || clean
  const digits = last.match(/\d+/)
  return digits ? digits[0] : ''
}

function uniqueNumericIds(ids: Array<string | null | undefined>): string[] {
  return [...new Set(ids.map((id) => shopifyNumericId(id)).filter(Boolean))]
}

export function trackMetaEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', event, params)
}

type PixelProduct = {
  contentName: string
  contentIds: Array<string | null | undefined>
  value: number
  quantity?: number
}

function productPayload(item: PixelProduct) {
  const ids = uniqueNumericIds(item.contentIds)
  const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1
  return {
    content_ids: ids,
    content_type: 'product' as const,
    content_name: item.contentName,
    contents: ids.map((id) => ({ id, quantity })),
    value: item.value,
    currency: 'INR',
    num_items: quantity,
  }
}

function trackOpenAiFromProduct(
  event: 'contents_viewed' | 'items_added',
  item: PixelProduct
) {
  trackOpenAiContents(event, {
    contentName: item.contentName,
    contentIds: uniqueNumericIds(item.contentIds),
    value: item.value,
    quantity: item.quantity,
  })
}

export function trackViewContent(item: PixelProduct) {
  const payload = productPayload(item)
  if (!payload.content_ids.length) return
  trackMetaEvent('ViewContent', payload)
  trackOpenAiFromProduct('contents_viewed', item)
}

export function trackAddToCart(item: PixelProduct) {
  const payload = productPayload(item)
  if (!payload.content_ids.length) return
  trackMetaEvent('AddToCart', payload)
  trackOpenAiFromProduct('items_added', item)
}

export function trackInitiateCheckout(items: PixelProduct[], value: number) {
  const ids = uniqueNumericIds(items.flatMap((item) => item.contentIds))
  if (!ids.length) return
  trackMetaEvent('InitiateCheckout', {
    content_ids: ids,
    content_type: 'product',
    contents: items.flatMap((item) =>
      uniqueNumericIds(item.contentIds).map((id) => ({
        id,
        quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      }))
    ),
    value,
    currency: 'INR',
    num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
  })
  trackOpenAiCheckout(
    items.map((item) => ({
      contentName: item.contentName,
      contentIds: uniqueNumericIds(item.contentIds),
      value: item.value,
      quantity: item.quantity,
    })),
    value
  )
}
