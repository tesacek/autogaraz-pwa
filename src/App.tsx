// src/App.tsx
// Hlavní komponenta aplikace – definice routeru a struktury
//
// React Router v6 struktura:
// /                           → HomePage (brand cards)
// /makes/:makeId/models       → ModelsPage
// /makes/:makeId/models/:modelName/years         → YearsPage
// /makes/:makeId/models/:modelName/years/:year/trims → TrimsPage
// /vehicle/:modelId           → CarDetailPage
// /favorites                  → FavoritesPage
// /garage                     → GaragePage
// /settings                   → SettingsPage
//
// AppProvider obaluje vše a poskytuje globální stav
// BottomNav je fixní a zobrazuje se na všech stránkách

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { BottomNav } from './components/BottomNav'

// Stránky
import { HomePage } from './pages/HomePage'
import { ModelsPage, YearsPage } from './pages/ModelsPage'
import { TrimsPage } from './pages/TrimsPage'
import { CarDetailPage } from './pages/CarDetailPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { GaragePage } from './pages/GaragePage'
import { SettingsPage } from './pages/SettingsPage'

// ─────────────────────────────────────────────────────────────────────────────
// APP LAYOUT
// Wrapper s BottomNav – sdílená layout komponenta
// ─────────────────────────────────────────────────────────────────────────────

function AppLayout() {
  const location = useLocation()

  // Na stránce nastavení skryjeme bottom nav
  const hideNav = location.pathname === '/settings'

  return (
    <div className="relative max-w-md mx-auto min-h-screen">
      {/* Hlavní obsah */}
      <main>
        <Routes>
          {/* Domovská stránka – brand karty */}
          <Route path="/" element={<HomePage />} />

          {/* Modely pro danou značku */}
          <Route path="/makes/:makeId/models" element={<ModelsPage />} />

          {/* Ročníky pro daný model */}
          <Route
            path="/makes/:makeId/models/:modelName/years"
            element={<YearsPage />}
          />

          {/* Výbavy pro daný model a rok */}
          <Route
            path="/makes/:makeId/models/:modelName/years/:year/trims"
            element={<TrimsPage />}
          />

          {/* Detail vozidla */}
          <Route path="/vehicle/:modelId" element={<CarDetailPage />} />

          {/* Oblíbená auta */}
          <Route path="/favorites" element={<FavoritesPage />} />

          {/* Moje garáž */}
          <Route path="/garage" element={<GaragePage />} />

          {/* Nastavení */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Fixní bottom navigace */}
      {!hideNav && <BottomNav />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 404 NOT FOUND
// ─────────────────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
      <div className="font-display text-8xl text-white/5">404</div>
      <div>
        <h2 className="text-white font-semibold text-xl">Stránka nenalezena</h2>
        <p className="text-white/40 text-sm mt-1">Tato stránka neexistuje.</p>
      </div>
      <a href="/public" className="btn-primary">
        Zpět domů
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HLAVNÍ APP KOMPONENTA
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    // BrowserRouter – HTML5 history API pro navigaci bez # v URL
    <BrowserRouter>
      {/* AppProvider poskytuje globální stav všem child komponentám */}
      <AppProvider>
        {/* Tmavé pozadí + grain texture pro celou app */}
        <div className="bg-garage-bg min-h-screen noise">
          <AppLayout />
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}
