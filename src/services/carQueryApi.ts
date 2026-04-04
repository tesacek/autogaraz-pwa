// src/services/carQueryApi.ts
// CarQuery API přes vlastní Firebase Function proxy
//
// Ve vývoji:  /api/cars → Vite proxy → Firebase emulator (nebo přímý CarQuery)
// V produkci: /api/cars → Firebase Hosting rewrite → Firebase Function → CarQuery

import type { CarMake, CarModel, CarTrim, CarVehicle, CarYears } from '../types'
import { STATIC_MODELS, getStaticYears, getStaticTrims } from './staticCarData'

// ─────────────────────────────────────────────────────────────────────────────
// POMOCNÉ FUNKCE
// ─────────────────────────────────────────────────────────────────────────────

export function mpgToL100km(mpg: string | number): number | null {
  const val = typeof mpg === 'string' ? parseFloat(mpg) : mpg
  if (!val || isNaN(val) || val <= 0) return null
  return Math.round((235.215 / val) * 10) / 10
}
export function psToKw(ps: string | number): number | null {
  const val = typeof ps === 'string' ? parseFloat(ps) : ps
  if (!val || isNaN(val) || val <= 0) return null
  return Math.round(val * 0.7355)
}
export function safeParseFloat(val: string | undefined): number | null {
  if (!val) return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}
export function formatNumber(n: number | null): string {
  if (n === null) return '—'
  return n.toLocaleString('cs-CZ')
}

// ─────────────────────────────────────────────────────────────────────────────
// IN-MEMORY CACHE
// Zabrání opakovaným API voláním pro stejná data
// ─────────────────────────────────────────────────────────────────────────────

const cache = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hodina

function fromCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null }
  return entry.data as T
}
function toCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() })
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE FETCH – přes naši Firebase Function
// ─────────────────────────────────────────────────────────────────────────────

async function fetchCarQuery<T>(params: Record<string, string>): Promise<T> {
  const cacheKey = JSON.stringify(params)
  const cached = fromCache<T>(cacheKey)
  if (cached) return cached

  const searchParams = new URLSearchParams(params)
  // /api/cars je naše Firebase Function (nebo Vite proxy ve vývoji)
  const url = `/api/cars?${searchParams.toString()}`

  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) throw new Error(`API HTTP ${response.status}`)

  const data = await response.json() as T
  toCache(cacheKey, data)
  return data
}

// ─────────────────────────────────────────────────────────────────────────────
// OBRÁZKY – přes naši Firebase Function (Wikimedia)
// ─────────────────────────────────────────────────────────────────────────────

const imageCache = new Map<string, string>()

export async function getCarImageUrl(
    make: string,
    model: string,
    year?: string
): Promise<string> {
  const key = `${make}:${model}:${year ?? ''}`
  if (imageCache.has(key)) return imageCache.get(key)!

  try {
    const params = new URLSearchParams({ make, model, ...(year ? { year } : {}) })
    const response = await fetch(`/api/carImage?${params}`, {
      signal: AbortSignal.timeout(6000),
    })

    if (response.ok) {
      const data = await response.json() as { imageUrl: string | null }
      if (data.imageUrl) {
        imageCache.set(key, data.imageUrl)
        return data.imageUrl
      }
    }
  } catch {
    // Fallback níže
  }

  // Fallback na Unsplash pokud Wikimedia nenajde nic
  const fallback = `https://source.unsplash.com/800x500/?${encodeURIComponent(make + ' ' + model + ' car')}`
  imageCache.set(key, fallback)
  return fallback
}

// ─────────────────────────────────────────────────────────────────────────────
// VEŘEJNÉ API FUNKCE
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_MAKES = ['mercedes-benz', 'bmw', 'audi']

export async function getMakes(): Promise<CarMake[]> {
  try {
    const data = await fetchCarQuery<{ Makes: CarMake[] }>({ cmd: 'getMakes' })
    if (!data.Makes || !Array.isArray(data.Makes)) return STATIC_MAKES
    const filtered = data.Makes.filter(m => ALLOWED_MAKES.includes(m.make_id.toLowerCase()))
    return filtered.length > 0 ? filtered : STATIC_MAKES
  } catch { return STATIC_MAKES }
}

export async function getModels(makeId: string): Promise<CarModel[]> {
  const cacheKey = `models:${makeId}`
  const cached = fromCache<CarModel[]>(cacheKey)
  if (cached) return cached

  try {
    const data = await fetchCarQuery<{ Models: CarModel[] }>({ cmd: 'getModels', make: makeId })
    if (!data.Models || !Array.isArray(data.Models) || data.Models.length === 0) {
      return STATIC_MODELS[makeId] ?? []
    }
    const unique = data.Models.reduce<CarModel[]>((acc, m) => {
      if (!acc.find(x => x.model_name === m.model_name)) acc.push(m)
      return acc
    }, [])
    const sorted = unique.sort((a, b) => a.model_name.localeCompare(b.model_name))
    toCache(cacheKey, sorted)
    return sorted
  } catch {
    console.info(`[CarQuery] Fallback na statická data pro ${makeId}`)
    return STATIC_MODELS[makeId] ?? []
  }
}

export async function getYears(makeId: string, modelName: string): Promise<number[]> {
  try {
    const data = await fetchCarQuery<{ Years: CarYears }>({
      cmd: 'getYears', make: makeId, model: modelName,
    })
    if (!data.Years) return getStaticYears(makeId, modelName)
    const min = parseInt(data.Years.min_year)
    const max = parseInt(data.Years.max_year)
    if (isNaN(min) || isNaN(max)) return getStaticYears(makeId, modelName)
    const years: number[] = []
    for (let y = max; y >= min; y--) years.push(y)
    return years
  } catch { return getStaticYears(makeId, modelName) }
}

export async function getTrims(
    makeId: string,
    modelName: string,
    year: string | number
): Promise<CarTrim[]> {
  try {
    const data = await fetchCarQuery<{ Trims: CarTrim[] }>({
      cmd: 'getTrims', make: makeId, model: modelName, year: String(year),
    })
    if (!data.Trims || !Array.isArray(data.Trims) || data.Trims.length === 0) {
      return getStaticTrims(makeId, modelName, Number(year))
    }
    return data.Trims
  } catch { return getStaticTrims(makeId, modelName, Number(year)) }
}

export async function getVehicle(modelId: string): Promise<CarVehicle | null> {
  if (modelId.startsWith('static_')) return buildStaticVehicle(modelId)
  try {
    const data = await fetchCarQuery<{ Trims: CarVehicle[] }>({ cmd: 'getVehicle', id: modelId })
    if (!data.Trims || data.Trims.length === 0) return null
    return data.Trims[0]
  } catch { return null }
}

function buildStaticVehicle(modelId: string): CarVehicle | null {
  const parts = modelId.replace('static_', '').split('_')
  if (parts.length < 4) return null
  const year = parts[parts.length - 2]
  const index = parseInt(parts[parts.length - 1])
  let makeId = ''
  let modelNameParts: string[] = []
  for (let i = 0; i < parts.length - 2; i++) {
    const candidate = parts.slice(0, i + 1).join('-')
    if (['mercedes-benz', 'bmw', 'audi'].includes(candidate)) {
      makeId = candidate
      modelNameParts = parts.slice(i + 1, parts.length - 2)
      break
    }
  }
  if (!makeId) { makeId = parts[0]; modelNameParts = parts.slice(1, parts.length - 2) }
  const modelName = modelNameParts.join(' ')
  const trims = getStaticTrims(makeId, modelName, Number(year))
  const trim = trims[index] ?? trims[0]
  if (!trim) return null
  const makeDisplay = makeId === 'mercedes-benz' ? 'Mercedes-Benz'
      : makeId === 'bmw' ? 'BMW' : 'Audi'
  return {
    model_id: modelId, model_make_id: makeId, model_make_display: makeDisplay,
    model_name: modelName, model_trim: trim.model_trim, model_year: year,
    model_engine_power_ps: trim.model_engine_power_ps ?? '0',
    model_lkm_mixed: trim.model_lkm_mixed ?? '0',
    model_lkm_hwy: trim.model_lkm_hwy ?? '0',
    model_lkm_city: '0',
    model_engine_fuel: trim.model_engine_fuel,
    model_engine_cc: trim.model_engine_cc,
    model_body: trim.model_body,
  }
}

export const STATIC_MAKES: CarMake[] = [
  { make_id: 'mercedes-benz', make_display: 'Mercedes-Benz', make_is_common: '1', make_country: 'Germany' },
  { make_id: 'bmw', make_display: 'BMW', make_is_common: '1', make_country: 'Germany' },
  { make_id: 'audi', make_display: 'Audi', make_is_common: '1', make_country: 'Germany' },
]

// Zachováno pro zpětnou kompatibilitu
export function getBrandImageUrl(makeId: string, modelName?: string): string {
  const queries: Record<string, string> = {
    'mercedes-benz': 'mercedes-benz car luxury',
    'bmw': 'bmw car sport',
    'audi': 'audi car germany',
  }
  const query = modelName ? `${makeId} ${modelName} car` : queries[makeId.toLowerCase()] ?? 'luxury car'
  return `https://source.unsplash.com/800x500/?${encodeURIComponent(query)}`
}