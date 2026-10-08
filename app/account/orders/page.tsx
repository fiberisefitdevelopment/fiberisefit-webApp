'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOrders } from '@/hooks/useOrders'
import { Eye } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const PAGE_SIZE = 10

type TicketStatus = 'open' | 'in_progress' | 'closed'

interface ActiveTicket {
  id: string
  ticketId: string | null
  name: string | null
  phone: string | null
  orderId: string | null
  description: string | null
  imageUrl: string | null
  status: TicketStatus | string | null
  createdAt: string | null
}

interface TicketComment {
  id: string
  message: string
  authorName: string | null
  authorType: 'user' | 'agent' | 'system' | string
  createdAt: string | null
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const { rawOrders, loading, error, hasNextPage, loadMore } = useOrders()
  const { phone: authPhone } = useAuth()
  const [page, setPage] = useState(1)
  const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(null)
  const [loadingTicket, setLoadingTicket] = useState(false)
  const [ticketError, setTicketError] = useState<string | null>(null)
  const [comments, setComments] = useState<TicketComment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  useEffect(() => {
    if (error === 'Not authenticated') {
      router.push('/account/login')
    }
  }, [error, router])

  useEffect(() => {
    const phoneDigits = (authPhone || '').replace(/\D/g, '').slice(-10)
    if (!phoneDigits) return

    let cancelled = false
    async function fetchActiveTicket() {
      setLoadingTicket(true)
      setTicketError(null)
      try {
        const [openRes, inProgressRes] = await Promise.all([
          fetch('/api/support/tickets?status=open&limit=500'),
          fetch('/api/support/tickets?status=in_progress&limit=500'),
        ])

        if (!openRes.ok || !inProgressRes.ok) {
          throw new Error('Failed to load support tickets')
        }

        const openJson = (await openRes.json()) as { tickets?: ActiveTicket[] }
        const inProgressJson = (await inProgressRes.json()) as { tickets?: ActiveTicket[] }
        const pool = [...(inProgressJson.tickets || []), ...(openJson.tickets || [])]

        const found = pool.find((ticket) => {
          const ticketPhoneDigits = (ticket.phone || '').replace(/\D/g, '').slice(-10)
          return ticketPhoneDigits === phoneDigits
        }) || null

        if (!cancelled) setActiveTicket(found)
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Failed to load active ticket'
          setTicketError(msg)
        }
      } finally {
        if (!cancelled) setLoadingTicket(false)
      }
    }

    fetchActiveTicket()
    return () => { cancelled = true }
  }, [authPhone])

  useEffect(() => {
    if (!activeTicket) {
      setComments([])
      return
    }
    const ticketId = activeTicket.id

    let cancelled = false
    async function fetchComments() {
      setLoadingComments(true)
      setCommentError(null)
      try {
        const res = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}/comments`)
        if (!res.ok) throw new Error('Failed to load ticket comments')
        const data = (await res.json()) as { comments?: TicketComment[] }
        if (!cancelled) setComments(data.comments || [])
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Failed to load comments'
          setCommentError(msg)
        }
      } finally {
        if (!cancelled) setLoadingComments(false)
      }
    }

    fetchComments()
    return () => { cancelled = true }
  }, [activeTicket?.id])

  const totalPages = Math.max(1, Math.ceil(rawOrders.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const paginatedOrders = rawOrders.slice(start, start + PAGE_SIZE)
  const canNext = page < totalPages
  const canPrev = page > 1

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

  const formatStatus = (status: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'fulfilled' || s === 'delivered') return 'Completed'
    if (s === 'refunded') return 'Refunded'
    if (s === 'failed' || s === 'voided') return 'Failed'
    return status || 'Pending'
  }

  const isRefunded = (order: { financialStatus?: string }) =>
    (order.financialStatus || '').toUpperCase() === 'REFUNDED'

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const submitComment = async () => {
    const ticketId = activeTicket?.id
    if (!ticketId || !commentInput.trim()) return

    setCommentSubmitting(true)
    setCommentError(null)
    try {
      const res = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: commentInput.trim(),
          authorType: 'user',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string }
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to post comment')
      }

      setCommentInput('')
      const commentsRes = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}/comments`)
      if (commentsRes.ok) {
        const commentsData = (await commentsRes.json()) as { comments?: TicketComment[] }
        setComments(commentsData.comments || [])
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to post comment'
      setCommentError(msg)
    } finally {
      setCommentSubmitting(false)
    }
  }

  if (error && error !== 'Not authenticated') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Orders</h1>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <section className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Support Ticket</h2>
        {loadingTicket ? (
          <p className="text-sm text-gray-600">Checking your active ticket...</p>
        ) : ticketError ? (
          <p className="text-sm text-red-600">{ticketError}</p>
        ) : !activeTicket ? (
          <p className="text-sm text-gray-600">No active ticket found for your account.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-gray-900">
                  {activeTicket.ticketId || activeTicket.id}
                </p>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                  {(activeTicket.status || 'open').toString().replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{activeTicket.description || 'No description'}</p>
              <p className="text-xs text-gray-500 mt-2">Created: {formatDateTime(activeTicket.createdAt)}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation</h3>
              {loadingComments ? (
                <p className="text-sm text-gray-600">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-600">No comments yet. You can post an update below.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      <p className="text-sm text-gray-900">{comment.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(comment.authorType || 'user').toUpperCase()} • {formatDateTime(comment.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 space-y-2">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write an update or question..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                {commentError ? <p className="text-xs text-red-600">{commentError}</p> : null}
                <button
                  type="button"
                  onClick={submitComment}
                  disabled={commentSubmitting || !commentInput.trim()}
                  className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {commentSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {loading && rawOrders.length === 0 ? (
        <p className="text-gray-600">Loading your orders...</p>
      ) : rawOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Order</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Delivery</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Total</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const refunded = isRefunded(order)
                  const itemCount = order.items?.reduce((n, i) => n + (i.quantity || 0), 0) || 0
                  return (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-4 px-2 text-gray-900 font-medium">
                        #{order.orderNumber?.replace(/^#/, '') || order.id}
                      </td>
                      <td className="py-4 px-2 text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={
                            refunded
                              ? 'text-amber-700 font-medium'
                              : order.status === 'FULFILLED' || order.status === 'fulfilled'
                                ? 'text-green-700 font-medium'
                                : 'text-gray-700'
                          }
                        >
                          {refunded ? 'Refunded' : formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-gray-600">
                        {order.deliveryStatus || (order.tracking?.length ? 'Tracking added' : '—')}
                        {order.tracking?.length ? (
                          <span className="block text-xs text-gray-500 mt-0.5">
                            {order.tracking[0].number ?? order.tracking[0].company ?? ''}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-4 px-2 text-gray-700">
                        {refunded ? (
                          <span>
                            <span className="line-through">
                              ₹{order.totalAmount?.toFixed(2) ?? '0.00'}
                            </span>{' '}
                            <span className="text-green-600 font-medium">₹0.00</span>
                            {' '}for {itemCount} item{itemCount !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span>
                            ₹{order.totalAmount?.toFixed(2) ?? '0.00'} for {itemCount} item{itemCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-center">
                        <Link
                          href={`/account/orders/${encodeURIComponent(order.id)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!canNext}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
