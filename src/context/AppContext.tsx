// src/context/AppContext.tsx
// Hlavní React Context pro globální stav aplikace
//
// Spravuje:
// 1. Theme (dark/light) – uloženo v localStorage
// 2. Oblíbená auta (favorites) – synchronizováno s Firestore real-time
// 3. Auta v garáži (garage) – synchronizováno s Firestore real-time
// 4. Toast notifikace
//
// Komponenty přistupují k tomuto stavu přes custom hook useApp()
// Real-time Firestore listenery zajišťují okamžitou synchronizaci

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from "react"

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

// ─────────────────────────────────────────────────────────────────────────────
// TYPY
// ─────────────────────────────────────────────────────────────────────────────

/** Toast notifikace */
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

/** Hodnoty poskytované contextemu */
interface AppContextValue {
  // Theme
  theme: Theme
  toggleTheme: () => void

  // Favorites
  favorites: SavedCar[]
  favoritesLoading: boolean
  addFavorite: (car: {
    makeId: string;
    makeDisplay: string;
    modelName: string;
    modelYear: string;
    trimName: string;
    modelId: string;
    powerPs: number | undefined;
    powerKw: number | undefined;
    engineCc: number | undefined;
    fuelType: string | undefined;
    topSpeedKph: number | undefined;
    acceleration: number | undefined;
    consumptionL100km: number | undefined
  }) => Promise<void>
  removeFavorite: (id: string) => Promise<void>
  isFavorite: (modelId: string) => boolean

  // Garage
  garageCars: SavedCar[]
  garageLoading: boolean
  addToMyGarage: (car: {
    makeId: string;
    makeDisplay: string;
    modelName: string;
    modelYear: string;
    trimName: string;
    modelId: string;
    powerPs: number | undefined;
    powerKw: number | undefined;
    engineCc: number | undefined;
    fuelType: string | undefined;
    topSpeedKph: number | undefined;
    acceleration: number | undefined;
    consumptionL100km: number | undefined
  }) => Promise<void>
  removeFromMyGarage: (id: string) => Promise<void>
  moveCarToGarage: (car: SavedCar) => Promise<void>
  isInGarage: (modelId: string) => boolean

  // Toast notifikace
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT VYTVOŘENÍ
// ─────────────────────────────────────────────────────────────────────────────

// Vytvoříme context s undefined jako výchozí hodnota
// Tím zajistíme error pokud se hook použije mimo Provider
const AppContext = createContext<AppContextValue | undefined>(undefined)

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER KOMPONENTA
// ─────────────────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // ── THEME STATE ──────────────────────────────────────────────
  // Načteme theme z localStorage, výchozí je dark
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('autogaraz-theme') as Theme) ?? 'dark'
  })

  // Aplikujeme theme na <html> element pomocí CSS třídy
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    // Uložíme do localStorage pro persistence
    if (typeof theme === "string") {
      localStorage.setItem('autogaraz-theme', theme)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  // ── FAVORITES STATE ──────────────────────────────────────────
  const [favorites, setFavorites] = useState<SavedCar[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)

  // Subscribeujeme na real-time updates z Firestore
  // useEffect cleanup odstraní listener při unmountu
  useEffect(() => {
    const unsubscribe = watchFavorites(
      (cars) => {
        setFavorites(cars)
        setFavoritesLoading(false)
      },
      (error) => {
        console.error('Chyba při načítání oblíbených:', error)
        setFavoritesLoading(false)
        // Pokud Firebase není nakonfigurovaný, tiše selžeme
      }
    )

    // Cleanup při unmountu komponenty
    return () => unsubscribe()
  }, [])

  const addFavorite = useCallback(async (car: Omit<SavedCar, 'id' | 'addedAt'>) => {
    try {
      await addToFavorites(car)
      showToast(`${car.makeDisplay} ${car.modelName} přidán do oblíbených ⭐`, 'success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Nepodařilo se přidat do oblíbených'
      showToast(msg, 'error')
    }
  }, [])

  const removeFavorite = useCallback(async (id: string) => {
    try {
      await removeFromFavorites(id)
      showToast('Auto odstraněno z oblíbených', 'info')
    } catch {
      showToast('Nepodařilo se odstranit z oblíbených', 'error')
    }
  }, [])

  const isFavorite = useCallback((modelId: string): boolean => {
    return favorites.some(f => f.modelId === modelId)
  }, [favorites])

  // ── GARAGE STATE ─────────────────────────────────────────────
  const [garageCars, setGarageCars] = useState<SavedCar[]>([])
  const [garageLoading, setGarageLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = watchGarage(
      (cars) => {
        setGarageCars(cars)
        setGarageLoading(false)
      },
      (error) => {
        console.error('Chyba při načítání garáže:', error)
        setGarageLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const addToMyGarage = useCallback(async (car: Omit<SavedCar, 'id' | 'addedAt'>) => {
    try {
      await addToGarage(car)
      showToast(`${car.makeDisplay} ${car.modelName} přidán do garáže 🚗`, 'success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Nepodařilo se přidat do garáže'
      showToast(msg, 'error')
    }
  }, [])

  const removeFromMyGarage = useCallback(async (id: string) => {
    try {
      await removeFromGarage(id)
      showToast('Auto odstraněno z garáže', 'info')
    } catch {
      showToast('Nepodařilo se odstranit z garáže', 'error')
    }
  }, [])

  const moveCarToGarage = useCallback(async (car: SavedCar) => {
    try {
      await moveToGarage(car)
      showToast(`${car.makeDisplay} ${car.modelName} přesunut do garáže 🚗`, 'success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Nepodařilo se přesunout do garáže'
      showToast(msg, 'error')
    }
  }, [])

  const isInGarage = useCallback((modelId: string): boolean => {
    return garageCars.some(c => c.modelId === modelId)
  }, [garageCars])

  // ── TOAST NOTIFIKACE ─────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = { id, message, type }

    setToasts(prev => [...prev, toast])

    // Auto-hide po 3 sekundách
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  // ── RENDER ───────────────────────────────────────────────────
  const value: AppContextValue = {
    theme,
    toggleTheme,
    favorites,
    favoritesLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    garageCars,
    garageLoading,
    addToMyGarage,
    removeFromMyGarage,
    moveCarToGarage,
    isInGarage,
    toasts,
    showToast,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Toast kontejner – renderuje notifikace */}
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
// CUSTOM HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook pro přístup k AppContext
 * Háže error pokud se použije mimo AppProvider
 */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp musí být použit uvnitř AppProvider')
  }
  return ctx
}
