// src/pages/CarDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Star, Car, Zap, Wind, Weight, Maximize2,
  Fuel, Timer, Settings, ChevronDown, ChevronUp,
} from 'lucide-react'
import { getVehicle, mpgToL100km, psToKw, getBrandImageUrl } from '../services/carQueryApi'
import type { CarVehicle } from '../types'
import { PageHeader, PageLoading, ErrorState, SpecRow, SectionTitle } from '../components/ui'
import { useApp } from '../context/AppContext'

// ─────────────────────────────────────────────────────────────────────────────
// POMOCNÉ FUNKCE
// ─────────────────────────────────────────────────────────────────────────────

function formatOrDash(val: string | undefined | null, suffix = ''): string {
  if (!val || val === '0' || val === '') return '—'
  const n = parseFloat(val)
  if (isNaN(n)) return val
  return `${n}${suffix}`
}

function engineSize(cc: string | undefined): string {
  if (!cc) return '—'
  const ccNum = parseInt(cc)
  if (isNaN(ccNum) || ccNum === 0) return '—'
  return `${(ccNum / 1000).toFixed(1)} L`
}

// ─────────────────────────────────────────────────────────────────────────────
// CAR DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function CarDetailPage() {
  const { modelId } = useParams<{ modelId: string }>()
  const { isFavorite, isInGarage, addFavorite, removeFavorite, addToMyGarage, favorites } = useApp()

  const [vehicle, setVehicle] = useState<CarVehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadVehicle = async () => {
    if (!modelId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getVehicle(modelId)
      if (!data) throw new Error('Vozidlo nenalezeno')
      setVehicle(data)
    } catch (err) {
      setError('Nepodařilo se načíst specifikace vozidla.')
      console.error('[CarDetailPage] Chyba:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadVehicle() }, [modelId])

  if (loading) return (
      <div className="min-h-screen content-with-nav">
        <PageHeader title="Detail vozidla" />
        <PageLoading message="Načítám specifikace..." />
      </div>
  )

  if (error || !vehicle) return (
      <div className="min-h-screen content-with-nav">
        <PageHeader title="Detail vozidla" />
        <ErrorState message={error ?? 'Vozidlo nenalezeno'} onRetry={loadVehicle} />
      </div>
  )

  // ── VÝPOČTY ──────────────────────────────────────────────────
  const powerPs = parseFloat(vehicle.model_engine_power_ps || '0')
  const powerKw = psToKw(powerPs)

  const consumptionMixed = vehicle.model_lkm_mixed
      ? parseFloat(vehicle.model_lkm_mixed)
      : mpgToL100km(vehicle.model_lkm_hwy || '0')

  const consumptionCity = vehicle.model_lkm_city
      ? parseFloat(vehicle.model_lkm_city)
      : null

  const consumptionHwy = vehicle.model_lkm_hwy
      ? (parseFloat(vehicle.model_lkm_hwy) > 10
          ? parseFloat(vehicle.model_lkm_hwy)
          : mpgToL100km(vehicle.model_lkm_hwy))
      : null

  const carImage = imgError
      ? `https://source.unsplash.com/800x500/?${encodeURIComponent(vehicle.model_make_display + ' car')}`
      : getBrandImageUrl(vehicle.model_make_id || '', vehicle.model_name)

  const favActive = isFavorite(vehicle.model_id)
  const garageActive = isInGarage(vehicle.model_id)

  // Sdílený objekt dat auta — zabrání duplicitě v obou handlerech
  const carData = {
    makeId: vehicle.model_make_id || '',
    makeDisplay: vehicle.model_make_display || '',
    modelName: vehicle.model_name,
    modelYear: vehicle.model_year || '',
    trimName: vehicle.model_trim || '',
    modelId: vehicle.model_id,
    powerPs: powerPs || undefined,
    powerKw: powerKw || undefined,
    engineCc: parseInt(vehicle.model_engine_cc || '0') || undefined,
    fuelType: vehicle.model_engine_fuel || undefined,
    topSpeedKph: parseFloat(vehicle.model_top_speed_kph || '0') || undefined,
    acceleration: parseFloat(vehicle.model_0_to_100_kph || '0') || undefined,
    consumptionL100km: consumptionMixed || undefined,
  }

  // ── AKCE ─────────────────────────────────────────────────────

  const handleFavoriteToggle = async () => {
    if (!vehicle || actionLoading) return
    setActionLoading(true)
    try {
      if (favActive) {
        // Najdeme Firestore doc ID z favorites pole
        const favDoc = favorites.find(f => f.modelId === vehicle.model_id)
        if (favDoc) await removeFavorite(favDoc.id)
      } else {
        await addFavorite(carData)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddToGarage = async () => {
    if (!vehicle || actionLoading) return
    setActionLoading(true)
    try {
      await addToMyGarage(carData)
    } finally {
      setActionLoading(false)
    }
  }

  // ── RENDER ───────────────────────────────────────────────────
  return (
      <div className="min-h-screen content-with-nav">
        <PageHeader
            title={vehicle.model_name}
            subtitle={`${vehicle.model_make_display} · ${vehicle.model_year || ''}`}
        />

        {/* Obrázek */}
        <div className="relative mx-4 mb-4 rounded-3xl overflow-hidden bg-garage-elevated">
          <img
              src={carImage}
              alt={`${vehicle.model_make_display} ${vehicle.model_name}`}
              className="w-full h-52 object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="font-display text-3xl tracking-widest text-white leading-tight">
              {vehicle.model_make_display}
            </h2>
            <p className="text-white/60 text-sm">
              {vehicle.model_name} {vehicle.model_trim}
            </p>
            <div className="flex gap-4 mt-2">
              {powerPs > 0 && (
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-accent-gold" />
                    <span className="text-xs font-mono text-white/80">{powerPs} PS</span>
                  </div>
              )}
              {vehicle.model_0_to_100_kph && parseFloat(vehicle.model_0_to_100_kph) > 0 && (
                  <div className="flex items-center gap-1">
                    <Timer size={12} className="text-accent-gold" />
                    <span className="text-xs font-mono text-white/80">{vehicle.model_0_to_100_kph}s 0-100</span>
                  </div>
              )}
              {vehicle.model_top_speed_kph && parseFloat(vehicle.model_top_speed_kph) > 0 && (
                  <div className="flex items-center gap-1">
                    <Wind size={12} className="text-accent-gold" />
                    <span className="text-xs font-mono text-white/80">{vehicle.model_top_speed_kph} km/h</span>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Akční tlačítka */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-6">
          <button
              onClick={handleFavoriteToggle}
              disabled={actionLoading}
              className={`
            flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm
            transition-all duration-200 active:scale-95 border
            ${favActive
                  ? 'bg-accent-gold/20 border-accent-gold/50 text-accent-gold animate-pulse-gold'
                  : 'bg-garage-elevated border-garage-border text-white/60 hover:border-accent-gold/30'
              }
          `}
          >
            <Star size={16} className={favActive ? 'fill-accent-gold text-accent-gold' : ''} />
            {favActive ? 'V oblíbených' : 'Do oblíbených'}
          </button>

          <button
              onClick={handleAddToGarage}
              disabled={actionLoading || garageActive}
              className={`
            flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm
            transition-all duration-200 active:scale-95 border
            ${garageActive
                  ? 'bg-green-900/20 border-green-700/50 text-green-400'
                  : 'btn-primary border-transparent'
              }
          `}
          >
            <Car size={16} />
            {garageActive ? 'V garáži' : 'Do garáže'}
          </button>
        </div>

        {/* Specifikace */}
        <div className="px-4 space-y-6">

          <div className="card p-4">
            <SectionTitle>
              <span className="flex items-center gap-1.5"><Zap size={11} /> Motor & Výkon</span>
            </SectionTitle>
            <SpecRow label="Typ motoru" value={vehicle.model_engine_type} />
            <SpecRow label="Objem motoru" value={engineSize(vehicle.model_engine_cc)} />
            <SpecRow label="Počet válců" value={vehicle.model_engine_cyl} />
            <SpecRow label="Výkon" value={powerPs > 0 ? `${powerPs} PS / ${powerKw} kW` : null} highlight />
            <SpecRow label="Točivý moment" value={vehicle.model_engine_torque_nm} unit="Nm" />
            <SpecRow label="Max. otáčky výkonu" value={vehicle.model_engine_power_rpm} unit="rpm" />
            <SpecRow label="Palivo" value={vehicle.model_engine_fuel} />
            <SpecRow label="Kompresní poměr" value={vehicle.model_engine_compression} />
          </div>

          <div className="card p-4">
            <SectionTitle>
              <span className="flex items-center gap-1.5"><Wind size={11} /> Jízdní výkon</span>
            </SectionTitle>
            <SpecRow label="Zrychlení 0–100 km/h" value={formatOrDash(vehicle.model_0_to_100_kph, ' s')} highlight />
            <SpecRow label="Maximální rychlost" value={vehicle.model_top_speed_kph} unit="km/h" />
            <SpecRow label="Pohon" value={vehicle.model_drive} />
            <SpecRow label="Převodovka" value={vehicle.model_transmission_type} />
          </div>

          <div className="card p-4">
            <SectionTitle>
              <span className="flex items-center gap-1.5"><Fuel size={11} /> Spotřeba & Emise</span>
            </SectionTitle>
            <SpecRow label="Kombinovaná spotřeba" value={consumptionMixed?.toFixed(1)} unit="l/100km" highlight />
            <SpecRow label="Spotřeba město" value={consumptionCity?.toFixed(1)} unit="l/100km" />
            <SpecRow label="Spotřeba dálnice" value={consumptionHwy?.toFixed(1)} unit="l/100km" />
            <SpecRow label="Objem nádrže" value={vehicle.model_fuel_cap_l} unit="L" />
            <SpecRow label="Emise CO₂" value={vehicle.model_co2} unit="g/km" />
          </div>

          <div className="card p-4">
            <SectionTitle>
              <span className="flex items-center gap-1.5"><Maximize2 size={11} /> Rozměry</span>
            </SectionTitle>
            <SpecRow label="Délka" value={vehicle.model_length_mm} unit="mm" />
            <SpecRow label="Šířka" value={vehicle.model_width_mm} unit="mm" />
            <SpecRow label="Výška" value={vehicle.model_height_mm} unit="mm" />
            <SpecRow label="Rozvor náprav" value={vehicle.model_wheelbase_mm} unit="mm" />
          </div>

          <div className="card p-4">
            <SectionTitle>
              <span className="flex items-center gap-1.5"><Weight size={11} /> Hmotnost & Kapacita</span>
            </SectionTitle>
            <SpecRow label="Hmotnost" value={vehicle.model_weight_kg} unit="kg" />
            <SpecRow label="Počet sedadel" value={vehicle.model_seats} />
            <SpecRow label="Počet dveří" value={vehicle.model_doors} />
            <SpecRow label="Typ karoserie" value={vehicle.model_body} />
          </div>

          {/* Technické detaily – skryté */}
          <div className="card overflow-hidden">
            <button
                onClick={() => setShowAllSpecs(prev => !prev)}
                className="w-full flex items-center justify-between p-4"
            >
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/30">
              <Settings size={11} />
              Technické detaily
            </span>
              {showAllSpecs
                  ? <ChevronUp size={16} className="text-white/30" />
                  : <ChevronDown size={16} className="text-white/30" />
              }
            </button>
            {showAllSpecs && (
                <div className="px-4 pb-4 border-t border-garage-border/50">
                  <div className="pt-3">
                    <SpecRow label="Pozice motoru" value={vehicle.model_engine_position} />
                    <SpecRow label="Ventily / válec" value={vehicle.model_engine_valves_per_cyl} />
                    <SpecRow label="Vrtání" value={vehicle.model_engine_bore_mm} unit="mm" />
                    <SpecRow label="Zdvih" value={vehicle.model_engine_stroke_mm} unit="mm" />
                    <SpecRow label="Model ID" value={vehicle.model_id} />
                    <SpecRow label="Rok" value={vehicle.model_year} />
                  </div>
                </div>
            )}
          </div>

        </div>
        <div className="h-8" />
      </div>
  )
}