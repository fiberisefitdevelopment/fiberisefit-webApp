'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { Order } from '@/lib/orders/types'

/** Single tracking entry from fulfillments */
export interface ApiOrderTracking {
  company: string | null
  number: string | null
  url: string | null
}

/** Shape returned by GET /api/orders */
interface ApiOrder {
  id: string
  orderNumber: string
  email: string | null
  createdAt: string
  status: string
  financialStatus: string
  totalAmount: number
  currencyCode: string
  contactPhone: string | null
  deliveryStatus?: string | null
  tracking?: ApiOrderTracking[]
  shippingAddress: {
    name: string | null
    address1: string | null
    address2: string | null
    city: string | null
    province: string | null
    zip: string | null
    country: string | null
    phone: string | null
  } | null
  billingAddress: {
    name: string | null
    address1: string | null
    address2: string | null
    city: string | null
    province: string | null
    zip: string | null
    country: string | null
    phone: string | null
  } | null
  items: { title: string; quantity: number; price: number; image?: string }[]
}

function mapApiOrderToOrder(api: ApiOrder): Order {
  return {
    id: api.id,
    name: api.orderNumber,
    date: api.createdAt,
    total: api.totalAmount,
    currency: api.currencyCode,
    paymentStatus: api.financialStatus?.toUpperCase() || 'PENDING',
    fulfillmentStatus: api.status?.toUpperCase() || 'UNFULFILLED',
    items: api.items.map((i) => ({ title: i.title, quantity: i.quantity, price: i.price })),
  }
}

export interface OrderWithDetails extends Order {
  email: string | null
  contactPhone: string | null
  deliveryStatus?: string | null
  tracking?: ApiOrderTracking[]
  shippingAddress: ApiOrder['shippingAddress']
  billingAddress: ApiOrder['billingAddress']
  items: { title: string; quantity: number; price: number; image?: string }[]
}

export function mapApiOrderToOrderWithDetails(api: ApiOrder): OrderWithDetails {
  return {
    ...mapApiOrderToOrder(api),
    email: api.email,
    contactPhone: api.contactPhone,
    deliveryStatus: api.deliveryStatus ?? null,
    tracking: api.tracking ?? [],
    shippingAddress: api.shippingAddress,
    billingAddress: api.billingAddress,
    items: api.items,
  }
}

interface UseOrdersResult {
  orders: Order[]
  rawOrders: ApiOrder[]
  loading: boolean
  error: string | null
  hasNextPage: boolean
  loadMore: () => void
}

export function useOrders(): UseOrdersResult {
  const { getIdToken } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [rawOrders, setRawOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchOrders = async (after?: string | null) => {
    try {
      if (after) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const token = await getIdToken()
      if (!token) {
        setOrders([])
        setRawOrders([])
        setError('Not authenticated')
        setLoading(false)
        setLoadingMore(false)
        return
      }

      const url = new URL('/api/orders', window.location.origin)
      if (after) {
        url.searchParams.set('cursor', after)
      }

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        setOrders([])
        setRawOrders([])
        setHasNextPage(false)
        setCursor(null)
        setError('Not authenticated')
        return
      }

      const data = await res.json()
      const apiOrders: ApiOrder[] = data.orders || []
      const mapped = apiOrders.map(mapApiOrderToOrder)
      const pageInfo = data.pageInfo || { hasNextPage: false, endCursor: null }

      if (after) {
        setOrders((prev) => [...prev, ...mapped])
        setRawOrders((prev) => [...prev, ...apiOrders])
      } else {
        setOrders(mapped)
        setRawOrders(apiOrders)
      }

      setHasNextPage(!!pageInfo.hasNextPage)
      setCursor(pageInfo.endCursor || null)
    } catch (err: any) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = () => {
    if (hasNextPage && cursor && !loadingMore) {
      fetchOrders(cursor)
    }
  }

  return { orders, rawOrders, loading, error, hasNextPage, loadMore }
}
