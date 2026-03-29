// src/types/index.ts
// Centrální TypeScript typy pro celou aplikaci AutoGaráž
// Tato vrstva zajišťuje type safety napříč komponentami, API voláními a Firebase operacemi

// ═══════════════════════════════════════════════
// CARQUERY API TYPY
// Typy odpovídají struktuře odpovědí z CarQuery API
// Dokumentace: http://www.carqueryapi.com/documentation/
// ═══════════════════════════════════════════════

/** Výrobce automobilu (Mercedes-Benz, BMW, Audi) */
export interface CarMake {
  make_id: string           // Interní ID, např. "mercedes-benz"
  make_display: string      // Zobrazovaný název, např. "Mercedes-Benz"
  make_is_common: string    // "1" pokud je běžná značka
  make_country: string      // Země původu, např. "Germany"
}

/** Model automobilu (A-Class, 3 Series, A4 atd.) */
export interface CarModel {
  model_name: string        // Interní název modelu, např. "A-Class"
  model_make_id: string     // ID výrobce
  model_trim?: string       // Varianta/výbava
  model_year?: string       // Rok modelu
}

/** Dostupné roky pro daný model */
export interface CarYears {
  min_year: string          // Nejstarší dostupný rok
  max_year: string          // Nejnovější dostupný rok
}

/** Výbava/varianta vozu */
export interface CarTrim {
  model_id: string
  model_make_id: string
  model_name: string
  model_trim: string        // Název výbavy, např. "AMG Line"
  model_year: string
  model_body: string        // Karoserie: Sedan, SUV, Coupe...
  model_engine_position: string
  model_engine_cc: string   // Objem motoru v cc
  model_engine_cyl: string  // Počet válců
  model_engine_type: string // Typ motoru: Inline, V, Boxer
  model_engine_valves_per_cyl: string
  model_engine_power_ps: string    // Výkon v PS (koně)
  model_engine_power_rpm: string   // Otáčky při max výkonu
  model_engine_torque_nm: string   // Točivý moment Nm
  model_engine_torque_rpm: string  // Otáčky při max točivém momentu
  model_engine_bore_mm: string
  model_engine_stroke_mm: string
  model_engine_compression: string // Kompresní poměr
  model_engine_fuel: string        // Typ paliva: Gasoline, Diesel, Electric
  model_top_speed_kph: string      // Max rychlost km/h
  model_0_to_100_kph: string       // Zrychlení 0-100 km/h
  model_drive: string              // Pohon: AWD, FWD, RWD
  model_transmission_type: string  // Převodovka: Manual, Automatic
  model_seats: string              // Počet sedadel
  model_doors: string              // Počet dveří
  model_weight_kg: string          // Hmotnost kg
  model_length_mm: string          // Délka mm
  model_width_mm: string           // Šířka mm
  model_height_mm: string          // Výška mm
  model_wheelbase_mm: string       // Rozvor náprav mm
  model_lkm_hwy: string            // Spotřeba na dálnici l/100km (nebo MPG)
  model_lkm_mixed: string          // Kombinovaná spotřeba
  model_lkm_city: string           // Spotřeba ve městě
  model_fuel_cap_l: string         // Objem palivové nádrže
  model_sold_in_us: string         // Prodáváno v USA ("1"/"0")
  model_co2: string                // Emise CO2 g/km
  model_make_display: string       // Zobrazovaný název výrobce
}

/** Plné specifikace vozidla z getVehicle */
export interface CarVehicle extends CarTrim {
  model_id: string
}

// ═══════════════════════════════════════════════
// APLIKAČNÍ TYPY
// Typy pro interní stav aplikace
// ═══════════════════════════════════════════════

/** Uložené auto v Firebase (favorites nebo garage) */
export interface SavedCar {
  id: string                    // Firestore document ID
  makeId: string                // Slug výrobce, např. "mercedes-benz"
  makeDisplay: string           // Zobrazovaný název, např. "Mercedes-Benz"
  modelName: string             // Název modelu
  modelYear: string             // Rok
  trimName: string              // Výbava
  modelId: string               // CarQuery model_id pro načtení specifikací
  
  // Klíčové specifikace (uložené lokálně pro rychlý přístup bez API)
  powerPs?: number              // Výkon v PS
  powerKw?: number              // Výkon v kW
  engineCc?: number             // Objem motoru
  fuelType?: string             // Typ paliva
  topSpeedKph?: number          // Max rychlost
  acceleration?: number         // 0-100 km/h
  consumptionL100km?: number    // Kombinovaná spotřeba l/100km
  
  // Metadata
  addedAt: number               // Unix timestamp přidání
  notes?: string                // Uživatelská poznámka
  imageUrl?: string             // URL obrázku
}

/** Výsledek porovnání dvou aut */
export interface CarComparison {
  car1: SavedCar
  car2: SavedCar
}

/** Stav pro vybranou značku/model/rok */
export interface SelectionState {
  makeId: string
  makeDisplay: string
  modelName: string
  modelYear: string
}

/** Theme nastavení */
export type Theme = 'dark' | 'light'

/** Navigation tab */
export type NavTab = 'home' | 'favorites' | 'garage'

// ═══════════════════════════════════════════════
// POMOCNÉ TYPY
// ═══════════════════════════════════════════════

/** Stav asynchronní operace */
export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

/** CarQuery API wrapper response pro makes */
export interface CarQueryMakesResponse {
  Makes: CarMake[]
}

/** CarQuery API wrapper response pro models */
export interface CarQueryModelsResponse {
  Models: CarModel[]
}

/** CarQuery API wrapper response pro trims */
export interface CarQueryTrimsResponse {
  Trims: CarTrim[]
}

/** CarQuery API wrapper response pro vehicle */
export interface CarQueryVehicleResponse {
  Trims: CarVehicle[]
}

// ═══════════════════════════════════════════════
// BRAND KONFIGURACE
// Statická data o podporovaných značkách
// ═══════════════════════════════════════════════

export interface BrandConfig {
  id: string                // CarQuery make_id
  display: string           // Zobrazovaný název
  country: string           // Země původu
  founded: number           // Rok založení
  tagline: string           // Marketingový slogan
  accentColor: string       // CSS barva pro brand accent
  logo: string              // SVG logo jako string nebo cesta
  unsplashQuery: string     // Query pro Unsplash obrázky
}
