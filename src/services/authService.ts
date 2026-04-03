// src/services/authService.ts
// Firebase Authentication servisní vrstva
//
// Podporované metody přihlášení:
// - Google Sign-In (popup)
// - Email + heslo (registrace / přihlášení)
// - Odhlášení
//
// onAuthChanged – real-time listener pro stav přihlášení

import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    type User,
    type Unsubscribe,
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE SIGN-IN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Přihlášení přes Google účet (popup okno)
 * @returns Firebase User objekt
 */
export async function signInWithGoogle(): Promise<User> {
    try {
        const result = await signInWithPopup(auth, googleProvider)
        return result.user
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string }
        // Uživatel zavřel popup – není to chyba
        if (err.code === 'auth/popup-closed-by-user') {
            throw new Error('Přihlášení bylo zrušeno')
        }
        if (err.code === 'auth/popup-blocked') {
            throw new Error('Popup byl zablokován prohlížečem. Povolte popupy pro tuto stránku.')
        }
        throw new Error(err.message ?? 'Přihlášení přes Google selhalo')
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL + HESLO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Přihlášení emailem a heslem
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result.user
    } catch (error: unknown) {
        const err = error as { code?: string }
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            throw new Error('Nesprávný email nebo heslo')
        }
        if (err.code === 'auth/too-many-requests') {
            throw new Error('Příliš mnoho pokusů. Zkuste to za chvíli.')
        }
        throw new Error('Přihlášení selhalo')
    }
}

/**
 * Registrace nového účtu emailem a heslem
 */
export async function registerWithEmail(
    email: string,
    password: string,
    displayName?: string
): Promise<User> {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password)

        // Nastavíme jméno pokud bylo zadáno
        if (displayName) {
            await updateProfile(result.user, { displayName })
        }

        return result.user
    } catch (error: unknown) {
        const err = error as { code?: string }
        if (err.code === 'auth/email-already-in-use') {
            throw new Error('Tento email je již registrován')
        }
        if (err.code === 'auth/weak-password') {
            throw new Error('Heslo musí mít alespoň 6 znaků')
        }
        if (err.code === 'auth/invalid-email') {
            throw new Error('Neplatný formát emailu')
        }
        throw new Error('Registrace selhala')
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ODHLÁŠENÍ
// ─────────────────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
    await signOut(auth)
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH STATE LISTENER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sleduje stav přihlášení real-time
 * Callback se zavolá okamžitě s aktuálním stavem a pak při každé změně
 * @returns unsubscribe funkce pro cleanup
 */
export function onAuthChanged(
    callback: (user: User | null) => void
): Unsubscribe {
    return onAuthStateChanged(auth, callback)
}

/**
 * Vrátí aktuálně přihlášeného uživatele (synchronně)
 * Může být null pokud uživatel není přihlášen nebo Firebase ještě nenačetl stav
 */
export function getCurrentUser(): User | null {
    return auth.currentUser
}