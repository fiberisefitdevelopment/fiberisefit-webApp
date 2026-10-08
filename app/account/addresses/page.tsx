'use client'

import { useMemo } from 'react'
import { useOrders } from '@/hooks/useOrders'
import Link from 'next/link'

type AddressBlock = {
  name: string | null
  address1: string | null
  address2: string | null
  city: string | null
  province: string | null
  zip: string | null
  country: string | null
  phone: string | null
}

function addressKey(a: AddressBlock): string {
  const parts = [
    a.name,
    a.address1,
    a.address2,
    a.city,
    a.province,
    a.zip,
    a.country,
  ]
    .filter(Boolean)
    .map((s) => String(s).trim().toLowerCase())
  return parts.join('|')
}

function formatAddress(a: AddressBlock): string[] {
  const lines: string[] = []
  if (a.name) lines.push(a.name)
  if (a.address1) lines.push(a.address1)
  if (a.address2) lines.push(a.address2)
  const cityLine = [a.city, a.province, a.zip].filter(Boolean).join(', ')
  if (cityLine) lines.push(cityLine)
  if (a.country) lines.push(a.country)
  if (a.phone) lines.push(a.phone)
  return lines
}

export default function AccountAddressesPage() {
  const { rawOrders, loading, error } = useOrders()

  const addressesFromOrders = useMemo(() => {
    const byKey = new Map<
      string,
      {
        address: AddressBlock
        orders: { id: string; orderNumber: string }[]
        usedAs: ('billing' | 'shipping')[]
      }
    >()

    for (const order of rawOrders) {
      const orderEntry = { id: order.id, orderNumber: order.orderNumber || order.id }
      if (order.billingAddress) {
        const key = addressKey(order.billingAddress)
        const existing = byKey.get(key)
        if (existing) {
          if (!existing.orders.some((o) => o.id === order.id)) {
            existing.orders.push(orderEntry)
          }
          if (!existing.usedAs.includes('billing')) existing.usedAs.push('billing')
        } else {
          byKey.set(key, {
            address: order.billingAddress,
            orders: [orderEntry],
            usedAs: ['billing'],
          })
        }
      }
      if (order.shippingAddress) {
        const key = addressKey(order.shippingAddress)
        const existing = byKey.get(key)
        if (existing) {
          if (!existing.orders.some((o) => o.id === order.id)) {
            existing.orders.push(orderEntry)
          }
          if (!existing.usedAs.includes('shipping')) existing.usedAs.push('shipping')
        } else {
          byKey.set(key, {
            address: order.shippingAddress,
            orders: [orderEntry],
            usedAs: ['shipping'],
          })
        }
      }
    }

    return Array.from(byKey.values())
  }, [rawOrders])

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Addresses</h1>
        <p className="text-gray-600 mb-6">Loading your addresses…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Addresses</h1>
        <p className="text-red-600 mb-6">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Addresses</h1>
      <p className="text-gray-600 mb-6">
        Addresses used when placing your orders. You can use these at checkout.
      </p>

      {addressesFromOrders.length === 0 ? (
        <p className="text-gray-500">
          No saved addresses yet. Addresses will appear here once you place orders.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addressesFromOrders.map(({ address, orders, usedAs }, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                {usedAs.map((u) => (
                  <span
                    key={u}
                    className="text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-200 px-2 py-0.5 rounded"
                  >
                    {u}
                  </span>
                ))}
              </div>
              <address className="text-gray-700 text-sm not-italic">
                {formatAddress(address).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </address>
              <p className="text-xs text-gray-500 mt-2">
                Used in order{orders.length > 1 ? 's' : ''}:{' '}
                {orders.map((o, i) => (
                  <span key={o.id}>
                    {i > 0 && ', '}
                    <Link
                      href={`/account/orders/${encodeURIComponent(o.id)}`}
                      className="text-gray-700 underline hover:text-gray-900"
                    >
                      #{o.orderNumber}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
