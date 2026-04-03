// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAbx7X--Gi2DkJ6bLjqYBqTFk2EbW2WgV4",
  authDomain: "autogaraz-pwa.firebaseapp.com",
  projectId: "autogaraz-pwa",
  storageBucket: "autogaraz-pwa.firebasestorage.app",
  messagingSenderId: "466247070533",
  appId: "1:466247070533:web:ac8794714dcb2c3ba3442c"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

let analytics
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app)
  }
} catch (e) {
  console.warn('Firebase Analytics nelze inicializovat:', e)
}
export { analytics }

// Kolekce jsou nyní oddělené per uživatel: /users/{uid}/favorites/{docId}
export const COLLECTIONS = {
  FAVORITES: 'favorites',
  GARAGE: 'garage',
} as const

// Helper: vrátí cestu ke kolekci pro přihlášeného uživatele
export function userCollection(uid: string, col: string) {
  return `users/${uid}/${col}`
}

export default app