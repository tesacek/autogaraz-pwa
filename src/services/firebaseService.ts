// src/services/firebaseService.ts
// Firebase Firestore servisní vrstva
//
// Tato vrstva abstrahuje všechny Firestore operace:
// - Přidání/odebrání oblíbeného auta
// - Přidání auta do garáže
// - Přesun auta z oblíbených do garáže
// - Načtení všech uložených aut
//
// Struktura Firestore kolekcí:
//
// /favorites/{docId}
//   makeId: string
//   makeDisplay: string
//   modelName: string
//   modelYear: string
//   trimName: string
//   modelId: string
//   powerPs: number
//   ... (SavedCar fields)
//   addedAt: number (timestamp)
//
// /garage/{docId}
//   ... (stejná struktura jako favorites)

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

import { db, COLLECTIONS } from '../lib/firebase'
import type { SavedCar } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// POMOCNÉ FUNKCE
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// FAVORITES (OBLÍBENÁ) OPERACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Načte všechna oblíbená auta z Firestore
 * Seřazeno od nejnovějšího po nejstarší (addedAt DESC)
 */
export async function getFavorites(): Promise<SavedCar[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.FAVORITES),
      orderBy('addedAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(docSnap => ({
      ...docSnap.data() as Omit<SavedCar, 'id'>,
      id: docSnap.id,
    }))
  } catch (error) {
    console.error('[Firebase] Chyba při načítání oblíbených:', error)
    throw error
  }
}

/**
 * Přidá auto do oblíbených
 * Kontroluje duplicity – stejné auto nelze přidat dvakrát
 * @returns ID nově vytvořeného dokumentu
 */
export async function addToFavorites(
  car: Omit<SavedCar, 'id' | 'addedAt'>
): Promise<string> {
  try {
    // Kontrola duplicit – hledáme auto se stejným modelId
    const existingQuery = query(
      collection(db, COLLECTIONS.FAVORITES),
      where('modelId', '==', car.modelId)
    )
    const existing = await getDocs(existingQuery)

    if (!existing.empty) {
      throw new Error('Toto auto je již v oblíbených')
    }

    // Přidáme auto s časovým razítkem
    const docRef = await addDoc(collection(db, COLLECTIONS.FAVORITES), {
      ...car,
      addedAt: Date.now(),
    })

    console.log('[Firebase] Auto přidáno do oblíbených:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('[Firebase] Chyba při přidávání do oblíbených:', error)
    throw error
  }
}

/**
 * Odstraní auto z oblíbených
 * @param docId Firestore document ID
 */
export async function removeFromFavorites(docId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.FAVORITES, docId))
    console.log('[Firebase] Auto odstraněno z oblíbených:', docId)
  } catch (error) {
    console.error('[Firebase] Chyba při odstraňování z oblíbených:', error)
    throw error
  }
}

/**
 * Zkontroluje zda je auto již v oblíbených
 * @param modelId CarQuery model_id
 */
export async function isInFavorites(modelId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, COLLECTIONS.FAVORITES),
      where('modelId', '==', modelId)
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error('[Firebase] Chyba při kontrole oblíbených:', error)
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GARAGE (GARÁŽ) OPERACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Načte všechna auta z garáže
 * Seřazeno od nejnovějšího po nejstarší
 */
export async function getGarageCars(): Promise<SavedCar[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.GARAGE),
      orderBy('addedAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(docSnap => ({
      ...docSnap.data() as Omit<SavedCar, 'id'>,
      id: docSnap.id,
    }))
  } catch (error) {
    console.error('[Firebase] Chyba při načítání garáže:', error)
    throw error
  }
}

/**
 * Přidá auto do garáže
 */
export async function addToGarage(
  car: Omit<SavedCar, 'id' | 'addedAt'>
): Promise<string> {
  try {
    const existingQuery = query(
      collection(db, COLLECTIONS.GARAGE),
      where('modelId', '==', car.modelId)
    )
    const existing = await getDocs(existingQuery)

    if (!existing.empty) {
      throw new Error('Toto auto je již ve vaší garáži')
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.GARAGE), {
      ...car,
      addedAt: Date.now(),
    })

    console.log('[Firebase] Auto přidáno do garáže:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('[Firebase] Chyba při přidávání do garáže:', error)
    throw error
  }
}

/**
 * Odstraní auto z garáže
 */
export async function removeFromGarage(docId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.GARAGE, docId))
    console.log('[Firebase] Auto odstraněno z garáže:', docId)
  } catch (error) {
    console.error('[Firebase] Chyba při odstraňování z garáže:', error)
    throw error
  }
}

/**
 * Přesune auto z oblíbených do garáže
 * Používá Firestore batch write pro atomickou operaci:
 * - Přidá do garáže
 * - Odstraní z oblíbených
 * Obě operace proběhnou najednou, nebo selžou obě
 */
export async function moveToGarage(favoriteCar: SavedCar): Promise<void> {
  try {
    // Kontrola duplicit v garáži
    const existingQuery = query(
      collection(db, COLLECTIONS.GARAGE),
      where('modelId', '==', favoriteCar.modelId)
    )
    const existing = await getDocs(existingQuery)

    if (!existing.empty) {
      throw new Error('Toto auto je již ve vaší garáži')
    }

    // Batch write – atomická operace
    const batch = writeBatch(db)

    // Přidáme do garáže (nový dokument)
    const garageDocRef = doc(collection(db, COLLECTIONS.GARAGE))
    const { id: _id, ...carWithoutId } = favoriteCar
    batch.set(garageDocRef, {
      ...carWithoutId,
      addedAt: Date.now(), // Obnovíme timestamp
    })

    // Odstraníme z oblíbených
    const favDocRef = doc(db, COLLECTIONS.FAVORITES, favoriteCar.id)
    batch.delete(favDocRef)

    // Commit – provede obě operace najednou
    await batch.commit()
    console.log('[Firebase] Auto přesunuto do garáže:', favoriteCar.modelName)
  } catch (error) {
    console.error('[Firebase] Chyba při přesunu do garáže:', error)
    throw error
  }
}

/**
 * Aktualizuje poznámky k autu v garáži
 */
export async function updateCarNotes(
  collectionName: string,
  docId: string,
  notes: string
): Promise<void> {
  try {
    await updateDoc(doc(db, collectionName, docId), { notes })
  } catch (error) {
    console.error('[Firebase] Chyba při aktualizaci poznámek:', error)
    throw error
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL-TIME LISTENERS
// onSnapshot sleduje změny v Firestore real-time
// Vrací unsubscribe funkci pro cleanup
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sleduje oblíbená auta real-time
 * Callback se zavolá při každé změně kolekce
 */
export function watchFavorites(
  callback: (cars: SavedCar[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.FAVORITES),
    orderBy('addedAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const cars = snapshot.docs.map(docSnap => ({
        ...docSnap.data() as Omit<SavedCar, 'id'>,
        id: docSnap.id,
      }))
      callback(cars)
    },
    (error) => {
      console.error('[Firebase] Chyba v real-time listeneru (favorites):', error)
      onError?.(error)
    }
  )
}

/**
 * Sleduje garáž real-time
 */
export function watchGarage(
  callback: (cars: SavedCar[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.GARAGE),
    orderBy('addedAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const cars = snapshot.docs.map(docSnap => ({
        ...docSnap.data() as Omit<SavedCar, 'id'>,
        id: docSnap.id,
      }))
      callback(cars)
    },
    (error) => {
      console.error('[Firebase] Chyba v real-time listeneru (garage):', error)
      onError?.(error)
    }
  )
}
