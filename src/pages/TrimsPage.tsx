// src/pages/TrimsPage.tsx
// Stránka se výbavami/variantami pro vybraný model a rok
//
// URL: /makes/:makeId/models/:modelName/years/:year/trims
// Načítá výbavy z CarQuery API: cmd=getTrims&make=...&model=...&year=...
// Každá výbava představuje konkrétní verzi auta (např. "320d xDrive Steptronic")

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Zap, Gauge } from 'lucide-react'
import { getTrims, psToKw, mpgToL100km } from '../services/carQueryApi'
import type { CarTrim } from '../types'
import {
  PageHeader,
  PageLoading,
  ErrorState,
  EmptyState,
} from '../components/ui'

export function TrimsPage() {
  const { makeId, modelName, year } = useParams<{
    makeId: string
    modelName: string
    year: string
  }>()
  const navigate = useNavigate()

  const [trims, setTrims] = useState<CarTrim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const decodedModelName = modelName ? decodeURIComponent(modelName) : ''
  const makeDisplay = makeId
    ? makeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
    : ''

  const loadTrims = async () => {
    if (!makeId || !decodedModelName || !year) return
    setLoading(true)
    setError(null)
    try {
      const data = await getTrims(makeId, decodedModelName, year)
      setTrims(data)
    } catch (err) {
      setError('Nepodařilo se načíst výbavy.')
      console.error('[TrimsPage] Chyba:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTrims() }, [makeId, modelName, year])

  if (loading) return (
    <div className="min-h-screen content-with-nav">
      <PageHeader title={decodedModelName} subtitle={`${makeDisplay} · ${year}`} />
      <PageLoading message="Načítám výbavy..." />
    </div>
  )

  if (error) return (
    <div className="min-h-screen content-with-nav">
      <PageHeader title={decodedModelName} subtitle={`${makeDisplay} · ${year}`} />
      <ErrorState message={error} onRetry={loadTrims} />
    </div>
  )

  return (
    <div className="min-h-screen content-with-nav animate-fade-in">
      <PageHeader
        title={decodedModelName}
        subtitle={`${makeDisplay} · ${year} · ${trims.length} výbav`}
      />

      {trims.length === 0 ? (
        <EmptyState
          icon="🔧"
          title="Žádné výbavy"
          description={`Pro ${decodedModelName} (${year}) nebyla nalezena data.`}
        />
      ) : (
        <div className="px-4 space-y-3">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
            Vyberte výbavu
          </p>
          {trims.map(({
                        model_body,
                        model_engine_cc,
                        model_engine_fuel,
                        model_engine_power_ps,
                        model_id,
                        model_lkm_hwy,
                        model_lkm_mixed,
                        model_trim
                      }, index) => {
            const powerPs = parseFloat(model_engine_power_ps || '0')
            const powerKw = psToKw(powerPs)
            // Zkusíme přímou hodnotu nebo přepočítáme z MPG
            const consumption = model_lkm_mixed
              ? parseFloat(model_lkm_mixed)
              : mpgToL100km(model_lkm_hwy || '0')

            return (
              <button
                key={model_id || index}
                onClick={() => navigate(`/vehicle/${model_id}`)}
                className="w-full card-hover p-4 text-left group"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Název výbavy */}
                    <h3 className="font-semibold text-white group-hover:text-accent-gold transition-colors text-sm leading-snug">
                      {model_trim || 'Základní výbava'}
                    </h3>
                    {/* Typ karoserie + palivo */}
                    <p className="text-xs text-white/30 mt-0.5">
                      {model_body || '—'} · {model_engine_fuel || '—'}
                    </p>

                    {/* Mini spec badges */}
                    <div className="flex items-center gap-3 mt-2">
                      {powerPs > 0 && (
                        <span className="flex items-center gap-1 text-xs text-white/50">
                          <Zap size={11} className="text-accent-gold" />
                          {powerPs} PS / {powerKw} kW
                        </span>
                      )}
                      {model_engine_cc && (
                        <span className="text-xs text-white/30 font-mono">
                          {Math.round(parseInt(model_engine_cc) / 100) / 10}L
                        </span>
                      )}
                      {consumption && consumption > 0 && (
                        <span className="flex items-center gap-1 text-xs text-white/50">
                          <Gauge size={11} />
                          {consumption.toFixed(1)} l/100km
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-white/20 group-hover:text-accent-gold/60 mt-1 shrink-0"
                  />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
