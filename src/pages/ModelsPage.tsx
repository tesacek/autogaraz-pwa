// src/pages/ModelsPage.tsx
// Stránka se seznamem modelů pro vybranou značku
//
// URL: /makes/:makeId/models
// Načítá modely z CarQuery API: cmd=getModels&make=:makeId
// Zobrazuje seznam jako karty s animovaným vstupem
//
// Příklady modelů:
// Mercedes-Benz: A-Class, C-Class, E-Class, S-Class, GLE, AMG GT...
// BMW: 3 Series, 5 Series, 7 Series, X3, X5, M3...
// Audi: A3, A4, A6, Q3, Q5, Q7, RS6...

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import { getModels } from '../services/carQueryApi'
import type { CarModel } from '../types'
import {
  PageHeader,
  PageLoading,
  ErrorState,
  EmptyState,
} from '../components/ui'

// Emoji ikony pro různé typy karoserií
function getBodyEmoji(modelName: string): string {
  const name = modelName.toLowerCase()
  if (name.includes('suv') || name.includes('q') || name.includes('x') || name.includes('gle') || name.includes('ml')) return '🚙'
  if (name.includes('coupe') || name.includes('gt') || name.includes('amg')) return '🏎️'
  if (name.includes('class') || name.includes('series') || name.includes('a') || name.includes('e')) return '🚗'
  if (name.includes('van') || name.includes('sprinter') || name.includes('vito')) return '🚐'
  if (name.includes('roadster') || name.includes('cabrio')) return '🏎️'
  return '🚗'
}

export function ModelsPage() {
  const { makeId } = useParams<{ makeId: string }>()
  const navigate = useNavigate()

  const [models, setModels] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Název značky z URL pro zobrazení
  const makeDisplay = makeId
    ? makeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
    : ''

  // Načtení modelů z API
  const loadModels = async () => {
    if (!makeId) return
    setLoading(true)
    setError(null)

    try {
      const data = await getModels(makeId)
      setModels(data)
    } catch (err) {
      setError('Nepodařilo se načíst modely. Zkontrolujte připojení.')
      console.error('[ModelsPage] Chyba:', err)
    } finally {
      setLoading(false)
    }
  }

  // Spuštění při mountu nebo změně makeId
  useEffect(() => {
    loadModels()
  }, [makeId])

  // Filtrování modelů podle vyhledávání
  const filteredModels = models.filter(model =>
    model.model_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ── LOADING STATE ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen content-with-nav">
        <PageHeader title={makeDisplay} subtitle="Načítám modely..." />
        <PageLoading message="Načítám modely..." />
      </div>
    )
  }

  // ── ERROR STATE ──────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen content-with-nav">
        <PageHeader title={makeDisplay} />
        <ErrorState message={error} onRetry={loadModels} />
      </div>
    )
  }

  return (
    <div className="min-h-screen content-with-nav animate-fade-in">
      {/* Záhlaví stránky */}
      <PageHeader
        title={makeDisplay}
        subtitle={`${models.length} modelů`}
      />

      {/* ── VYHLEDÁVÁNÍ ──────────────────────────────────────── */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Hledat model..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-garage-elevated border border-garage-border rounded-2xl
                       pl-9 pr-4 py-3 text-sm text-white placeholder-white/30
                       focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>
      </div>

      {/* ── SEZNAM MODELŮ ─────────────────────────────────────── */}
      {filteredModels.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Žádné výsledky"
          description={`Pro "${searchQuery}" nebyl nalezen žádný model`}
        />
      ) : (
        <div className="px-4 space-y-2">
          {filteredModels.map((model, index) => (
            <button
              key={model.model_name}
              onClick={() => navigate(`/makes/${makeId}/models/${encodeURIComponent(model.model_name)}/years`)}
              className="w-full card-hover flex items-center gap-4 p-4 text-left group"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Body emoji */}
              <span className="text-2xl">{getBodyEmoji(model.model_name)}</span>

              {/* Název modelu */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-accent-gold transition-colors">
                  {model.model_name}
                </h3>
                <p className="text-xs text-white/30 mt-0.5">{makeDisplay}</p>
              </div>

              {/* Šipka */}
              <ChevronRight
                size={16}
                className="text-white/20 group-hover:text-accent-gold/60 group-hover:translate-x-0.5 transition-all"
              />
            </button>
          ))}
        </div>
      )}

      {/* Počet modelů dole */}
      <div className="px-4 py-6 text-center">
        <p className="text-xs text-white/20 font-mono">
          Zobrazeno {filteredModels.length} z {models.length} modelů
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// YEARS PAGE
// ─────────────────────────────────────────────────────────────────────────────
// src/pages/YearsPage.tsx
// Stránka se seznam ročníků pro vybraný model
//
// URL: /makes/:makeId/models/:modelName/years
// Načítá roky z CarQuery API: cmd=getYears&make=:makeId&model=:modelName
// Zobrazuje roky jako grid (od nejnovějšího)

import { useState as useYearsState, useEffect as useYearsEffect } from 'react'
import { useParams as useYearsParams, useNavigate as useYearsNavigate } from 'react-router-dom'
import { getYears } from '../services/carQueryApi'
import {
  PageHeader as YearsPageHeader,
  PageLoading as YearsPageLoading,
  ErrorState as YearsErrorState,
  EmptyState as YearsEmptyState,
} from '../components/ui'

export function YearsPage() {
  const { makeId, modelName } = useYearsParams<{ makeId: string; modelName: string }>()
  const navigate = useYearsNavigate()

  const [years, setYears] = useYearsState<number[]>([])
  const [loading, setLoading] = useYearsState(true)
  const [error, setError] = useYearsState<string | null>(null)

  const decodedModelName = modelName ? decodeURIComponent(modelName) : ''
  const makeDisplay = makeId
    ? makeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
    : ''

  const loadYears = async () => {
    if (!makeId || !decodedModelName) return
    setLoading(true)
    setError(null)
    try {
      const data = await getYears(makeId, decodedModelName)
      setYears(data)
    } catch (err) {
      setError('Nepodařilo se načíst roky výroby.')
      console.error('[YearsPage] Chyba:', err)
    } finally {
      setLoading(false)
    }
  }

  useYearsEffect(() => {
    loadYears()
  }, [makeId, modelName])

  if (loading) {
    return (
      <div className="min-h-screen content-with-nav">
        <YearsPageHeader title={decodedModelName} subtitle={makeDisplay} />
        <YearsPageLoading message="Načítám ročníky..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen content-with-nav">
        <YearsPageHeader title={decodedModelName} subtitle={makeDisplay} />
        <YearsErrorState message={error} onRetry={loadYears} />
      </div>
    )
  }

  return (
    <div className="min-h-screen content-with-nav animate-fade-in">
      <YearsPageHeader
        title={decodedModelName}
        subtitle={`${makeDisplay} · ${years.length} ročníků`}
      />

      {years.length === 0 ? (
        <YearsEmptyState
          icon="📅"
          title="Žádné ročníky"
          description="Pro tento model nebyla nalezena žádná data."
        />
      ) : (
        <div className="px-4">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
            Vyberte ročník
          </p>
          {/* Grid ročníků – 3 sloupce */}
          <div className="grid grid-cols-3 gap-3">
            {years.map((year, index) => (
              <button
                key={year}
                onClick={() => navigate(
                  `/makes/${makeId}/models/${encodeURIComponent(decodedModelName)}/years/${year}/trims`
                )}
                className="card-hover flex flex-col items-center justify-center p-4 aspect-square group"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <span className="font-display text-2xl text-white group-hover:text-accent-gold transition-colors">
                  {year}
                </span>
                {/* Zvýraznění posledních 3 let */}
                {year >= new Date().getFullYear() - 2 && (
                  <span className="text-[9px] font-mono text-accent-gold/60 mt-1">NOVÝ</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
