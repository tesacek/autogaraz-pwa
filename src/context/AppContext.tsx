// src/context/AppContext.tsx
// Globální stav aplikace – nyní s Firebase Authentication
//
// Nové funkce:
// - user: přihlášený uživatel (nebo null)
// - authLoading: true dokud Firebase neověří stav přihlášení
// - login, loginWithGoogle, register, logout funkce
// - Firestore data jsou vázaná na uid uživatele

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react'
import type { User } from 'firebase/auth'

import type { SavedCar, Theme } from '../types'
import {
  watchFavorites,
  watchGarage,
  addToFavorites,
  removeFromFavorites,
  addToGarage,
  removeFromGarage,
  moveToGarage,
} from '../services/firebaseService'
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  logout as firebaseLogout,
  onAuthChanged,
} from '../services/authService'

// ─────────────────────────────────────────────────────────────────────────────
// TYPY
// ─────────────────────────────────────────────────────────────────────────────

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

type CarInput = Omit<SavedCar, 'id' | 'addedAt'>

interface AppContextValue {
  // Auth
  user: User | null
  authLoading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>

  // Theme
  theme: Theme
  toggleTheme: () => void

  // Favorites
  favorites: SavedCar[]
  favoritesLoading: boolean
  addFavorite: (car: CarInput) => Promise<void>
  removeFavorite: (id: string) => Promise<void>
  isFavorite: (modelId: string) => boolean

  // Garage
  garageCars: SavedCar[]
  garageLoading: boolean
  addToMyGarage: (car: CarInput) => Promise<void>
  removeFromMyGarage: (id: string) => Promise<void>
  moveCarToGarage: (car: SavedCar) => Promise<void>
  isInGarage: (modelId: string) => boolean

  // Toast
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | undefined>(undefined)

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // ── AUTH STATE ───────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChanged((firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithGoogle()
      showToast('Přihlášení proběhlo úspěšně 👋', 'success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Přihlášení selhalo'
      showToast(msg, 'error')
      throw error
    }
  }, [])

  const loginWithEmailFn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password)
      showToast('Přihlášení proběhlo úspěšně 👋', 'success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Přihlášení selhalo'
      showToast(msg, 'error')
      throw error
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    try {
      await registerWithEmail(email, password, name)
      showToast('Účet byl vytvořen 🎉', 'success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Registrace selhala'
      showToast(msg, 'error')
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    await firebaseLogout()
    showToast('Odhlášení proběhlo úspěšně', 'info')
  }, [])

  // ── THEME ────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('autogaraz-theme') as Theme) ?? 'dark'
  })

  useEffect(() => {
    const html = document.documentElement
    theme === 'dark' ? html.classList.add('dark') : html.classList.remove('dark')
    localStorage.setItem('autogaraz-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  // ── TOAST ────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  // ── FAVORITES ────────────────────────────────────────────────
  const [favorites, setFavorites] = useState<SavedCar[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)

  // Listener se spustí jen pokud je uživatel přihlášen
  useEffect(() => {
    if (!user) {
      setFavorites([])
      setFavoritesLoading(false)
      return
    }
    setFavoritesLoading(true)
    const unsubscribe = watchFavorites(
        user.uid,
        (cars) => { setFavorites(cars); setFavoritesLoading(false) },
        () => setFavoritesLoading(false)
    )
    return () => unsubscribe()
  }, [user])

  const addFavorite = useCallback(async (car: CarInput) => {
    if (!user) { showToast('Pro ukládání se musíte přihlásit', 'error'); return }
    try {
      await addToFavorites(user.uid, car)
      showToast(`${car.makeDisplay} ${car.modelName} přidán do oblíbených ⭐`, 'success')
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Chyba', 'error')
    }
  }, [user])

  const removeFavorite = useCallback(async (id: string) => {
    if (!user) return
    try {
      await removeFromFavorites(user.uid, id)
      showToast('Auto odstraněno z oblíbených', 'info')
    } catch {
      showToast('Nepodařilo se odstranit', 'error')
    }
  }, [user])

  const isFavorite = useCallback((modelId: string) => {
    return favorites.some(f => f.modelId === modelId)
  }, [favorites])

  // ── GARAGE ───────────────────────────────────────────────────
  const [garageCars, setGarageCars] = useState<SavedCar[]>([])
  const [garageLoading, setGarageLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setGarageCars([])
      setGarageLoading(false)
      return
    }
    setGarageLoading(true)
    const unsubscribe = watchGarage(
        user.uid,
        (cars) => { setGarageCars(cars); setGarageLoading(false) },
        () => setGarageLoading(false)
    )
    return () => unsubscribe()
  }, [user])

  const addToMyGarage = useCallback(async (car: CarInput) => {
    if (!user) { showToast('Pro ukládání se musíte přihlásit', 'error'); return }
    try {
      await addToGarage(user.uid, car)
      showToast(`${car.makeDisplay} ${car.modelName} přidán do garáže 🚗`, 'success')
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Chyba', 'error')
    }
  }, [user])

  const removeFromMyGarage = useCallback(async (id: string) => {
    if (!user) return
    try {
      await removeFromGarage(user.uid, id)
      showToast('Auto odstraněno z garáže', 'info')
    } catch {
      showToast('Nepodařilo se odstranit', 'error')
    }
  }, [user])

  const moveCarToGarage = useCallback(async (car: SavedCar) => {
    if (!user) return
    try {
      await moveToGarage(user.uid, car)
      showToast(`${car.makeDisplay} ${car.modelName} přesunut do garáže 🚗`, 'success')
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Chyba', 'error')
    }
  }, [user])

  const isInGarage = useCallback((modelId: string) => {
    return garageCars.some(c => c.modelId === modelId)
  }, [garageCars])

  // ── RENDER ───────────────────────────────────────────────────
  return (
      <AppContext.Provider value={{
        user, authLoading,
        loginWithGoogle, loginWithEmail: loginWithEmailFn, register, logout,
        theme, toggleTheme,
        favorites, favoritesLoading, addFavorite, removeFavorite, isFavorite,
        garageCars, garageLoading, addToMyGarage, removeFromMyGarage, moveCarToGarage, isInGarage,
        toasts, showToast,
      }}>
        {children}
        <ToastContainer toasts={toasts} />
      </AppContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST KONTEJNER
// ─────────────────────────────────────────────────────────────────────────────

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null
  return (
      <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map(toast => (
            <div
                key={toast.id}
                className={`
            animate-slide-up pointer-events-auto
            px-4 py-3 rounded-2xl text-sm font-medium shadow-card
            flex items-center gap-2 max-w-sm w-full
            ${toast.type === 'success' ? 'bg-green-900/90 border border-green-700/50 text-green-100' : ''}
            ${toast.type === 'error' ? 'bg-red-900/90 border border-red-700/50 text-red-100' : ''}
            ${toast.type === 'info' ? 'bg-garage-surface border border-garage-border text-white/90' : ''}
          `}
            >
              <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ'}</span>
              <span>{toast.message}</span>
            </div>
        ))}
      </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp musí být použit uvnitř AppProvider')
  return ctx
}