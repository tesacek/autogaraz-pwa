// src/services/carQueryApi.ts
// Používá přímo staticCarData.ts — rychlé, spolehlivé, bohatá data
// NHTSA API se používá pouze pro doplnění modelů pokud chybí ve statických datech

import type { CarMake, CarModel, CarTrim, CarVehicle } from '../types'
import { STATIC_MODELS, getStaticYears, getStaticTrims, getStaticVehicle } from './staticCarData'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

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

// ─── STATICKÉ ZNAČKY ─────────────────────────────────────────────────────────

export const STATIC_MAKES: CarMake[] = [
  { make_id: 'mercedes-benz', make_display: 'Mercedes-Benz', make_is_common: '1', make_country: 'Germany' },
  { make_id: 'bmw',           make_display: 'BMW',           make_is_common: '1', make_country: 'Germany' },
  { make_id: 'audi',          make_display: 'Audi',          make_is_common: '1', make_country: 'Germany' },
]

// ─── VEŘEJNÉ FUNKCE ──────────────────────────────────────────────────────────

export async function getMakes(): Promise<CarMake[]> {
  return STATIC_MAKES
}

export async function getModels(makeId: string): Promise<CarModel[]> {
  // Vrátíme statické modely — jsou pečlivě vybrané a mají data
  return STATIC_MODELS[makeId] ?? []
}

export async function getYears(makeId: string, modelName: string): Promise<number[]> {
  return getStaticYears(makeId, modelName)
}

export async function getTrims(makeId: string, modelName: string, year: string | number): Promise<CarTrim[]> {
  return getStaticTrims(makeId, modelName, Number(year))
}

export async function getVehicle(modelId: string): Promise<CarVehicle | null> {
  // Parsuj ID formátu: static_bmw_3 Series_2023_0 nebo static_mercedes-benz_C-Class_2022_1
  const withoutPrefix = modelId.startsWith('static_')
      ? modelId.replace('static_', '')
      : modelId

  const parts = withoutPrefix.split('_')

  // Najdi index a year (poslední dvě čísla)
  const index = parseInt(parts[parts.length - 1])
  const year = parseInt(parts[parts.length - 2])

  if (isNaN(index) || isNaN(year)) return null

  // Najdi makeId (může být mercedes-benz nebo bmw nebo audi)
  let makeId = ''
  let modelNameParts: string[] = []

  for (let i = 1; i <= parts.length - 3; i++) {
    const candidate = parts.slice(0, i).join('-')
    if (['mercedes-benz', 'bmw', 'audi'].includes(candidate)) {
      makeId = candidate
      modelNameParts = parts.slice(i, parts.length - 2)
      break
    }
  }

  // Fallback — první část je makeId
  if (!makeId) {
    makeId = parts[0]
    modelNameParts = parts.slice(1, parts.length - 2)
  }

  // Rekonstruuj název modelu (podtržítka → mezery)
  const modelName = modelNameParts.join(' ')

  return getStaticVehicle(makeId, modelName, year, isNaN(index) ? 0 : index)
}

export function getBrandImageUrl(makeId: string, modelName?: string): string {
  const queries: Record<string, string> = {
    'mercedes-benz': 'mercedes-benz car luxury',
    'bmw': 'bmw car sport',
    'audi': 'audi car germany',
  }
  const query = modelName
      ? `${makeId} ${modelName} car`
      : queries[makeId.toLowerCase()] ?? 'luxury car'
  return `https://source.unsplash.com/800x500/?${encodeURIComponent(query)}`
}