declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

type OpenAiContent = {
  id: string
  name?: string
  content_type: 'product'
  quantity: number
  amount?: number
  currency: 'INR'
}

export type OpenAiContentsEvent = {
  type: 'contents'
  amount: number
  currency: 'INR'
  contents?: OpenAiContent[]
}

function readCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`))
  if (!match) return ''
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

/** Rupees to the currency minor unit (paise for INR). */
export function inrMinorUnits(rupees: number): number {
  if (!Number.isFinite(rupees) || rupees <= 0) return 0
  return Math.round(rupees * 100)
}

export function openAiCheckoutFields(): { openaiOppref?: string; openaiObref?: string } {
  if (typeof window === 'undefined') return {}
  const fromUrl = new URLSearchParams(window.location.search).get('oppref')?.trim() || ''
  const oppref = (fromUrl || readCookie('__oppref')).slice(0, 500)
  const obref = readCookie('__obref').slice(0, 500)
  return {
    ...(oppref ? { openaiOppref: oppref } : {}),
    ...(obref ? { openaiObref: obref } : {}),
  }
}

export function trackOpenAiCheckout(
  items: Array<{
    contentName: string
    contentIds: string[]
    value: number
    quantity?: number
  }>,
  value: number
) {
  if (typeof window === 'undefined' || typeof window.oaiq !== 'function') return
  const contents = items.flatMap((item) => {
    const id = item.contentIds.find(Boolean)
    if (!id) return []
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1
    const amount = inrMinorUnits(item.value)
    return [
      {
        id,
        name: item.contentName,
        content_type: 'product' as const,
        quantity,
        amount: quantity > 0 ? Math.round(amount / quantity) : amount,
        currency: 'INR' as const,
      },
    ]
  })
  window.oaiq('measure', 'checkout_started', {
    type: 'contents',
    amount: inrMinorUnits(value),
    currency: 'INR',
    ...(contents.length ? { contents } : {}),
  })
}

export function trackOpenAiContents(
  event: 'contents_viewed' | 'items_added',
  item: {
    contentName: string
    contentIds: string[]
    value: number
    quantity?: number
  }
) {
  if (typeof window === 'undefined' || typeof window.oaiq !== 'function') return
  const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1
  const amount = inrMinorUnits(item.value)
  const unitAmount = quantity > 0 ? Math.round(amount / quantity) : amount
  const id = item.contentIds.find(Boolean)
  const data: OpenAiContentsEvent = {
    type: 'contents',
    amount,
    currency: 'INR',
    ...(id
      ? {
          contents: [
            {
              id,
              name: item.contentName,
              content_type: 'product',
              quantity,
              amount: unitAmount,
              currency: 'INR',
            },
          ],
        }
      : {}),
  }
  window.oaiq('measure', event, data)
}
