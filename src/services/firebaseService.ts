// src/services/firebaseService.ts
// Firebase Firestore servisní vrstva – s podporou autentizace
//
// Data jsou uložena per uživatel:
// /users/{uid}/favorites/{docId}
// /users/{uid}/garage/{docId}
//
// Každá funkce vyžaduje uid (user ID) jako první parametr.

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  writeBatch,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'

import { db } from '../lib/firebase'
import type { SavedCar } from '../types'

// Helper: cesta ke kolekci pro daného uživatele
function userCol(uid: string, col: string) {
  return collection(db, 'users', uid, col)
}
function userDoc(uid: string, col: string, docId: string) {
  return doc(db, 'users', uid, col, docId)
}

// ─────────────────────────────────────────────────────────────────────────────
// FAVORITES
// ─────────────────────────────────────────────────────────────────────────────

export async function getFavorites(uid: string): Promise<SavedCar[]> {
  try {
    const q = query(userCol(uid, 'favorites'), orderBy('addedAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ ...d.data() as Omit<SavedCar, 'id'>, id: d.id }))
  } catch (error) {
    console.error('[Firebase] Chyba při načítání oblíbených:', error)
    throw error
  }
}

export async function addToFavorites(
    uid: string,
    car: Omit<SavedCar, 'id' | 'addedAt'>
): Promise<string> {
  try {
    const existing = await getDocs(
        query(userCol(uid, 'favorites'), where('modelId', '==', car.modelId))
    )
    if (!existing.empty) throw new Error('Toto auto je již v oblíbených')

    const docRef = await addDoc(userCol(uid, 'favorites'), { ...car, addedAt: Date.now() })
    return docRef.id
  } catch (error) {
    console.error('[Firebase] Chyba při přidávání do oblíbených:', error)
    throw error
  }
}

export async function removeFromFavorites(uid: string, docId: string): Promise<void> {
  try {
    await deleteDoc(userDoc(uid, 'favorites', docId))
  } catch (error) {
    console.error('[Firebase] Chyba při odstraňování z oblíbených:', error)
    throw error
  }
}

export async function isInFavorites(uid: string, modelId: string): Promise<boolean> {
  try {
    const q = query(userCol(uid, 'favorites'), where('modelId', '==', modelId))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GARAGE
// ─────────────────────────────────────────────────────────────────────────────

export async function getGarageCars(uid: string): Promise<SavedCar[]> {
  try {
    const q = query(userCol(uid, 'garage'), orderBy('addedAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ ...d.data() as Omit<SavedCar, 'id'>, id: d.id }))
  } catch (error) {
    console.error('[Firebase] Chyba při načítání garáže:', error)
    throw error
  }
}

export async function addToGarage(
    uid: string,
    car: Omit<SavedCar, 'id' | 'addedAt'>
): Promise<string> {
  try {
    const existing = await getDocs(
        query(userCol(uid, 'garage'), where('modelId', '==', car.modelId))
    )
    if (!existing.empty) throw new Error('Toto auto je již ve vaší garáži')

    const docRef = await addDoc(userCol(uid, 'garage'), { ...car, addedAt: Date.now() })
    return docRef.id
  } catch (error) {
    console.error('[Firebase] Chyba při přidávání do garáže:', error)
    throw error
  }
}

export async function removeFromGarage(uid: string, docId: string): Promise<void> {
  try {
    await deleteDoc(userDoc(uid, 'garage', docId))
  } catch (error) {
    console.error('[Firebase] Chyba při odstraňování z garáže:', error)
    throw error
  }
}

export async function moveToGarage(uid: string, favoriteCar: SavedCar): Promise<void> {
  try {
    const existing = await getDocs(
        query(userCol(uid, 'garage'), where('modelId', '==', favoriteCar.modelId))
    )
    if (!existing.empty) throw new Error('Toto auto je již ve vaší garáži')

    const batch = writeBatch(db)

    const garageDocRef = doc(userCol(uid, 'garage'))
    const { id: _id, ...carWithoutId } = favoriteCar
    batch.set(garageDocRef, { ...carWithoutId, addedAt: Date.now() })

    batch.delete(userDoc(uid, 'favorites', favoriteCar.id))

    await batch.commit()
  } catch (error) {
    console.error('[Firebase] Chyba při přesunu do garáže:', error)
    throw error
  }
}

export async function updateCarNotes(
    uid: string,
    collectionName: string,
    docId: string,
    notes: string
): Promise<void> {
  try {
    await updateDoc(userDoc(uid, collectionName, docId), { notes })
  } catch (error) {
    console.error('[Firebase] Chyba při aktualizaci poznámek:', error)
    throw error
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL-TIME LISTENERS
// ─────────────────────────────────────────────────────────────────────────────

export function watchFavorites(
    uid: string,
    callback: (cars: SavedCar[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
  const q = query(userCol(uid, 'favorites'), orderBy('addedAt', 'desc'))
  return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map(d => ({ ...d.data() as Omit<SavedCar, 'id'>, id: d.id })))
      },
      (error) => {
        console.error('[Firebase] Chyba v listeneru (favorites):', error)
        onError?.(error)
      }
  )
}

export function watchGarage(
    uid: string,
    callback: (cars: SavedCar[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
  const q = query(userCol(uid, 'garage'), orderBy('addedAt', 'desc'))
  return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map(d => ({ ...d.data() as Omit<SavedCar, 'id'>, id: d.id })))
      },
      (error) => {
        console.error('[Firebase] Chyba v listeneru (garage):', error)
        onError?.(error)
      }
  )
}