'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useOrders } from '@/hooks/useOrders'
import { FileDown } from 'lucide-react'
import IssueWithOrderModal from '@/components/IssueWithOrderModal'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getIdToken, phone } = useAuth()
  const { rawOrders, loading, error } = useOrders()
  const orderId = typeof params?.id === 'string' ? decodeURIComponent(params.id) : ''
  const order = rawOrders.find((o) => o.id === orderId)

  const [inlineTrackingUrl, setInlineTrackingUrl] = useState<string | null>(null)
  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const displayStatus =
    order?.financialStatus?.toUpperCase() === 'REFUNDED'
      ? 'Refunded'
      : order?.status === 'FULFILLED' || order?.status === 'fulfilled'
        ? 'Completed'
        : order?.status || 'Pending'

  if (error === 'Not authenticated') {
    router.push('/account/login')
    return null
  }

  if (loading && rawOrders.length === 0) {
    return (
      <div>
        <p className="text-gray-600">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
        <p className="text-gray-600 mb-4">We couldn’t find this order.</p>
        <Link
          href="/account/orders"
          className="inline-flex px-4 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const orderNumber = order.orderNumber?.replace(/^#/, '') || order.id
  const isRefunded = order.financialStatus?.toUpperCase() === 'REFUNDED'

  const handleDownloadInvoice = async () => {
    setInvoiceError(null)
    setInvoiceLoading(true)
    try {
      const token = await getIdToken()
      if (!token) {
        setInvoiceError('Please sign in again.')
        return
      }
      const res = await fetch(
        `/api/shiprocket/invoice?orderNumber=${encodeURIComponent(orderNumber)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      if (!res.ok) {
        setInvoiceError(data?.error ?? 'Could not get invoice')
        return
      }
      if (data?.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer')
      } else {
        setInvoiceError('No invoice URL returned')
      }
    } catch (e) {
      setInvoiceError(e instanceof Error ? e.message : 'Failed to download invoice')
    } finally {
      setInvoiceLoading(false)
    }
  }

  const subtotal = order.items?.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  ) ?? order.totalAmount
  const shipping = Math.max(0, order.totalAmount - subtotal)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Order #{orderNumber}
      </h1>
      <p className="text-gray-600 mb-6">
        Order #{orderNumber} was placed on {formatDate(order.createdAt)} and is
        currently <strong>{displayStatus}</strong>.
      </p>

      {/* Delivery status and tracking */}
      {(order.status === 'FULFILLED' || order.status === 'fulfilled') && !isRefunded && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 font-medium">
            {order.deliveryStatus || 'Your order has been shipped.'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Dispatched on: {formatShortDate(order.createdAt)}
          </p>
          {order.tracking && order.tracking.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
              <p className="text-sm font-semibold text-gray-900">Tracking</p>
              {order.tracking.map((t, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 text-sm">
                  {t.company && <span className="text-gray-600">{t.company}</span>}
                  {t.number && (
                    <span className="font-mono text-gray-800">
                      {t.url ? (
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {t.number}
                        </a>
                      ) : (
                        t.number
                      )}
                    </span>
                  )}
                  {t.url && (
                    <button
                      type="button"
                      onClick={() => setInlineTrackingUrl(t.url!)}
                      className="inline-flex px-2 py-1 rounded bg-black text-white text-xs font-medium hover:bg-gray-800"
                    >
                      Track
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <h2 className="text-lg font-bold text-gray-900 mb-3">Order details</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-4 text-gray-800">
                  {item.title} × {item.quantity ?? 1}
                </td>
                <td className="py-3 px-4 text-right text-gray-800">
                  ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-gray-700">
          <span className="font-medium">Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {shipping > 0 && (
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Shipping:</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span className="font-medium">Payment method:</span>
          <span>Credit / Debit Card / NetBanking / UPI</span>
        </div>
        {isRefunded && (
          <>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Refund:</span>
              <span>- ₹{order.totalAmount?.toFixed(2) ?? '0.00'}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2">
              <span>Total:</span>
              <span>
                <span className="line-through text-gray-500">
                  ₹{order.totalAmount?.toFixed(2) ?? '0.00'}
                </span>{' '}
                <span className="text-green-600">₹0.00</span>
              </span>
            </div>
          </>
        )}
        {!isRefunded && (
          <div className="flex justify-between text-base font-semibold text-gray-900 pt-2">
            <span>Total:</span>
            <span>₹{order.totalAmount?.toFixed(2) ?? '0.00'}</span>
          </div>
        )}
      </div>

      {(order.billingAddress || order.shippingAddress) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Billing address
            </h3>
            {order.billingAddress ? (
              <address className="text-gray-600 text-sm not-italic">
                {order.billingAddress.name && <p>{order.billingAddress.name}</p>}
                {order.billingAddress.address1 && <p>{order.billingAddress.address1}</p>}
                {order.billingAddress.address2 && <p>{order.billingAddress.address2}</p>}
                <p>
                  {[order.billingAddress.city, order.billingAddress.province, order.billingAddress.zip]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {order.billingAddress.country && <p>{order.billingAddress.country}</p>}
                {order.billingAddress.phone && <p className="mt-1">{order.billingAddress.phone}</p>}
                {order.email && <p>{order.email}</p>}
              </address>
            ) : (
              <p className="text-gray-500 text-sm">No billing address on file.</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Shipping address
            </h3>
            {order.shippingAddress ? (
              <address className="text-gray-600 text-sm not-italic">
                {order.shippingAddress.name && <p>{order.shippingAddress.name}</p>}
                {order.shippingAddress.address1 && <p>{order.shippingAddress.address1}</p>}
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>
                  {[order.shippingAddress.city, order.shippingAddress.province, order.shippingAddress.zip]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                {order.shippingAddress.phone && <p className="mt-1">{order.shippingAddress.phone}</p>}
              </address>
            ) : (
              <p className="text-gray-500 text-sm">No shipping address on file.</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownloadInvoice}
          disabled={invoiceLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown className="w-4 h-4" />
          {invoiceLoading ? 'Loading…' : 'Download invoice'}
        </button>
        <button
          type="button"
          onClick={() => setIssueModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Issue with order ?
        </button>
      </div>

      <IssueWithOrderModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        prefillOrderId={order?.orderNumber ?? ''}
        prefillPhone={phone ?? ''}
      />

      {invoiceError && (
        <p className="mt-2 text-sm text-red-600">{invoiceError}</p>
      )}

      {inlineTrackingUrl && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">Live shipment tracking</p>
              <button
                type="button"
                onClick={() => setInlineTrackingUrl(null)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="bg-gray-50 border-t border-gray-200">
              <iframe
                src={inlineTrackingUrl}
                className="w-full h-[520px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
