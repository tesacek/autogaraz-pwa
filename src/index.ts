import * as functions from 'firebase-functions/v1'
import fetch from 'node-fetch'

const NHTSA = 'https://vpic.nhtsa.dot.gov/api/vehicles'

async function nhtsa<T>(path: string): Promise<T> {
  const url = `${NHTSA}${path}${path.includes('?') ? '&' : '?'}format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`NHTSA ${res.status}`)
  return res.json() as Promise<T>
}

export const cars = functions
    .region('europe-west1')
    .https.onRequest(async (req, res) => {
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
      if (req.method === 'OPTIONS') { res.status(204).send(''); return }

      const { cmd, make, model, year } = req.query as Record<string, string>

      try {
        switch (cmd) {

          case 'getModels': {
            if (!make) { res.status(400).json({ error: 'make required' }); return }
            const currentYear = new Date().getFullYear()
            const data = await nhtsa<{ Results: Array<{ Model_Name: string }> }>(
                `/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${currentYear}`
            )
            const seen = new Set<string>()
            const models = data.Results
                .filter(m => { if (seen.has(m.Model_Name)) return false; seen.add(m.Model_Name); return true })
                .map(m => ({ model_name: m.Model_Name, model_make_id: make.toLowerCase() }))
                .sort((a, b) => a.model_name.localeCompare(b.model_name))
            res.json({ Models: models }); return
          }

          case 'getYears': {
            if (!make || !model) { res.status(400).json({ error: 'make and model required' }); return }
            const currentYear = new Date().getFullYear()
            const checks = []
            for (let y = currentYear; y >= 2000; y--) {
              checks.push(
                  nhtsa<{ Results: Array<{ Model_Name: string }> }>(
                      `/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${y}`
                  ).then(d => ({
                    year: y,
                    exists: d.Results.some(r => r.Model_Name?.toLowerCase() === model.toLowerCase()),
                  })).catch(() => ({ year: y, exists: false }))
              )
            }
            const results = await Promise.all(checks)
            const years = results.filter(r => r.exists).map(r => r.year)
            res.json({ Years: years }); return
          }

          case 'getTrims': {
            if (!make || !model || !year) { res.status(400).json({ error: 'make, model, year required' }); return }
            const data = await nhtsa<{ Results: Array<{ Model_Name: string }> }>(
                `/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${encodeURIComponent(year)}`
            )
            const exists = data.Results.some(r => r.Model_Name?.toLowerCase() === model.toLowerCase())
            if (!exists) { res.json({ Trims: [] }); return }
            const trimId = `${make.toLowerCase().replace(/\s+/g, '-')}_${model.toLowerCase().replace(/\s+/g, '-')}_${year}_0`
            res.json({
              Trims: [{
                model_id: trimId,
                model_make_id: make.toLowerCase(),
                model_name: model,
                model_trim: 'Základní výbava',
                model_year: year,
              }]
            }); return
          }

          case 'getVehicle': {
            if (!make || !model || !year) { res.status(400).json({ error: 'make, model, year required' }); return }
            const key = `${make.toLowerCase()}|${model.toLowerCase()}|${year}`
            const spec = VEHICLE_SPECS[key] ?? makeDefaultSpec(make, model, year)
            res.json({ Vehicle: spec }); return
          }

          default:
            res.status(400).json({ error: `Unknown cmd: ${cmd}` })
        }
      } catch (err: unknown) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
      }
    })

// ─── SPECIFIKACE ─────────────────────────────────────────────────────────────

function makeDefaultSpec(make: string, model: string, year: string) {
  return {
    model_make_id: make.toLowerCase().replace(/\s+/g, '-'),
    model_make_display: make,
    model_name: model,
    model_year: year,
    model_trim: 'Standard',
    model_engine_power_ps: '',
    model_lkm_mixed: '',
    model_lkm_hwy: '',
    model_lkm_city: '',
    model_engine_fuel: 'Benzín',
    model_engine_cc: '',
    model_top_speed_kph: '',
    model_0_to_100_kph: '',
    model_drive: '',
    model_transmission_type: '',
    model_seats: '5',
    model_doors: '4',
  }
}

type Spec = ReturnType<typeof makeDefaultSpec>

function s(make: string, model: string, year: string, overrides: Partial<Spec>): Spec {
  return { ...makeDefaultSpec(make, model, year), ...overrides }
}

const VEHICLE_SPECS: Record<string, Spec> = {
  'bmw|3 series|2023': s('BMW', '3 Series', '2023', { model_engine_power_ps: '258', model_lkm_mixed: '6.8', model_lkm_hwy: '5.5', model_lkm_city: '8.2', model_engine_cc: '1998', model_top_speed_kph: '250', model_0_to_100_kph: '5.8', model_drive: 'RWD', model_transmission_type: 'Automatická 8st.' }),
  'bmw|5 series|2023': s('BMW', '5 Series', '2023', { model_engine_power_ps: '299', model_lkm_mixed: '7.2', model_lkm_hwy: '5.8', model_lkm_city: '9.1', model_engine_cc: '2998', model_top_speed_kph: '250', model_0_to_100_kph: '5.4', model_drive: 'RWD', model_transmission_type: 'Automatická 8st.' }),
  'bmw|m3|2023': s('BMW', 'M3', '2023', { model_engine_power_ps: '510', model_lkm_mixed: '10.8', model_lkm_hwy: '8.2', model_lkm_city: '14.1', model_engine_cc: '2993', model_top_speed_kph: '290', model_0_to_100_kph: '3.5', model_drive: 'AWD', model_transmission_type: 'Automatická 8st.' }),
  'bmw|m5|2023': s('BMW', 'M5', '2023', { model_engine_power_ps: '625', model_lkm_mixed: '11.4', model_lkm_hwy: '8.5', model_lkm_city: '15.1', model_engine_cc: '4395', model_top_speed_kph: '305', model_0_to_100_kph: '3.3', model_drive: 'AWD', model_transmission_type: 'Automatická 8st.' }),
  'bmw|x5|2023': s('BMW', 'X5', '2023', { model_engine_power_ps: '340', model_lkm_mixed: '8.5', model_lkm_hwy: '7.0', model_lkm_city: '10.5', model_engine_cc: '2998', model_top_speed_kph: '250', model_0_to_100_kph: '5.5', model_drive: 'AWD', model_transmission_type: 'Automatická 8st.' }),
  'bmw|x7|2023': s('BMW', 'X7', '2023', { model_engine_power_ps: '340', model_lkm_mixed: '9.1', model_lkm_hwy: '7.3', model_lkm_city: '11.5', model_engine_cc: '2998', model_top_speed_kph: '250', model_0_to_100_kph: '5.8', model_drive: 'AWD', model_transmission_type: 'Automatická 8st.' }),
  'mercedes-benz|c-class|2023': s('Mercedes-Benz', 'C-Class', '2023', { model_engine_power_ps: '204', model_lkm_mixed: '6.3', model_lkm_hwy: '5.1', model_lkm_city: '8.0', model_engine_cc: '1496', model_top_speed_kph: '240', model_0_to_100_kph: '7.3', model_drive: 'RWD', model_transmission_type: 'Automatická 9st.' }),
  'mercedes-benz|e-class|2023': s('Mercedes-Benz', 'E-Class', '2023', { model_engine_power_ps: '258', model_lkm_mixed: '7.0', model_lkm_hwy: '5.5', model_lkm_city: '8.9', model_engine_cc: '1999', model_top_speed_kph: '250', model_0_to_100_kph: '6.0', model_drive: 'RWD', model_transmission_type: 'Automatická 9st.' }),
  'mercedes-benz|s-class|2023': s('Mercedes-Benz', 'S-Class', '2023', { model_engine_power_ps: '435', model_lkm_mixed: '8.4', model_lkm_hwy: '6.5', model_lkm_city: '10.8', model_engine_cc: '2999', model_top_speed_kph: '250', model_0_to_100_kph: '4.9', model_drive: 'AWD', model_transmission_type: 'Automatická 9st.' }),
  'mercedes-benz|glc|2023': s('Mercedes-Benz', 'GLC', '2023', { model_engine_power_ps: '204', model_lkm_mixed: '6.8', model_lkm_hwy: '5.5', model_lkm_city: '8.6', model_engine_cc: '1496', model_top_speed_kph: '220', model_0_to_100_kph: '7.6', model_drive: 'AWD', model_transmission_type: 'Automatická 9st.' }),
  'mercedes-benz|gle|2023': s('Mercedes-Benz', 'GLE', '2023', { model_engine_power_ps: '299', model_lkm_mixed: '8.6', model_lkm_hwy: '6.8', model_lkm_city: '11.0', model_engine_cc: '2999', model_top_speed_kph: '245', model_0_to_100_kph: '6.0', model_drive: 'AWD', model_transmission_type: 'Automatická 9st.' }),
  'mercedes-benz|amg gt|2023': s('Mercedes-Benz', 'AMG GT', '2023', { model_engine_power_ps: '530', model_lkm_mixed: '11.4', model_lkm_hwy: '8.8', model_lkm_city: '14.9', model_engine_cc: '3982', model_top_speed_kph: '310', model_0_to_100_kph: '3.7', model_drive: 'RWD', model_transmission_type: 'Automatická 7st.' }),
  'audi|a4|2023': s('Audi', 'A4', '2023', { model_engine_power_ps: '150', model_lkm_mixed: '5.9', model_lkm_hwy: '4.8', model_lkm_city: '7.6', model_engine_cc: '1984', model_top_speed_kph: '237', model_0_to_100_kph: '8.5', model_drive: 'FWD', model_transmission_type: 'Automatická 7st.' }),
  'audi|a6|2023': s('Audi', 'A6', '2023', { model_engine_power_ps: '204', model_lkm_mixed: '6.5', model_lkm_hwy: '5.2', model_lkm_city: '8.3', model_engine_cc: '1984', model_top_speed_kph: '250', model_0_to_100_kph: '7.4', model_drive: 'AWD', model_transmission_type: 'Automatická 7st.' }),
  'audi|q5|2023': s('Audi', 'Q5', '2023', { model_engine_power_ps: '204', model_lkm_mixed: '7.2', model_lkm_hwy: '5.8', model_lkm_city: '9.1', model_engine_cc: '1984', model_top_speed_kph: '225', model_0_to_100_kph: '7.5', model_drive: 'AWD', model_transmission_type: 'Automatická 7st.' }),
  'audi|q7|2023': s('Audi', 'Q7', '2023', { model_engine_power_ps: '249', model_lkm_mixed: '8.2', model_lkm_hwy: '6.5', model_lkm_city: '10.5', model_engine_cc: '1984', model_top_speed_kph: '237', model_0_to_100_kph: '6.9', model_drive: 'AWD', model_transmission_type: 'Automatická 8st.' }),
  'audi|rs6|2023': s('Audi', 'RS6', '2023', { model_engine_power_ps: '600', model_lkm_mixed: '11.7', model_lkm_hwy: '8.8', model_lkm_city: '15.3', model_engine_cc: '3996', model_top_speed_kph: '305', model_0_to_100_kph: '3.4', model_drive: 'AWD', model_transmission_type: 'Automatická 8st.' }),
  'audi|r8|2023': s('Audi', 'R8', '2023', { model_engine_power_ps: '620', model_lkm_mixed: '13.5', model_lkm_hwy: '10.5', model_lkm_city: '17.2', model_engine_cc: '5204', model_top_speed_kph: '331', model_0_to_100_kph: '3.1', model_drive: 'AWD', model_transmission_type: 'Automatická 7st.' }),
}