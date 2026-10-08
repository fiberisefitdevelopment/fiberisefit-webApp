'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OTPModal({ isOpen, onClose }: OTPModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneDigits, setPhoneDigits] = useState('') // Store only the 10 digits, not +91
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  useEffect(() => {
    if (isOpen && step === 'phone') {
      // Check if Firebase auth is initialized
      if (!auth) {
        setError('Firebase is not initialized. Please check your configuration.')
        return
      }

      // Initialize reCAPTCHA
      if (!recaptchaVerifierRef.current) {
        try {
          console.log('🔐 Initializing reCAPTCHA...')
          recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('✅ reCAPTCHA verified')
            },
            'expired-callback': () => {
              console.error('⚠️ reCAPTCHA expired')
              setError('reCAPTCHA expired. Please try again.')
            },
          })
          console.log('✅ reCAPTCHA initialized successfully')
        } catch (err: any) {
          console.error('❌ reCAPTCHA initialization error:', err)
          setError(`Failed to initialize reCAPTCHA: ${err.message || 'Unknown error'}. Please refresh the page and try again.`)
        }
      }
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear()
        } catch (err) {
          // Ignore errors during cleanup
        }
        recaptchaVerifierRef.current = null
      }
    }
  }, [isOpen, step])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '')
    
    // Limit to 10 digits (Indian phone numbers)
    const limitedDigits = digitsOnly.slice(0, 10)
    
    // Store only the digits (without +91)
    setPhoneDigits(limitedDigits)
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA not initialized')
      }

      // Validate phone number format (should be 10 digits)
      if (phoneDigits.length !== 10) {
        throw new Error('Please enter a valid 10-digit Indian phone number')
      }

      // Format as +91 followed by 10 digits
      const formattedPhone = '+91' + phoneDigits
      console.log('📞 Attempting to send OTP to:', formattedPhone)
      console.log('🔐 reCAPTCHA verifier:', recaptchaVerifierRef.current ? 'Ready' : 'Not ready')

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current
      )
      
      console.log('✅ OTP sent successfully')

      setConfirmationResult(confirmation)
      setStep('otp')
    } catch (err: any) {
      console.error('Error sending OTP:', err)
      console.error('Error code:', err.code)
      console.error('Error message:', err.message)
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to send OTP. Please check your phone number and try again.'
      
      if (err.code === 'auth/invalid-app-credential') {
        errorMessage = `Firebase configuration error (${err.code}). Please ensure:
1. Phone Authentication is enabled in Firebase Console
2. Go to Firebase Console → Authentication → Sign-in method → Enable "Phone"
3. Check API key restrictions in Google Cloud Console
4. Verify reCAPTCHA is properly configured`
      } else if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please enter a valid 10-digit Indian phone number.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.'
      } else if (err.code === 'auth/captcha-check-failed') {
        errorMessage = 'reCAPTCHA verification failed. Please refresh the page and try again.'
      } else if (err.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please contact support or try again later.'
      } else if (err.code === 'auth/app-not-authorized') {
        errorMessage = 'Firebase app not authorized. Please check your Firebase project settings.'
      } else if (err.message) {
        errorMessage = `${err.message}${err.code ? ` (${err.code})` : ''}`
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    console.group('🔐 OTP SUBMIT FLOW')
    console.log('Step 0: Form submitted')
  
    setError(null)
    setLoading(true)
  
    try {
      // 1️⃣ Confirmation result check
      console.log('Step 1: Checking confirmationResult')
      if (!confirmationResult) {
        throw new Error('Confirmation result not found')
      }
  
      // 2️⃣ OTP verification
      console.log('Step 2: Confirming OTP', { otp })
      const userCredential = await confirmationResult.confirm(otp)
      console.log('✅ OTP verified')
  
      // 3️⃣ Firebase user object
      const firebaseUser = userCredential.user
      console.log('Step 3: Firebase user', {
        uid: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber,
      })
  
      // 4️⃣ ID token generation
      console.log('Step 4: Fetching ID token')
      const idToken = await firebaseUser.getIdToken(true)
      console.log('✅ ID token received', {
        tokenLength: idToken.length,
        tokenPreview: idToken.substring(0, 20) + '...',
      })
  
      // 5️⃣ Backend request
      console.log('Step 5: Calling /api/user')
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      })
  
      console.log('Step 6: Backend response', {
        status: response.status,
        ok: response.ok,
      })
  
      // 6️⃣ Backend error handling
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error response:', errorText)
        throw new Error(errorText || 'Failed to initialize user')
      }
  
      const data = await response.json().catch(() => null)
      console.log('✅ Backend success response:', data)
  
      // 7️⃣ Success cleanup
      console.log('Step 7: Auth flow complete — resetting UI')
      onClose()
      setStep('phone')
      setPhoneDigits('')
      setOtp('')
      setConfirmationResult(null)
    } catch (err: any) {
      console.error('❌ OTP FLOW FAILED:', err)
      setError(err.message || 'Invalid OTP. Please check and try again.')
    } finally {
      setLoading(false)
      console.groupEnd()
    }
  }
  

  const handleClose = () => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear()
      recaptchaVerifierRef.current = null
    }
    setStep('phone')
    setPhoneDigits('')
    setOtp('')
    setError(null)
    setConfirmationResult(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* reCAPTCHA Container (hidden) */}
          <div id="recaptcha-container" />

          {/* Content */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-6">
              {step === 'phone' ? 'Login with Phone' : 'Enter OTP'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                      maxLength={10}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your 10-digit mobile number (India)
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center text-2xl tracking-widest"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the 6-digit code sent to +91{phoneDigits}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone')
                    setOtp('')
                    setError(null)
                    setPhoneDigits('')
                  }}
                  className="w-full text-sm text-gray-600 underline"
                >
                  Change phone number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
