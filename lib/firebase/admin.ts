import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let app: App | null = null
let initError: Error | null = null

if (getApps().length === 0) {
  try {
    // Initialize Firebase Admin
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

    if (!serviceAccountKey) {
      initError = new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required'
      )
      console.error('❌ Firebase Admin: Missing FIREBASE_SERVICE_ACCOUNT_KEY')
    } else {
      let serviceAccount
      try {
        // Parse the JSON string
        serviceAccount = JSON.parse(serviceAccountKey)
        
        // Fix private key formatting if needed (handle escaped newlines)
        if (serviceAccount.private_key) {
          // Replace escaped newlines with actual newlines
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
        }

        // Validate required fields
        if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
          throw new Error('Service account JSON is missing required fields (project_id, private_key, or client_email)')
        }

        app = initializeApp({
          credential: cert(serviceAccount),
        })
        console.log('✅ Firebase Admin initialized successfully')
      } catch (parseError: any) {
        console.error('❌ Firebase Admin: Failed to parse service account key')
        console.error('Error:', parseError.message)
        initError = new Error(
          `Failed to parse Firebase service account key: ${parseError.message}. Please check your FIREBASE_SERVICE_ACCOUNT_KEY in .env.local`
        )
      }
    }
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization error:', error)
    initError = error instanceof Error ? error : new Error('Unknown Firebase Admin initialization error')
  }
} else {
  app = getApps()[0]
}

// Export with error handling
export const adminAuth = app ? getAuth(app) : null
export const adminDb = app ? getFirestore(app) : null

// Helper to check if admin is initialized
export const isAdminInitialized = () => {
  return app !== null && initError === null
}

// Helper to get initialization error
export const getInitError = () => initError

export default app
