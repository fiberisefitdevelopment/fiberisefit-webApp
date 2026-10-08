'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Upload, ImageIcon, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ActiveTicketExistsError, createSupportTicket } from '@/services/ticketService'

// ─── Types ────────────────────────────────────────────────────────────────────

interface IssueWithOrderModalProps {
  isOpen: boolean
  onClose: () => void
  /** Pre-fill the order ID field (e.g. from account orders page) */
  prefillOrderId?: string
  /** Pre-fill the phone field from the parent (e.g. from useAuth in parent) */
  prefillPhone?: string
}

interface FormState {
  name: string
  phone: string
  orderId: string
  description: string
}

interface FormErrors {
  name?: string
  phone?: string
  description?: string
}

type SubmitState = 'idle' | 'uploading' | 'submitting' | 'success' | 'error'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_MB = 5
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// ─── Component ────────────────────────────────────────────────────────────────

export default function IssueWithOrderModal({
  isOpen,
  onClose,
  prefillOrderId = '',
  prefillPhone = '',
}: IssueWithOrderModalProps) {
  const { phone: authPhone, getIdToken } = useAuth()

  // Use prefillPhone from parent if provided, otherwise fall back to auth phone
  const resolvedPhone = prefillPhone || authPhone || ''
  const phoneDigits = resolvedPhone.replace(/\D/g, '').slice(-10)

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: phoneDigits,
    orderId: prefillOrderId,
    description: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null)
  const [existingTicketId, setExistingTicketId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Auto-fill phone whenever modal opens or phone resolves
  useEffect(() => {
    if (isOpen && phoneDigits) {
      setForm((prev) => ({ ...prev, phone: phoneDigits }))
    }
  }, [isOpen, phoneDigits])

  // Auto-fill orderId whenever modal opens
  useEffect(() => {
    if (isOpen && prefillOrderId) {
      setForm((prev) => ({ ...prev, orderId: prefillOrderId }))
    }
  }, [isOpen, prefillOrderId])

  // Auto-fill name from profile API
  useEffect(() => {
    let cancelled = false
    async function fetchName() {
      const token = await getIdToken()
      if (!token) return
      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok || cancelled) return
        const data = await res.json()
        const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ')
        if (fullName && !cancelled) {
          setForm((prev) => ({ ...prev, name: fullName }))
        }
      } catch {
        // ignore — user can fill manually
      }
    }
    if (isOpen) fetchName()
    return () => { cancelled = true }
  }, [isOpen, getIdToken])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm({ name: '', phone: '', orderId: prefillOrderId, description: '' })
        setErrors({})
        setImageFile(null)
        setImagePreview(null)
        setSubmitState('idle')
        setSubmitError(null)
        setGeneratedTicketId(null)
        setExistingTicketId(null)
      }, 300)
    }
  }, [isOpen, prefillOrderId])

  // ─── Image Handling ──────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setSubmitError('Please upload a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setSubmitError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`)
      return
    }
    setSubmitError(null)
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ─── Validation ──────────────────────────────────────────────────────────

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required.'
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Enter a valid 10-digit phone number.'
    }
    if (!form.description.trim()) {
      errs.description = 'Please describe the issue.'
    } else if (form.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ─── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitState('uploading')
    setSubmitError(null)
    setExistingTicketId(null)

    try {
      const result = await createSupportTicket({
        name: form.name,
        phone: form.phone,
        orderId: form.orderId || undefined,
        description: form.description,
        imageFile: imageFile,
      })

      setGeneratedTicketId(result.ticketId)
      setSubmitState('success')
    } catch (err: unknown) {
      if (err instanceof ActiveTicketExistsError) {
        const ticketRef = err.activeTicketId || err.activeTicketDocId || null
        setExistingTicketId(ticketRef)
        setSubmitError(
          ticketRef
            ? `You already have an active ticket (${ticketRef}). Please continue updates on that ticket.`
            : 'You already have an active ticket. Please continue updates on that ticket.'
        )
        setSubmitState('error')
        return
      }

      const msg = err instanceof Error ? err.message : String(err)
      console.error('[IssueWithOrderModal] Submit error:', msg, err)
      setSubmitError(`Submission failed: ${msg}`)
      setSubmitState('error')
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            Issue with Order
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* ── Success State ───────────────────────────────────── */}
          {submitState === 'success' ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900">
                Request Submitted!
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your request has been submitted successfully.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 w-full">
                <p className="text-sm text-gray-500 mb-1">Your Ticket ID</p>
                <p className="text-3xl font-bold text-black tracking-wider">
                  {generatedTicketId}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Our support team will contact you shortly on the provided phone number.
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form ───────────────────────────────────────────── */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Order ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.orderId}
                  onChange={(e) => setForm((p) => ({ ...p, orderId: e.target.value }))}
                  placeholder="e.g. 1021 or #1021"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Please describe the issue in detail..."
                  rows={4}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors resize-none ${
                    errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.description}
                    </p>
                  ) : <span />}
                  <span className="text-xs text-gray-400 ml-auto">
                    {form.description.length} chars
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attach Image{' '}
                  <span className="text-gray-400 font-normal">(optional, max {MAX_FILE_SIZE_MB}MB)</span>
                </label>

                {imagePreview ? (
                  /* Image preview */
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow border border-gray-200 text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-400 text-center pb-2">
                      {imageFile?.name}
                    </p>
                  </div>
                ) : (
                  /* Drop zone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="p-3 bg-gray-100 rounded-full">
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        <span className="underline">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        JPG, PNG, WebP up to {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Browse
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={handleFileInput}
                  className="hidden"
                  aria-label="Upload image"
                />
              </div>

              {/* Submission error */}
              {submitError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p>{submitError}</p>
                    {existingTicketId && (
                      <p className="mt-1 text-xs text-red-600">
                        Existing ticket reference: {existingTicketId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitState === 'uploading' || submitState === 'submitting'}
                className="w-full py-3.5 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {(submitState === 'uploading' || submitState === 'submitting') ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}
