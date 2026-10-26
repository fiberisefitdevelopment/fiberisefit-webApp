import { shopifyAdminFetch } from '@/lib/shopify/admin-client'
import { LATEST_ORDER_ADDRESS_QUERY } from '@/lib/shopify/queries'

export type SavedAddress = {
  address1: string
  address2: string
  city: string
  province: string
  zip: string
  country: string
}

export function emptyAddress(): SavedAddress {
  return { address1: '', address2: '', city: '', province: '', zip: '', country: 'India' }
}

export function readAddress(value: unknown): SavedAddress {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  const address = emptyAddress()
  for (const key of Object.keys(address) as Array<keyof SavedAddress>) {
    if (typeof source[key] === 'string') address[key] = source[key].trim()
  }
  if (!address.country) address.country = 'India'
  return address
}

function last10(value: string | null | undefined): string {
  return (value || '').replace(/\D/g, '').slice(-10)
}

function orderBelongsToPhone(
  digits: string,
  node: {
    phone?: string | null
    customer?: { phone?: string | null; defaultPhoneNumber?: { phoneNumber?: string | null } | null } | null
    shippingAddress?: { phone?: string | null } | null
    billingAddress?: { phone?: string | null } | null
  }
): boolean {
  const candidates = [
    node.phone,
    node.customer?.phone,
    node.customer?.defaultPhoneNumber?.phoneNumber,
    node.shippingAddress?.phone,
    node.billingAddress?.phone,
  ]
  return candidates.some((candidate) => last10(candidate) === digits)
}

export async function addressFromLatestOrder(phone: string): Promise<SavedAddress | null> {
  if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) return null
  const digits = last10(phone)
  if (digits.length !== 10) return null

  try {
    const data = await shopifyAdminFetch<{
      orders: {
        edges: Array<{
          node: {
            phone?: string | null
            customer?: { phone?: string | null; defaultPhoneNumber?: { phoneNumber?: string | null } | null } | null
            shippingAddress: (SavedAddress & { name?: string | null; phone?: string | null }) | null
            billingAddress: (SavedAddress & { name?: string | null; phone?: string | null }) | null
          }
        }>
      }
    }>({
      query: LATEST_ORDER_ADDRESS_QUERY,
      variables: { query: `phone:*${digits}*` },
    })
    const node = data.orders.edges.find((edge) => orderBelongsToPhone(digits, edge.node))?.node
    if (!node) return null
    const source = node.shippingAddress?.address1 ? node.shippingAddress : node.billingAddress
    if (!source?.address1) return null
    return readAddress(source)
  } catch (error) {
    console.error('Could not seed address from Shopify orders:', error)
    return null
  }
}
