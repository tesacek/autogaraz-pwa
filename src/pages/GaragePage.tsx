// src/pages/GaragePage.tsx
// Stránka "Moje Garáž"
//
// Zobrazuje všechna auta uložená v kolekci "garage" ve Firestore
// Hlavní funkce:
// 1. Grid uložených aut s klíčovými specifikacemi
// 2. Porovnání dvou aut vedle sebe (aktivuje se při 2+ autech)
// 3. Odstranění auta z garáže
// 4. Navigace na detail auta
//
// Porovnání aut:
// - Uživatel vybere 2 auta pomocí checkboxů
// - Zobrazí se srovnávací tabulka s klíčovými specs
// - Lepší hodnota je zvýrazněna zlatě

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car,
  Trash2,
  ChevronRight,
  Zap,
  Timer,
  Wind,
  GitCompare,
  X,
  CheckSquare,
  Square,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { SavedCar } from '../types'
import {
  PageLoading,
  EmptyState,
  SectionTitle,
} from '../components/ui'

// ─────────────────────────────────────────────────────────────────────────────
// GARAGE PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function GaragePage() {
  const navigate = useNavigate()
  const { garageCars, garageLoading, removeFromMyGarage } = useApp()

  // Vybraná auta pro porovnání (max 2)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])
  const [compareMode, setCompareMode] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  // ── LOADING ──────────────────────────────────────────────────
  if (garageLoading) {
    return (
      <div className="min-h-screen content-with-nav">
        <GarageHeader count={0} />
        <PageLoading message="Načítám garáž..." />
      </div>
    )
  }

  // ── PRÁZDNÝ STAV ─────────────────────────────────────────────
  if (garageCars.length === 0) {
    return (
      <div className="min-h-screen content-with-nav">
        <GarageHeader count={0} />
        <EmptyState
          icon="🏠"
          title="Garáž je prázdná"
          description="Přidejte auta do garáže z detailu vozu nebo z oblíbených."
          action={{
            label: 'Prozkoumat katalog',
            onClick: () => navigate('/'),
          }}
        />
      </div>
    )
  }

  // ── HANDLERS ─────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 2) return [prev[1], id]  // Max 2, nahradí první
      return [...prev, id]
    })
  }

  const handleRemove = async (car: SavedCar) => {
    setActionId(car.id)
    try {
      await removeFromMyGarage(car.id)
      setSelectedForCompare(prev => prev.filter(id => id !== car.id))
    } finally {
      setActionId(null)
      setDeletingId(null)
    }
  }

  // Dvě vybraná auta pro porovnání
  const carsToCompare = useMemo(() =>
    selectedForCompare
      .map(id => garageCars.find(c => c.id === id))
      .filter(Boolean) as SavedCar[],
    [selectedForCompare, garageCars]
  )

  const canCompare = garageCars.length >= 2

  // ── HLAVNÍ RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen content-with-nav animate-fade-in">
      <GarageHeader count={garageCars.length} />

      <div className="px-4 space-y-4">

        {/* ── POROVNÁNÍ BANNER ──────────────────────────────────── */}
        {canCompare && (
          <div className="card p-3 flex items-center gap-3">
            <GitCompare size={18} className="text-accent-gold shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {compareMode ? 'Vyberte 2 auta' : 'Porovnat auta'}
              </p>
              <p className="text-xs text-white/40">
                {compareMode
                  ? `Vybráno: ${selectedForCompare.length}/2`
                  : 'Porovnejte dvě auta vedle sebe'}
              </p>
            </div>
            <button
              onClick={() => {
                setCompareMode(prev => !prev)
                if (compareMode) setSelectedForCompare([])
              }}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95
                ${compareMode
                  ? 'bg-garage-elevated text-white/60 border border-garage-border'
                  : 'bg-accent-gold text-black'}
              `}
            >
              {compareMode ? 'Zrušit' : 'Porovnat'}
            </button>
          </div>
        )}

        {/* ── COMPARISON VIEW ───────────────────────────────────── */}
        {compareMode && selectedForCompare.length === 2 && (
          <ComparisonView
            cars={carsToCompare}
            onClose={() => {
              setCompareMode(false)
              setSelectedForCompare([])
            }}
            onNavigate={(modelId) => navigate(`/vehicle/${modelId}`)}
          />
        )}

        {/* ── SEZNAM AUT ────────────────────────────────────────── */}
        <SectionTitle>Moje auta ({garageCars.length})</SectionTitle>

        {garageCars.map((car, index) => (
          <GarageCarCard
            key={car.id}
            car={car}
            index={index}
            compareMode={compareMode}
            isSelected={selectedForCompare.includes(car.id)}
            isDeleting={deletingId === car.id}
            isActing={actionId === car.id}
            onNavigate={() => navigate(`/vehicle/${car.modelId}`)}
            onToggleSelect={() => toggleSelect(car.id)}
            onStartDelete={() => setDeletingId(car.id)}
            onCancelDelete={() => setDeletingId(null)}
            onConfirmDelete={() => handleRemove(car)}
          />
        ))}
      </div>

      <div className="h-6" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GARAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────

function GarageHeader({ count }: { count: number }) {
  return (
    <div className="px-4 pt-10 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-px bg-accent-gold" />
        <span className="text-xs font-mono text-accent-gold tracking-widest uppercase">
          Vaše kolekce
        </span>
      </div>
      <h1 className="font-display text-4xl tracking-widest leading-none">
        MÁ <span className="text-gradient-gold">GARÁŽ</span>
      </h1>
      {count > 0 && (
        <p className="text-white/40 text-sm mt-1">{count} aut ve vaší garáži</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GARAGE CAR CARD
// ─────────────────────────────────────────────────────────────────────────────

interface GarageCarCardProps {
  car: SavedCar
  index: number
  compareMode: boolean
  isSelected: boolean
  isDeleting: boolean
  isActing: boolean
  onNavigate: () => void
  onToggleSelect: () => void
  onStartDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
}

function GarageCarCard({
  car,
  index,
  compareMode,
  isSelected,
  isDeleting,
  isActing,
  onNavigate,
  onToggleSelect,
  onStartDelete,
  onCancelDelete,
  onConfirmDelete,
}: GarageCarCardProps) {
  return (
    <div
      className={`
        card overflow-hidden animate-slide-up transition-all duration-200
        ${isSelected ? 'border-accent-gold/50 shadow-gold' : ''}
      `}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Hlavní obsah */}
      <div className="flex items-center gap-3 p-4">
        {/* Compare checkbox */}
        {compareMode && (
          <button
            onClick={onToggleSelect}
            className="shrink-0 transition-all active:scale-90"
          >
            {isSelected
              ? <CheckSquare size={20} className="text-accent-gold" />
              : <Square size={20} className="text-white/30" />
            }
          </button>
        )}

        {/* Auto ikona */}
        <div className={`
          shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
          ${isSelected
            ? 'bg-accent-gold/20 border border-accent-gold/40'
            : 'bg-garage-elevated border border-garage-border'}
        `}>
          <Car size={20} className={isSelected ? 'text-accent-gold' : 'text-white/40'} />
        </div>

        {/* Info */}
        <button
          onClick={compareMode ? onToggleSelect : onNavigate}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent-gold/70 uppercase tracking-wider">
              {car.makeDisplay}
            </span>
            {car.modelYear && (
              <span className="text-xs text-white/20 font-mono">{car.modelYear}</span>
            )}
          </div>
          <h3 className="font-semibold text-white mt-0.5 truncate">{car.modelName}</h3>
          {car.trimName && (
            <p className="text-xs text-white/40 truncate">{car.trimName}</p>
          )}

          {/* Mini specs */}
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
            {car.topSpeedKph && car.topSpeedKph > 0 && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Wind size={10} />
                {car.topSpeedKph} km/h
              </span>
            )}
          </div>
        </button>

        {/* Detail šipka (pouze mimo compare mode) */}
        {!compareMode && (
          <button
            onClick={onNavigate}
            className="shrink-0 p-2 text-white/20 hover:text-white/50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Akční lišta */}
      {!compareMode && (
        !isDeleting ? (
          <div className="flex items-center justify-end px-4 py-2 border-t border-garage-border/50">
            <button
              onClick={onStartDelete}
              disabled={isActing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/30
                         hover:text-red-400 hover:bg-red-900/20 transition-all active:scale-95 disabled:opacity-40"
            >
              <Trash2 size={13} />
              Odebrat
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 border-t border-red-900/30 bg-red-950/20">
            <span className="text-xs text-red-400 flex-1">Odstranit z garáže?</span>
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
        )
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON VIEW
// Srovnávací tabulka dvou aut
// ─────────────────────────────────────────────────────────────────────────────

interface ComparisonViewProps {
  cars: SavedCar[]
  onClose: () => void
  onNavigate: (modelId: string) => void
}

// Porovnávací řádek – vrací true pokud je první hodnota lepší
type CompareDir = 'higher' | 'lower'  // 'higher' = větší číslo je lepší

interface CompareRow {
  label: string
  getValue: (car: SavedCar) => number | null
  unit: string
  direction: CompareDir
}

const COMPARE_ROWS: CompareRow[] = [
  {
    label: 'Výkon',
    getValue: c => c.powerPs ?? null,
    unit: 'PS',
    direction: 'higher',
  },
  {
    label: 'Výkon (kW)',
    getValue: c => c.powerKw ?? null,
    unit: 'kW',
    direction: 'higher',
  },
  {
    label: '0–100 km/h',
    getValue: c => c.acceleration ?? null,
    unit: 's',
    direction: 'lower',   // Nižší čas = lepší
  },
  {
    label: 'Max. rychlost',
    getValue: c => c.topSpeedKph ?? null,
    unit: 'km/h',
    direction: 'higher',
  },
  {
    label: 'Spotřeba',
    getValue: c => c.consumptionL100km ?? null,
    unit: 'l/100km',
    direction: 'lower',   // Nižší spotřeba = lepší
  },
  {
    label: 'Objem motoru',
    getValue: c => c.engineCc ? c.engineCc / 1000 : null,
    unit: 'L',
    direction: 'higher',
  },
]

function ComparisonView({ cars, onClose, onNavigate }: ComparisonViewProps) {
  if (cars.length < 2) return null
  const [car1, car2] = cars

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Hlavička porovnání */}
      <div className="flex items-center justify-between p-4 border-b border-garage-border">
        <div className="flex items-center gap-2">
          <GitCompare size={16} className="text-accent-gold" />
          <span className="text-sm font-semibold text-white">Porovnání</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-white/30 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Hlavičky aut */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-garage-elevated/50">
        <div />  {/* Placeholder pro label sloupec */}
        {[car1, car2].map((car, i) => (
          <button
            key={car.id}
            onClick={() => onNavigate(car.modelId)}
            className="text-center group"
          >
            <div className={`
              w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1
              ${i === 0 ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-red-900/30 border border-red-700/30'}
            `}>
              <Car size={14} className={i === 0 ? 'text-blue-400' : 'text-red-400'} />
            </div>
            <p className="text-[10px] font-mono text-accent-gold/70 uppercase">{car.makeDisplay}</p>
            <p className="text-xs font-semibold text-white truncate group-hover:text-accent-gold transition-colors">
              {car.modelName}
            </p>
            <p className="text-[10px] text-white/30">{car.modelYear}</p>
          </button>
        ))}
      </div>

      {/* Porovnávací řádky */}
      <div className="divide-y divide-garage-border/50">
        {COMPARE_ROWS.map(row => {
          const val1 = row.getValue(car1)
          const val2 = row.getValue(car2)

          // Určení vítěze – null hodnoty nevyhrají
          let winner: 0 | 1 | null = null
          if (val1 !== null && val2 !== null) {
            if (row.direction === 'higher') {
              winner = val1 > val2 ? 0 : val1 < val2 ? 1 : null
            } else {
              winner = val1 < val2 ? 0 : val1 > val2 ? 1 : null
            }
          }

          return (
            <div key={row.label} className="grid grid-cols-3 items-center px-3 py-2.5">
              {/* Label */}
              <span className="text-xs text-white/30">{row.label}</span>

              {/* Hodnoty */}
              {[val1, val2].map((val, i) => (
                <div key={i} className="text-center">
                  {val !== null ? (
                    <span className={`
                      text-sm font-mono font-semibold
                      ${winner === i ? 'text-accent-gold' : 'text-white/60'}
                    `}>
                      {val % 1 === 0 ? val : val.toFixed(1)}
                      <span className="text-[10px] font-normal text-white/30 ml-0.5">{row.unit}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-white/20">—</span>
                  )}
                  {/* Vítěz indikátor */}
                  {winner === i && (
                    <div className="text-[9px] text-accent-gold/70 font-mono">▲</div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Tip */}
      <div className="p-3 border-t border-garage-border/50 bg-garage-elevated/30">
        <p className="text-[10px] text-white/20 text-center font-mono">
          Zlatě zvýrazněné hodnoty = lepší v daném parametru
        </p>
      </div>
    </div>
  )
}
