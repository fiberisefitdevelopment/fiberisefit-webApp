'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Loader2, Send } from 'lucide-react'
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
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

function displayAuthorName(name: string): string {
  if (!name || name === 'Anonymous') return 'A customer'
  // Show "A customer" instead of raw phone number
  if (/^\+?\d{10,}$/.test(name.replace(/\s/g, ''))) return 'A customer'
  return name
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
      setTimeout(() => setSubmitSuccess(false), 4000)
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

  const displayRating = hoverRating || rating

  return (
    <section className="w-full bg-white py-12 md:py-16" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-sm md:text-base text-gray-500 font-medium mb-1">
            Customer Reviews
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black uppercase tracking-wide">
            Ratings &amp; Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Left: rating summary + add review form */}
          <div className="lg:col-span-1 space-y-8">
            {/* Summary */}
            <div className="bg-[#F5F3EF] rounded-2xl p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i <= Math.round(averageRating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-black">
                      {totalCount === 0 ? '—' : averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {totalCount === 0
                      ? 'No reviews yet. Be the first to review!'
                      : `${totalCount} ${totalCount === 1 ? 'review' : 'reviews'}`}
                  </p>
                </>
              )}
            </div>

            {/* Add review form */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black mb-4">
                Write a review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
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
                    <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your name (optional)
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Priya M."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Your review <span className="text-gray-500">(min. 10 characters)</span>
                  </label>
                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    required
                    minLength={10}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent resize-y"
                  />
                </div>
                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}
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
            </div>
          </div>

          {/* Right: review list */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-6">
              All reviews
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 py-8">No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="max-h-[26rem] overflow-y-auto pr-1 scrollbar-hide">
                <ul className="space-y-6">
                  {reviews.map((r) => {
                    const isTranslated = translatedReviewIds.has(r.id)
                    return (
                      <li
                        key={r.id}
                        className="group bg-white border border-gray-100 rounded-2xl p-5 md:p-6 transition-all hover:shadow-md hover:border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
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
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {formatDate(r.createdAt)}
                          </p>
                        </div>
                        
                        <div className="relative">
                          {/* Original Comment */}
                          {!isTranslated && (
                            <p className="text-gray-900 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                              {r.comment}
                            </p>
                          )}
                          
                          {/* Translation */}
                          {isTranslated && r.translation && (
                            <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-100/50 animate-in fade-in zoom-in-95 duration-300">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">English Translation</span>
                              </div>
                              <p className="text-gray-800 leading-relaxed italic">
                                “{r.translation}”
                              </p>
                            </div>
                          )}
                          
                          {/* See Translation Button - Right Aligned Below Text */}
                          {r.translation && (
                            <div className="flex justify-end mt-3">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleTranslation(r.id)
                                }}
                                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all flex items-center gap-2 border shadow-sm ${
                                  isTranslated 
                                    ? 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' 
                                    : 'bg-black text-white border-black hover:bg-gray-800'
                                }`}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                {isTranslated ? 'Show Original' : 'See Translation'}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50/50">
                          <p className="text-sm font-semibold text-gray-800">
                            — {displayAuthorName(r.authorName)}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
