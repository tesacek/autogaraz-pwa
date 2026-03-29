// src/pages/FavoritesPage.tsx
// Stránka s oblíbenými auty
//
// Zobrazuje všechna auta uložená v kolekci "favorites" ve Firestore
// Data jsou synchronizována real-time přes onSnapshot listener v AppContext
//
// Funkce:
// - Zobrazení karet oblíbených aut
// - Přesun auta z oblíbených do garáže (batch write v Firebase)
// - Odstranění z oblíbených
// - Navigace na detail auta
// - Prázdný stav s výzvou k přidání

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Star,
  Car,
  Trash2,
  ChevronRight,
  Zap,
  Timer,
  Fuel,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { SavedCar } from '../types'
import {
  PageLoading,
  EmptyState,
  SectionTitle,
} from '../components/ui'

// ─────────────────────────────────────────────────────────────────────────────
// FAVORITES PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function FavoritesPage() {
  const navigate = useNavigate()
  const {
    favorites,
    favoritesLoading,
    removeFavorite,
    moveCarToGarage,
  } = useApp()

  // Lokální stav pro potvrzovací dialog smazání
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  // ── LOADING ──────────────────────────────────────────────────
  if (favoritesLoading) {
    return (
      <div className="min-h-screen content-with-nav">
        <FavoritesHeader count={0} />
        <PageLoading message="Načítám oblíbená auta..." />
      </div>
    )
  }

  // ── HANDLERS ─────────────────────────────────────────────────

  const handleRemove = async (car: SavedCar) => {
    setActionId(car.id)
    try {
      await removeFavorite(car.id)
    } finally {
      setActionId(null)
      setDeletingId(null)
    }
  }

  const handleMoveToGarage = async (car: SavedCar) => {
    setActionId(car.id)
    try {
      await moveCarToGarage(car)
    } finally {
      setActionId(null)
    }
  }

  // ── PRÁZDNÝ STAV ─────────────────────────────────────────────
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen content-with-nav">
        <FavoritesHeader count={0} />
        <EmptyState
          icon="⭐"
          title="Žádná oblíbená auta"
          description="Procházejte katalog a hvězdičkou označte auta, která se vám líbí."
          action={{
            label: 'Prozkoumat katalog',
            onClick: () => navigate('/'),
          }}
        />
      </div>
    )
  }

  // ── HLAVNÍ RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen content-with-nav animate-fade-in">
      <FavoritesHeader count={favorites.length} />

      <div className="px-4 space-y-3">
        <SectionTitle>Oblíbená auta ({favorites.length})</SectionTitle>

        {favorites.map((car, index) => (
          <FavoriteCarCard
            key={car.id}
            car={car}
            index={index}
            isDeleting={deletingId === car.id}
            isActing={actionId === car.id}
            onNavigate={() => navigate(`/vehicle/${car.modelId}`)}
            onStartDelete={() => setDeletingId(car.id)}
            onCancelDelete={() => setDeletingId(null)}
            onConfirmDelete={() => handleRemove(car)}
            onMoveToGarage={() => handleMoveToGarage(car)}
          />
        ))}
      </div>

      {/* Tip */}
      <div className="px-4 py-6">
        <div className="card p-3 flex items-start gap-3">
          <span className="text-lg shrink-0">💡</span>
          <p className="text-xs text-white/40 leading-relaxed">
            Auta z oblíbených můžete přesunout do své garáže. V garáži pak můžete porovnat dvě auta vedle sebe.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-KOMPONENTY
// ─────────────────────────────────────────────────────────────────────────────

/** Záhlaví stránky oblíbených */
function FavoritesHeader({ count }: { count: number }) {
  return (
    <div className="px-4 pt-10 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-px bg-accent-gold" />
        <span className="text-xs font-mono text-accent-gold tracking-widest uppercase">
          Uloženo
        </span>
      </div>
      <h1 className="font-display text-4xl tracking-widest leading-none">
        OBLÍ<span className="text-gradient-gold">BENÁ</span>
      </h1>
      {count > 0 && (
        <p className="text-white/40 text-sm mt-1">{count} aut ve vašem seznamu</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// KARTA OBLÍBENÉHO AUTA
// ─────────────────────────────────────────────────────────────────────────────

interface FavoriteCarCardProps {
  car: SavedCar
  index: number
  isDeleting: boolean     // Zda je zobrazena potvrzovací lišta smazání
  isActing: boolean       // Zda probíhá async akce
  onNavigate: () => void
  onStartDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
  onMoveToGarage: () => void
}

function FavoriteCarCard({
  car,
  index,
  isDeleting,
  isActing,
  onNavigate,
  onStartDelete,
  onCancelDelete,
  onConfirmDelete,
  onMoveToGarage,
}: FavoriteCarCardProps) {
  return (
    <div
      className="card overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Hlavní obsah – kliknutelný pro navigaci */}
      <button
        onClick={onNavigate}
        className="w-full flex items-center gap-4 p-4 text-left group hover:bg-garage-elevated/50 transition-colors"
      >
        {/* Ikona */}
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center">
          <Star size={20} className="fill-accent-gold text-accent-gold" />
        </div>

        {/* Info o autě */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent-gold/70 uppercase tracking-wider">
              {car.makeDisplay}
            </span>
            {car.modelYear && (
              <span className="text-xs text-white/20 font-mono">{car.modelYear}</span>
            )}
          </div>
          <h3 className="font-semibold text-white mt-0.5 truncate">
            {car.modelName}
          </h3>
          {car.trimName && (
            <p className="text-xs text-white/40 truncate">{car.trimName}</p>
          )}

          {/* Mini specifikace */}
          <div className="flex items-center gap-3 mt-1.5">
            {car.powerPs && car.powerPs > 0 && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Zap size={10} className="text-accent-gold/60" />
                {car.powerPs} PS
              </span>
            )}
            {car.acceleration && car.acceleration > 0 && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Timer size={10} />
                {car.acceleration}s
              </span>
            )}
            {car.consumptionL100km && car.consumptionL100km > 0 && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Fuel size={10} />
                {car.consumptionL100km.toFixed(1)} l/100
              </span>
            )}
          </div>
        </div>

        <ChevronRight
          size={16}
          className="text-white/20 group-hover:text-white/50 shrink-0 transition-colors"
        />
      </button>

      {/* Akční lišta */}
      {!isDeleting ? (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-garage-border/50">
          {/* Přesunout do garáže */}
          <button
            onClick={onMoveToGarage}
            disabled={isActing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                       bg-garage-elevated border border-garage-border text-white/60
                       hover:border-accent-gold/30 hover:text-white transition-all active:scale-95
                       disabled:opacity-40"
          >
            <Car size={13} />
            Do garáže
          </button>

          <div className="flex-1" />

          {/* Smazat */}
          <button
            onClick={onStartDelete}
            disabled={isActing}
            className="p-2 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-900/20
                       transition-all active:scale-90 disabled:opacity-40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ) : (
        // Potvrzovací dialog smazání
        <div className="flex items-center gap-2 px-4 py-2 border-t border-red-900/30 bg-red-950/20">
          <span className="text-xs text-red-400 flex-1">Opravdu odstranit?</span>
          <button
            onClick={onCancelDelete}
            className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirmDelete}
            disabled={isActing}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-800/50 text-red-300 border border-red-700/50
                       hover:bg-red-800/80 transition-all active:scale-95 disabled:opacity-40"
          >
            Odstranit
          </button>
        </div>
      )}
    </div>
  )
}
