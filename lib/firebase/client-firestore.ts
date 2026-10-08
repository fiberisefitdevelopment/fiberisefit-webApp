/**
 * Client-side Firestore + Storage instances.
 * Uses Firebase v9 modular SDK.
 * Safe to import in 'use client' components.
 */

import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import app from '@/lib/firebase/config'

export const db = getFirestore(app)
export const storage = getStorage(app)
