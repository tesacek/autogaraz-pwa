// src/services/carQueryApi.ts
import type { CarMake, CarModel, CarTrim, CarVehicle, CarYears } from '../types'

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

function cleanJsonp(text: string): string {
  return text.replace(/^\s*[\w.]+\s*\(/, '').replace(/\)\s*;?\s*$/, '').trim()
}

const isDev = import.meta.env.DEV

async function fetchCarQuery<T>(params: Record<string, string>): Promise<T> {
  const searchParams = new URLSearchParams({ ...params, callback: '' })
  const url = isDev
      ? `/api/carquery/?${searchParams.toString()}`
      : `https://www.carqueryapi.com/api/0.3/?${searchParams.toString()}`

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/json, text/plain, */*' },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const text = await response.text()
    return JSON.parse(cleanJsonp(text)) as T
  } catch (err) {
    if (!isDev) {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(
          `https://www.carqueryapi.com/api/0.3/?${searchParams.toString()}`
      )}`
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) })
      if (!resp.ok) throw new Error(`Proxy HTTP ${resp.status}`)
      const text = await resp.text()
      return JSON.parse(cleanJsonp(text)) as T
    }
    throw err
  }
}

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
  const data = await fetchCarQuery<{ Models: CarModel[] }>({ cmd: 'getModels', make: makeId })
  if (!data.Models || !Array.isArray(data.Models)) return []
  const unique = data.Models.reduce<CarModel[]>((acc, m) => {
    if (!acc.find(x => x.model_name === m.model_name)) acc.push(m)
    return acc
  }, [])
  return unique.sort((a, b) => a.model_name.localeCompare(b.model_name))
}

export async function getYears(makeId: string, modelName: string): Promise<number[]> {
  const data = await fetchCarQuery<{ Years: CarYears }>({ cmd: 'getYears', make: makeId, model: modelName })
  if (!data.Years) return []
  const min = parseInt(data.Years.min_year)
  const max = parseInt(data.Years.max_year)
  if (isNaN(min) || isNaN(max)) return []
  const years: number[] = []
  for (let y = max; y >= min; y--) years.push(y)
  return years
}

export async function getTrims(makeId: string, modelName: string, year: string | number): Promise<CarTrim[]> {
  const data = await fetchCarQuery<{ Trims: CarTrim[] }>({ cmd: 'getTrims', make: makeId, model: modelName, year: String(year) })
  if (!data.Trims || !Array.isArray(data.Trims)) return []
  return data.Trims
}

export async function getVehicle(modelId: string): Promise<CarVehicle | null> {
  const data = await fetchCarQuery<{ Trims: CarVehicle[] }>({ cmd: 'getVehicle', id: modelId })
  if (!data.Trims || data.Trims.length === 0) return null
  return data.Trims[0]
}

export const STATIC_MAKES: CarMake[] = [
  { make_id: 'mercedes-benz', make_display: 'Mercedes-Benz', make_is_common: '1', make_country: 'Germany' },
  { make_id: 'bmw', make_display: 'BMW', make_is_common: '1', make_country: 'Germany' },
  { make_id: 'audi', make_display: 'Audi', make_is_common: '1', make_country: 'Germany' },
]

export function getBrandImageUrl(makeId: string, modelName?: string): string {
  const queries: Record<string, string> = {
    'mercedes-benz': 'mercedes-benz car luxury',
    'bmw': 'bmw car sport',
    'audi': 'audi car germany',
  }
  const query = modelName ? `${makeId} ${modelName} car` : queries[makeId.toLowerCase()] ?? 'luxury car'
  return `https://source.unsplash.com/800x500/?${encodeURIComponent(query)}`
}