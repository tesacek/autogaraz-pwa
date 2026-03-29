// src/services/carQueryApi.ts
// Servisní vrstva pro komunikaci s CarQuery API



import type {
  CarMake,
  CarModel,
  CarTrim,
  CarVehicle,
  CarYears,
} from '../types'

// Base URL pro CarQuery API
const API_BASE = 'https://www.carqueryapi.com/api/0.3/'

// CORS proxy pro případy kdy přímé volání selže
// allorigins.win je bezplatná CORS proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

// ─────────────────────────────────────────────────────────────────────────────
// POMOCNÉ FUNKCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Přepočet MPG na l/100km
 * Formula: l100km = 235.215 / mpg
 * Tato formula je standard pro US MPG (galony, míle)
 */
export function mpgToL100km(mpg: string | number): number | null {
  const val = typeof mpg === 'string' ? parseFloat(mpg) : mpg
  if (!val || isNaN(val) || val <= 0) return null
  return Math.round((235.215 / val) * 10) / 10  // Zaokrouhlení na 1 desetinné místo
}

/**
 * Převod PS (koně) na kW
 * Formula: 1 PS = 0.7355 kW
 */
export function psToKw(ps: string | number): number | null {
  const val = typeof ps === 'string' ? parseFloat(ps) : ps
  if (!val || isNaN(val) || val <= 0) return null
  return Math.round(val * 0.7355)
}

/**
 * Bezpečné parsování čísla z API (API vrací čísla jako stringy)
 */
export function safeParseFloat(val: string | undefined): number | null {
  if (!val) return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

/**
 * Formátování čísla s mezerami jako oddělovačem tisíců
 * Příklad: 1500 → "1 500"
 */
export function formatNumber(n: number | null): string {
  if (n === null) return '—'
  return n.toLocaleString('cs-CZ')
}

// ─────────────────────────────────────────────────────────────────────────────
// API VOLÁNÍ
// Každá funkce vrací Promise s typovanou odpovědí
// V případě chyby háže Error s popisem problému
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Načte URL s JSON odpovědí s CORS proxy fallback
 * Nejprve zkusí přímé volání, při CORS chybě použije proxy
 */
async function fetchCarQuery<T>(params: Record<string, string>): Promise<T> {
  // Sestavení URL parametrů
  const searchParams = new URLSearchParams({ ...params, callback: '' })
  const directUrl = `${API_BASE}?${searchParams.toString()}`
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(directUrl)}`

  let response: Response

  // Zkus nejprve přímé volání (rychlejší)
  try {
    response = await fetch(directUrl, {
      headers: { 'Accept': 'application/json' },
      // Kratší timeout pro přímé volání
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  } catch {
    // Fallback na CORS proxy
    console.info('[CarQuery] Přímé volání selhalo, zkouším CORS proxy...')
    response = await fetch(proxyUrl, {
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`Proxy HTTP ${response.status}`)
  }

  const text = await response.text()

  // CarQuery API někdy vrátí JSONP wrapper i když je callback=""
  // Odstraníme případný JSONP wrapper: ({"Makes":...}) → {"Makes":...}
  const cleaned = text.replace(/^\s*\(/, '').replace(/\)\s*;?\s*$/, '').trim()

  try {
    return JSON.parse(cleaned) as T
  } catch {
    throw new Error(`Nepodařilo se parsovat JSON odpověď: ${text.slice(0, 100)}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VEŘEJNÉ API FUNKCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Načte seznam výrobců
 * cmd=getMakes
 * Filtrujeme pouze Mercedes-Benz, BMW, Audi
 */
export async function getMakes(): Promise<CarMake[]> {
  // Seznam povolených výrobců (lowercase make_id)
  const ALLOWED_MAKES = ['mercedes-benz', 'bmw', 'audi']

  // API vrací VŠECHNY výrobce, filtrujeme na straně klienta
  // Alternativa: API podporuje parametr 'make' pro filtrování
  const data = await fetchCarQuery<{ Makes: CarMake[] }>({ cmd: 'getMakes' })

  if (!data.Makes || !Array.isArray(data.Makes)) {
    console.warn('[CarQuery] getMakes vrátilo neočekávaný formát:', data)
    // Fallback: vrátíme statická data
    return STATIC_MAKES
  }

  // Filtrujeme pouze naše 3 značky
  const filtered = data.Makes.filter(make =>
    ALLOWED_MAKES.includes(make.make_id.toLowerCase())
  )

  // Pokud API nevrátí nic, použijeme statická data
  return filtered.length > 0 ? filtered : STATIC_MAKES
}

/**
 * Načte modely pro daného výrobce
 * cmd=getModels&make=mercedes-benz
 */
export async function getModels(makeId: string): Promise<CarModel[]> {
  const data = await fetchCarQuery<{ Models: CarModel[] }>({
    cmd: 'getModels',
    make: makeId,
  })

  if (!data.Models || !Array.isArray(data.Models)) {
    console.warn('[CarQuery] getModels vrátilo neočekávaný formát')
    return []
  }

  // Odstraníme duplicitní modely (API může vrátit model vícekrát pro různé roky)
  const uniqueModels = data.Models.reduce<CarModel[]>((acc, model) => {
    if (!acc.find(m => m.model_name === model.model_name)) {
      acc.push(model)
    }
    return acc
  }, [])

  // Seřadíme abecedně
  return uniqueModels.sort((a, b) => a.model_name.localeCompare(b.model_name))
}

/**
 * Načte dostupné roky pro daný model
 * cmd=getYears&make=bmw&model=3+Series
 */
export async function getYears(makeId: string, modelName: string): Promise<number[]> {
  const data = await fetchCarQuery<{ Years: CarYears }>({
    cmd: 'getYears',
    make: makeId,
    model: modelName,
  })

  if (!data.Years) {
    console.warn('[CarQuery] getYears vrátilo prázdná data')
    return []
  }

  const minYear = parseInt(data.Years.min_year)
  const maxYear = parseInt(data.Years.max_year)

  if (isNaN(minYear) || isNaN(maxYear)) return []

  // Vygenerujeme array let od max po min (nejnovější první)
  const years: number[] = []
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year)
  }

  return years
}

/**
 * Načte výbavy pro daný model a rok
 * cmd=getTrims&make=audi&model=A4&year=2022
 */
export async function getTrims(
  makeId: string,
  modelName: string,
  year: string | number
): Promise<CarTrim[]> {
  const data = await fetchCarQuery<{ Trims: CarTrim[] }>({
    cmd: 'getTrims',
    make: makeId,
    model: modelName,
    year: String(year),
  })

  if (!data.Trims || !Array.isArray(data.Trims)) {
    return []
  }

  return data.Trims
}

/**
 * Načte plné specifikace vozidla podle model_id
 * cmd=getVehicle&id=<model_id>
 * Toto je nejdetailnější endpoint – vrátí vše včetně rozměrů, spotřeby, emisí
 */
export async function getVehicle(modelId: string): Promise<CarVehicle | null> {
  const data = await fetchCarQuery<{ Trims: CarVehicle[] }>({
    cmd: 'getVehicle',
    id: modelId,
  })

  if (!data.Trims || data.Trims.length === 0) {
    return null
  }

  return data.Trims[0]  // Vrátíme první (a obvykle jediný) záznam
}

// ─────────────────────────────────────────────────────────────────────────────
// STATICKÁ FALLBACK DATA
// Použijí se pokud API není dostupné (offline mód)
// ─────────────────────────────────────────────────────────────────────────────

export const STATIC_MAKES: CarMake[] = [
  {
    make_id: 'mercedes-benz',
    make_display: 'Mercedes-Benz',
    make_is_common: '1',
    make_country: 'Germany',
  },
  {
    make_id: 'bmw',
    make_display: 'BMW',
    make_is_common: '1',
    make_country: 'Germany',
  },
  {
    make_id: 'audi',
    make_display: 'Audi',
    make_is_common: '1',
    make_country: 'Germany',
  },
]

// Obrázky pro každou značku – Unsplash URLs
// Každá URL vrátí náhodný relevantní obrázek
export function getBrandImageUrl(makeId: string, modelName?: string): string {
  const queries: Record<string, string> = {
    'mercedes-benz': 'mercedes-benz car luxury',
    'bmw': 'bmw car sport',
    'audi': 'audi car germany',
  }

  const query = modelName
    ? `${makeId} ${modelName} car`
    : queries[makeId.toLowerCase()] ?? 'luxury car'

  // Unsplash Source API – vrátí náhodný obrázek pro daný query
  // width=800&height=500 pro aspect ratio 16:10
  return `https://source.unsplash.com/800x500/?${encodeURIComponent(query)}`
}
