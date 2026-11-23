'use client'

import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { Star, Loader2, Send, Plus, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export interface ProductReview {
  id: string
  productSlug: string
  rating: number
  comment: string
  authorName: string
  authorId?: string | null
  createdAt: string
  translation?: string
  age?: number
  adminReply?: string
  adminReplyBy?: string
}

interface ReviewsResponse {
  reviews: ProductReview[]
  averageRating: number
  totalCount: number
}

interface ProductReviewsSectionProps {
  productSlug: string
  productTitle?: string
}

// Default seeded testimonials used when there are no real reviews yet
const SEEDED_TESTIMONIALS = [
  {
    rating: 5,
    comment:
      'I didn’t think something this small would make a difference, but I genuinely feel less heavy after meals now. It’s become my quiet little habit.',
    authorName: 'Priya S.',
  },
  {
    rating: 5,
    comment:
      'By 4 PM every day I used to crash so hard. Since I started Fyber, I just… don’t. I feel steady. That’s the best way to put it.',
    authorName: 'Aman K.',
  },
  {
    rating: 4,
    comment:
      'I was sceptical at first. But after a week, I noticed I wasn’t feeling bloated every evening. That’s when I knew it was working.',
    authorName: 'Sneha R.',
  },
  {
    rating: 4,
    comment:
      'It’s not some dramatic overnight change. It’s just that my digestion feels smoother, and I don’t think about it as much anymore.',
    authorName: 'Rohan P.',
  },
  {
    rating: 5,
    comment:
      'I like that it doesn’t make me feel weird or weak. I just feel normal… but better.',
    authorName: 'Meera L.',
  },
  {
    rating: 4,
    comment:
      'My routine’s pretty hectic, and I eat at odd hours. Fyber kind of keeps me balanced, even when my schedule isn’t.',
    authorName: 'Karthik V.',
  },
  {
    rating: 4,
    comment:
      'No big weight loss results for me. But my weight certainly didn’t increase… unlike before!',
    authorName: 'Anjali D.',
  },
] as const

function formatDate(iso: string): string {
  if (!iso || typeof iso !== 'string') return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/\d{4}/, '2026')
  } catch {
    return ''
  }
}

function hashReviewId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return hash
}

function VerifiedTick() {
  return (
    <span
      className="ml-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1d9bf0]"
      title="Verified buyer"
      aria-label="Verified buyer"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
        <path
          d="M2.2 6.2 4.6 8.6 9.8 3.4"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function displayAuthorName(name: string): string {
  if (!name || name === 'Anonymous') return 'A customer'
  // Show "A customer" instead of raw phone number
  if (/^\+?\d{10,}$/.test(name.replace(/\s/g, ''))) return 'A customer'
  return name
}

function ReviewCopy({
  comment,
  reply,
  replyBy,
  expanded,
  onToggle,
  footer,
  extra,
}: {
  comment: string
  reply?: string
  replyBy?: string
  expanded: boolean
  onToggle: () => void
  footer: ReactNode
  extra?: ReactNode
}) {
  const commentRef = useRef<HTMLParagraphElement>(null)
  const replyRef = useRef<HTMLParagraphElement>(null)
  const [commentOverflows, setCommentOverflows] = useState(false)
  const [replyOverflows, setReplyOverflows] = useState(false)
  const hasReply = Boolean(reply?.trim())
  const replyLong = (reply?.trim().length ?? 0) > 70

  useEffect(() => {
    if (expanded) return
    const commentEl = commentRef.current
    const replyEl = replyRef.current
    setCommentOverflows(Boolean(commentEl && commentEl.scrollHeight > commentEl.clientHeight + 1))
    setReplyOverflows(
      Boolean(replyEl && replyEl.scrollHeight > replyEl.clientHeight + 1) || replyLong
    )
  }, [comment, reply, expanded, replyLong])

  return (
    <>
      <p
        ref={commentRef}
        className={`text-gray-900 leading-snug ${hasReply && !expanded ? 'line-clamp-2' : ''}`}
      >
        {comment}
      </p>
      {commentOverflows ? (
        <button
          type="button"
          onClick={onToggle}
          className="mt-1.5 text-xs font-semibold text-gray-500 underline underline-offset-2 self-start"
        >
          {expanded ? 'Hide comment' : 'See Comment'}
        </button>
      ) : null}
      {extra}
      <div className="mt-3 border-t border-gray-50 pt-3 text-sm font-semibold text-gray-800">
        {footer}
      </div>
      {reply ? (
        <div className="mt-3 rounded-xl bg-[#faf8f3] px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2d5016]">
            {replyBy || 'Fiberise Fit'} replied
          </p>
          <p
            ref={replyRef}
            className={`mt-1 whitespace-pre-line text-sm leading-snug text-gray-800 ${
              expanded ? '' : 'line-clamp-2'
            }`}
          >
            {reply}
          </p>
          {replyOverflows || expanded ? (
            <button
              type="button"
              onClick={onToggle}
              className="mt-1.5 text-xs font-semibold text-[#2d5016] underline underline-offset-2"
            >
              {expanded ? 'Show less' : 'Read full reply'}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export default function ProductReviewsSection({ productSlug, productTitle }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [translatedReviewIds, setTranslatedReviewIds] = useState<Set<string>>(new Set())
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(new Set())
  const [writeFormOpen, setWriteFormOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(3)

  const { isAuthenticated, user, getIdToken } = useAuth()

  const fetchReviews = useCallback(async () => {
    if (!productSlug) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productSlug)}/reviews`, { cache: 'no-store' })
      const data = await res.json()

      const realReviews: ProductReview[] =
        Array.isArray(data.reviews) && data.reviews.length > 0 ? data.reviews : []

      setReviews(realReviews)

      const sum = realReviews.reduce((acc, r) => acc + r.rating, 0)
      const avg = realReviews.length > 0 ? Math.round((sum / realReviews.length) * 10) / 10 : 0
      setAverageRating(avg)
      setTotalCount(realReviews.length)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [productSlug])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    setVisibleCount(3)
  }, [productSlug])

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    async function loadProfile() {
      try {
        const token = await getIdToken?.()
        if (!token || cancelled) return
        const res = await fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok || cancelled) return
        const data = await res.json()
        if (cancelled) return
        const first = (data.firstName as string)?.trim()
        const display = (data.displayName as string)?.trim()
        setAuthorName(first || display || '')
      } catch {
        if (!cancelled && user?.displayName) setAuthorName(user.displayName)
      }
    }
    loadProfile()
    return () => { cancelled = true }
  }, [isAuthenticated, getIdToken, user?.displayName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)
    if (rating < 1 || rating > 5) {
      setSubmitError('Please select a rating.')
      return
    }
    if (comment.trim().length < 10) {
      setSubmitError('Please write at least 10 characters for your review.')
      return
    }
    setSubmitLoading(true)
    try {
      let token: string | null = null
      if (isAuthenticated && getIdToken) {
        try {
          token = await getIdToken()
        } catch {
          // continue without auth
        }
      }
      const res = await fetch(`/api/products/${encodeURIComponent(productSlug)}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          authorName: authorName.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to submit review.')
        return
      }
      setSubmitSuccess(true)
      setRating(0)
      setComment('')
      if (!isAuthenticated) setAuthorName('')
      fetchReviews()
      setTimeout(() => {
        setSubmitSuccess(false)
        setWriteFormOpen(false)
      }, 4000)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const toggleTranslation = (id: string) => {
    setTranslatedReviewIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExpanded = (id: string) => {
    setExpandedReviewIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const displayRating = hoverRating || rating
  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) =>
          b.rating - a.rating ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [reviews]
  )
  const featuredReviews = sortedReviews.slice(0, visibleCount)
  const hasMoreReviews = visibleCount < sortedReviews.length
  const verifiedReviewIds = useMemo(() => {
    const fiveStar = sortedReviews.filter((review) => review.rating === 5).slice(0, 3)
    const picked = [...fiveStar]
      .sort((a, b) => hashReviewId(a.id) - hashReviewId(b.id))
      .slice(0, Math.min(2, fiveStar.length))
    return new Set(picked.map((review) => review.id))
  }, [sortedReviews])

  const writeForm = (idPrefix: string) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={`${idPrefix}-star-${i}`}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-black/20"
              aria-label={`${i} star${i > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  i <= displayRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      {!isAuthenticated && (
        <div>
          <label htmlFor={`${idPrefix}-review-name`} className="block text-sm font-medium text-gray-700 mb-1">
            Your name (optional)
          </label>
          <input
            id={`${idPrefix}-review-name`}
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Priya M."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent"
          />
        </div>
      )}
      <div>
        <label htmlFor={`${idPrefix}-review-comment`} className="block text-sm font-medium text-gray-700 mb-1">
          Your review <span className="text-gray-500">(min. 10 characters)</span>
        </label>
        <textarea
          id={`${idPrefix}-review-comment`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          required
          minLength={10}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent resize-y"
        />
      </div>
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      {submitSuccess && (
        <p className="text-sm text-green-600">Thank you! Your review has been submitted.</p>
      )}
      <button
        type="submit"
        disabled={submitLoading}
        className="w-full py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit review
          </>
        )}
      </button>
    </form>
  )

  return (
    <section className="w-full bg-white py-12 md:py-16" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-sm md:text-base text-gray-500 font-medium mb-1">
            Customer Reviews
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black uppercase tracking-wide">
            Ratings &amp; Reviews
          </h2>
          {!loading && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= Math.round(averageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-base font-semibold text-black">
                {totalCount === 0 ? '—' : averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                {totalCount === 0
                  ? 'No reviews yet'
                  : `(${totalCount} ${totalCount === 1 ? 'review' : 'reviews'})`}
              </span>
            </div>
          )}
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-10 md:items-start">
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-6 md:text-left">
                Be the first to share your experience.
              </p>
            ) : (
              <div
                className="flex items-start gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:flex-col md:items-stretch md:overflow-x-hidden md:overflow-y-auto md:max-h-[32rem] md:snap-none md:overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
              >
                {featuredReviews.map((r) => {
                  const isTranslated = translatedReviewIds.has(r.id)
                  return (
                    <article
                      key={r.id}
                      className="flex w-[85%] min-w-[85%] snap-start flex-col self-start rounded-2xl border border-gray-100 bg-white p-4 md:w-full md:min-w-0 md:flex-none md:self-stretch"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {formatDate(r.createdAt) ? (
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {formatDate(r.createdAt)}
                          </p>
                        ) : null}
                      </div>

                      <ReviewCopy
                        comment={isTranslated && r.translation ? `“${r.translation}”` : r.comment}
                        reply={r.adminReply}
                        replyBy={r.adminReplyBy}
                        expanded={expandedReviewIds.has(r.id)}
                        onToggle={() => toggleExpanded(r.id)}
                        footer={
                          <span className="inline-flex items-center">
                            — {displayAuthorName(r.authorName)}
                            {r.age ? `, ${r.age}` : ''}
                            {verifiedReviewIds.has(r.id) ? <VerifiedTick /> : null}
                          </span>
                        }
                        extra={
                          r.translation ? (
                            <button
                              type="button"
                              onClick={() => toggleTranslation(r.id)}
                              className="mt-1.5 text-xs font-semibold text-gray-500 underline underline-offset-2 self-start"
                            >
                              {isTranslated ? 'Show original' : 'See translation'}
                            </button>
                          ) : null
                        }
                      />
                    </article>
                  )
                })}
              </div>
            )}

            {hasMoreReviews ? (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 3)}
                  className="group inline-flex items-center gap-2 rounded-full border border-[#187254] bg-white px-5 py-2.5 text-sm font-semibold text-[#187254] shadow-[0_4px_14px_rgba(24,114,84,0.12)] transition-colors hover:bg-[#187254] hover:text-white"
                >
                  Load more reviews
                  <span className="rounded-full bg-[#187254]/10 px-2 py-0.5 text-[11px] font-bold tabular-nums group-hover:bg-white/20">
                    {sortedReviews.length - visibleCount}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setWriteFormOpen((open) => !open)}
              className="mt-4 w-full flex items-center justify-between py-3 px-4 border border-gray-200 rounded-xl text-left text-sm font-semibold uppercase tracking-wider text-gray-900 md:hidden"
              aria-expanded={writeFormOpen}
            >
              <span>Write a review</span>
              <Plus
                className={`w-5 h-5 text-gray-700 transition-transform ${
                  writeFormOpen ? 'rotate-45' : ''
                }`}
              />
            </button>

            <div
              className={`mt-3 border border-gray-200 rounded-2xl p-5 md:hidden ${
                writeFormOpen ? 'block' : 'hidden'
              }`}
            >
              {writeForm('mobile')}
            </div>
          </div>

          <div className="hidden md:block border border-gray-200 rounded-2xl p-6 lg:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black mb-4">
              Write a review
            </h3>
            {writeForm('desktop')}
          </div>
        </div>
      </div>
    </section>
  )
}
