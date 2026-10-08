import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate Firebase config
const isConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )
}

// Lazy singleton — only initialized when first accessed
let _app: FirebaseApp | null = null
let _auth: Auth | null = null

function getFirebaseApp(): FirebaseApp {
  if (_app) return _app
  if (getApps().length > 0) {
    _app = getApps()[0]
    return _app
  }
  if (!isConfigValid()) {
    throw new Error(
      'Firebase configuration is incomplete. Please set all NEXT_PUBLIC_FIREBASE_* environment variables.'
    )
  }
  _app = initializeApp(firebaseConfig)
  return _app
}

function getFirebaseAuth(): Auth {
  if (_auth) return _auth
  _auth = getAuth(getFirebaseApp())
  return _auth
}

/** Lazy proxy — importing this file does NOT initialize Firebase.
 *  Firebase only boots when `auth` is actually accessed at runtime. */
export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    const realAuth = getFirebaseAuth()
    const value = Reflect.get(realAuth, prop, receiver)
    return typeof value === 'function' ? value.bind(realAuth) : value
  },
})

export default new Proxy({} as FirebaseApp, {
  get(_target, prop, receiver) {
    const realApp = getFirebaseApp()
    const value = Reflect.get(realApp, prop, receiver)
    return typeof value === 'function' ? value.bind(realApp) : value
  },
})
