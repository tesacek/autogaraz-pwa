// src/lib/firebase.ts
// Firebase v10 inicializace a konfigurace
// 
// SETUP INSTRUKCE:
// 1. Jdi na https://console.firebase.google.com
// 2. Vytvoř nový projekt "autogaraz"
// 3. V Project Settings > General najdi "Your apps" > Add app > Web
// 4. Zkopíruj config objekt a nahraď hodnoty níže
// 5. V Firebase Console aktivuj Firestore Database (Start in test mode pro vývoj)
//
// BEZPEČNOST: V produkci nastav Firestore Security Rules!
// Příklad rules:
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /{document=**} {
//         allow read, write: if true; // POUZE PRO VÝVOJ!
//       }
//     }
//   }

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// ⚠️ NAHRAĎ SVÝMI HODNOTAMI Z FIREBASE CONSOLE ⚠️
// Tyto hodnoty jsou veřejné (API key pro Firebase je bezpečný na klientu),
// bezpečnost zajišťují Firestore Security Rules
// Import the functions you need from the SDKs you need
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbx7X--Gi2DkJ6bLjqYBqTFk2EbW2WgV4",
  authDomain: "autogaraz-pwa.firebaseapp.com",
  projectId: "autogaraz-pwa",
  storageBucket: "autogaraz-pwa.firebasestorage.app",
  messagingSenderId: "466247070533",
  appId: "1:466247070533:web:ac8794714dcb2c3ba3442c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializace Firestore databáze
// getFirestore vrátí referenci na Firestore instanci
export const db = getFirestore(app)

// Inicializace Analytics (volitelné, pouze v prohlížeči)
// Zabaleno v try/catch protože v SSR prostředí nefunguje
let analytics
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app)
  }
} catch (e) {
  console.warn('Firebase Analytics nelze inicializovat:', e)
}
export { analytics }

// Pojmenované kolekce v Firestore
// Centralizujeme názvy kolekcí aby bylo snadné je změnit
export const COLLECTIONS = {
  FAVORITES: 'favorites',  // Oblíbená auta uživatele
  GARAGE: 'garage',         // Auta v garáži uživatele
} as const

export default app
