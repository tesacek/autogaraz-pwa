// src/services/staticCarData.ts
// Statická data aut pro případ nedostupnosti CarQuery API
// Data obsahují nejpopulárnější modely Mercedes-Benz, BMW a Audi

import type { CarModel, CarTrim } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// MODELY
// ─────────────────────────────────────────────────────────────────────────────

export const STATIC_MODELS: Record<string, CarModel[]> = {
    'mercedes-benz': [
        { model_make_id: 'mercedes-benz', model_name: 'A-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'B-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'C-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'CLA' },
        { model_make_id: 'mercedes-benz', model_name: 'CLS' },
        { model_make_id: 'mercedes-benz', model_name: 'E-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'G-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'GLA' },
        { model_make_id: 'mercedes-benz', model_name: 'GLB' },
        { model_make_id: 'mercedes-benz', model_name: 'GLC' },
        { model_make_id: 'mercedes-benz', model_name: 'GLE' },
        { model_make_id: 'mercedes-benz', model_name: 'GLS' },
        { model_make_id: 'mercedes-benz', model_name: 'S-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'SL' },
        { model_make_id: 'mercedes-benz', model_name: 'AMG GT' },
        { model_make_id: 'mercedes-benz', model_name: 'EQS' },
        { model_make_id: 'mercedes-benz', model_name: 'EQE' },
        { model_make_id: 'mercedes-benz', model_name: 'EQA' },
        { model_make_id: 'mercedes-benz', model_name: 'EQB' },
        { model_make_id: 'mercedes-benz', model_name: 'EQC' },
    ],
    'bmw': [
        { model_make_id: 'bmw', model_name: '1 Series' },
        { model_make_id: 'bmw', model_name: '2 Series' },
        { model_make_id: 'bmw', model_name: '3 Series' },
        { model_make_id: 'bmw', model_name: '4 Series' },
        { model_make_id: 'bmw', model_name: '5 Series' },
        { model_make_id: 'bmw', model_name: '6 Series' },
        { model_make_id: 'bmw', model_name: '7 Series' },
        { model_make_id: 'bmw', model_name: '8 Series' },
        { model_make_id: 'bmw', model_name: 'M2' },
        { model_make_id: 'bmw', model_name: 'M3' },
        { model_make_id: 'bmw', model_name: 'M4' },
        { model_make_id: 'bmw', model_name: 'M5' },
        { model_make_id: 'bmw', model_name: 'M8' },
        { model_make_id: 'bmw', model_name: 'X1' },
        { model_make_id: 'bmw', model_name: 'X2' },
        { model_make_id: 'bmw', model_name: 'X3' },
        { model_make_id: 'bmw', model_name: 'X4' },
        { model_make_id: 'bmw', model_name: 'X5' },
        { model_make_id: 'bmw', model_name: 'X6' },
        { model_make_id: 'bmw', model_name: 'X7' },
        { model_make_id: 'bmw', model_name: 'iX' },
        { model_make_id: 'bmw', model_name: 'i4' },
        { model_make_id: 'bmw', model_name: 'i7' },
        { model_make_id: 'bmw', model_name: 'Z4' },
    ],
    'audi': [
        { model_make_id: 'audi', model_name: 'A1' },
        { model_make_id: 'audi', model_name: 'A3' },
        { model_make_id: 'audi', model_name: 'A4' },
        { model_make_id: 'audi', model_name: 'A5' },
        { model_make_id: 'audi', model_name: 'A6' },
        { model_make_id: 'audi', model_name: 'A7' },
        { model_make_id: 'audi', model_name: 'A8' },
        { model_make_id: 'audi', model_name: 'Q2' },
        { model_make_id: 'audi', model_name: 'Q3' },
        { model_make_id: 'audi', model_name: 'Q4 e-tron' },
        { model_make_id: 'audi', model_name: 'Q5' },
        { model_make_id: 'audi', model_name: 'Q6 e-tron' },
        { model_make_id: 'audi', model_name: 'Q7' },
        { model_make_id: 'audi', model_name: 'Q8' },
        { model_make_id: 'audi', model_name: 'RS3' },
        { model_make_id: 'audi', model_name: 'RS4' },
        { model_make_id: 'audi', model_name: 'RS5' },
        { model_make_id: 'audi', model_name: 'RS6' },
        { model_make_id: 'audi', model_name: 'RS7' },
        { model_make_id: 'audi', model_name: 'RS Q8' },
        { model_make_id: 'audi', model_name: 'S3' },
        { model_make_id: 'audi', model_name: 'S4' },
        { model_make_id: 'audi', model_name: 'S5' },
        { model_make_id: 'audi', model_name: 'S6' },
        { model_make_id: 'audi', model_name: 'TT' },
        { model_make_id: 'audi', model_name: 'R8' },
        { model_make_id: 'audi', model_name: 'e-tron GT' },
    ],
}

// ─────────────────────────────────────────────────────────────────────────────
// ROKY (generujeme dynamicky pro rozsah 2000–2024)
// ─────────────────────────────────────────────────────────────────────────────

export function getStaticYears(_makeId: string, modelName: string): number[] {
    // Roky výroby pro konkrétní modely
    const modelYears: Record<string, [number, number]> = {
        // BMW
        'M3': [1986, 2024], 'M4': [2014, 2024], 'M5': [1985, 2024],
        'M2': [2016, 2024], 'M8': [2019, 2024],
        '3 Series': [1975, 2024], '5 Series': [1972, 2024], '7 Series': [1977, 2024],
        'X5': [1999, 2024], 'X3': [2003, 2024], 'i4': [2021, 2024], 'iX': [2021, 2024],
        // Mercedes
        'C-Class': [1993, 2024], 'E-Class': [1993, 2024], 'S-Class': [1972, 2024],
        'AMG GT': [2014, 2024], 'GLE': [2015, 2024], 'G-Class': [1979, 2024],
        'EQS': [2021, 2024], 'EQE': [2022, 2024],
        // Audi
        'A4': [1994, 2024], 'A6': [1994, 2024], 'Q5': [2008, 2024],
        'RS6': [2002, 2024], 'R8': [2006, 2024], 'e-tron GT': [2021, 2024],
    }

    const range = modelYears[modelName] ?? [2005, 2024]
    const years: number[] = []
    for (let y = range[1]; y >= range[0]; y--) years.push(y)
    return years
}

// ─────────────────────────────────────────────────────────────────────────────
// VÝBAVY – statická data pro nejpopulárnější modely
// ─────────────────────────────────────────────────────────────────────────────

// Generátor výbav podle modelu a roku
export function getStaticTrims(makeId: string, modelName: string, year: number): CarTrim[] {
    const key = `${makeId}:${modelName}`
    const templates = TRIM_TEMPLATES[key] ?? getGenericTrims(makeId, modelName, year)
    return templates.map((t, i) => ({
        ...t,
        model_id: `static_${makeId}_${modelName}_${year}_${i}`.replace(/\s+/g, '_'),
        model_make_id: makeId,
        model_name: modelName,
        model_year: String(year),
    }))
}

// Generické výbavy pro modely bez specifických dat
function getGenericTrims(_makeId: string, modelName: string, _year: number): Omit<CarTrim, 'model_id' | 'model_make_id' | 'model_name' | 'model_year'>[] {
    const isM = modelName.startsWith('M') || modelName.startsWith('RS') || modelName.startsWith('AMG')
    if (isM) {
        return [
            { model_trim: 'Base', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '3000', model_engine_power_ps: '480', model_lkm_mixed: '10.5' },
            { model_trim: 'Competition', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '3000', model_engine_power_ps: '530', model_lkm_mixed: '11.2' },
        ]
    }
    return [
        { model_trim: '2.0 TDI', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '1968', model_engine_power_ps: '150', model_lkm_mixed: '5.2' },
        { model_trim: '2.0 TFSI', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1984', model_engine_power_ps: '190', model_lkm_mixed: '6.8' },
        { model_trim: '3.0 TDI', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '2967', model_engine_power_ps: '231', model_lkm_mixed: '6.0' },
        { model_trim: 'Plug-in Hybrid', model_body: 'Sedan', model_engine_fuel: 'Hybrid', model_engine_cc: '1984', model_engine_power_ps: '245', model_lkm_mixed: '2.1' },
    ]
}

type TrimTemplate = Omit<CarTrim, 'model_id' | 'model_make_id' | 'model_name' | 'model_year'>

const TRIM_TEMPLATES: Record<string, TrimTemplate[]> = {
    'bmw:M3': [
        { model_trim: 'Competition', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2993', model_engine_power_ps: '510', model_lkm_mixed: '10.4', model_lkm_hwy: '8.1' },
        { model_trim: 'CS', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2993', model_engine_power_ps: '550', model_lkm_mixed: '10.8', model_lkm_hwy: '8.3' },
        { model_trim: 'xDrive Touring', model_body: 'Estate', model_engine_fuel: 'Gasoline', model_engine_cc: '2993', model_engine_power_ps: '510', model_lkm_mixed: '10.6', model_lkm_hwy: '8.2' },
    ],
    'bmw:M4': [
        { model_trim: 'Competition', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '2993', model_engine_power_ps: '510', model_lkm_mixed: '10.4', model_lkm_hwy: '8.0' },
        { model_trim: 'Competition xDrive', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '2993', model_engine_power_ps: '510', model_lkm_mixed: '10.7', model_lkm_hwy: '8.2' },
        { model_trim: 'CSL', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '2993', model_engine_power_ps: '550', model_lkm_mixed: '10.9', model_lkm_hwy: '8.4' },
    ],
    'bmw:M5': [
        { model_trim: 'Base', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '4395', model_engine_power_ps: '600', model_lkm_mixed: '11.6', model_lkm_hwy: '8.5' },
        { model_trim: 'Competition', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '4395', model_engine_power_ps: '625', model_lkm_mixed: '11.9', model_lkm_hwy: '8.7' },
        { model_trim: 'CS', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '4395', model_engine_power_ps: '635', model_lkm_mixed: '12.1', model_lkm_hwy: '9.0' },
    ],
    'bmw:3 Series': [
        { model_trim: '318i', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1499', model_engine_power_ps: '136', model_lkm_mixed: '6.1', model_lkm_hwy: '4.8' },
        { model_trim: '320i', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1998', model_engine_power_ps: '184', model_lkm_mixed: '6.4', model_lkm_hwy: '5.0' },
        { model_trim: '320d', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '1995', model_engine_power_ps: '163', model_lkm_mixed: '4.9', model_lkm_hwy: '3.9' },
        { model_trim: '330i', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2998', model_engine_power_ps: '258', model_lkm_mixed: '7.2', model_lkm_hwy: '5.6' },
        { model_trim: '330d', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '2993', model_engine_power_ps: '265', model_lkm_mixed: '5.3', model_lkm_hwy: '4.2' },
        { model_trim: '340i xDrive', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2998', model_engine_power_ps: '374', model_lkm_mixed: '8.0', model_lkm_hwy: '6.1' },
    ],
    'bmw:5 Series': [
        { model_trim: '520i', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1998', model_engine_power_ps: '184', model_lkm_mixed: '6.5', model_lkm_hwy: '5.1' },
        { model_trim: '520d', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '1995', model_engine_power_ps: '163', model_lkm_mixed: '5.0', model_lkm_hwy: '3.9' },
        { model_trim: '530i', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2998', model_engine_power_ps: '252', model_lkm_mixed: '7.0', model_lkm_hwy: '5.5' },
        { model_trim: '530d', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '2993', model_engine_power_ps: '265', model_lkm_mixed: '5.4', model_lkm_hwy: '4.3' },
        { model_trim: '540i xDrive', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2998', model_engine_power_ps: '333', model_lkm_mixed: '8.0', model_lkm_hwy: '6.2' },
        { model_trim: 'M550i xDrive', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '4395', model_engine_power_ps: '530', model_lkm_mixed: '10.8', model_lkm_hwy: '8.0' },
    ],
    'audi:A4': [
        { model_trim: '35 TDI', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '1968', model_engine_power_ps: '150', model_lkm_mixed: '5.0', model_lkm_hwy: '4.1' },
        { model_trim: '40 TDI quattro', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '1968', model_engine_power_ps: '204', model_lkm_mixed: '5.3', model_lkm_hwy: '4.3' },
        { model_trim: '40 TFSI', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1984', model_engine_power_ps: '190', model_lkm_mixed: '6.8', model_lkm_hwy: '5.4' },
        { model_trim: '45 TFSI quattro', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1984', model_engine_power_ps: '265', model_lkm_mixed: '7.5', model_lkm_hwy: '5.8' },
        { model_trim: '50 TDI quattro', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '2967', model_engine_power_ps: '286', model_lkm_mixed: '6.1', model_lkm_hwy: '5.0' },
    ],
    'audi:RS6': [
        { model_trim: 'Avant', model_body: 'Estate', model_engine_fuel: 'Gasoline', model_engine_cc: '3996', model_engine_power_ps: '600', model_lkm_mixed: '11.7', model_lkm_hwy: '8.8' },
        { model_trim: 'Avant performance', model_body: 'Estate', model_engine_fuel: 'Gasoline', model_engine_cc: '3996', model_engine_power_ps: '630', model_lkm_mixed: '12.0', model_lkm_hwy: '9.0' },
    ],
    'audi:R8': [
        { model_trim: 'V10', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '5204', model_engine_power_ps: '570', model_lkm_mixed: '13.5', model_lkm_hwy: '10.4' },
        { model_trim: 'V10 performance', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '5204', model_engine_power_ps: '620', model_lkm_mixed: '13.9', model_lkm_hwy: '10.8' },
        { model_trim: 'V10 Spyder', model_body: 'Convertible', model_engine_fuel: 'Gasoline', model_engine_cc: '5204', model_engine_power_ps: '570', model_lkm_mixed: '13.7', model_lkm_hwy: '10.5' },
    ],
    'mercedes-benz:C-Class': [
        { model_trim: 'C 180', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1496', model_engine_power_ps: '156', model_lkm_mixed: '6.4', model_lkm_hwy: '5.0' },
        { model_trim: 'C 200', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1496', model_engine_power_ps: '204', model_lkm_mixed: '6.6', model_lkm_hwy: '5.1' },
        { model_trim: 'C 220 d', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '1993', model_engine_power_ps: '200', model_lkm_mixed: '5.0', model_lkm_hwy: '4.0' },
        { model_trim: 'C 300', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1999', model_engine_power_ps: '258', model_lkm_mixed: '7.2', model_lkm_hwy: '5.6' },
        { model_trim: 'C 300 e', model_body: 'Sedan', model_engine_fuel: 'Hybrid', model_engine_cc: '1999', model_engine_power_ps: '320', model_lkm_mixed: '2.0', model_lkm_hwy: '1.5' },
        { model_trim: 'AMG C 43', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '1999', model_engine_power_ps: '408', model_lkm_mixed: '8.5', model_lkm_hwy: '6.8' },
        { model_trim: 'AMG C 63 S E Performance', model_body: 'Sedan', model_engine_fuel: 'Hybrid', model_engine_cc: '1999', model_engine_power_ps: '680', model_lkm_mixed: '6.7', model_lkm_hwy: '5.0' },
    ],
    'mercedes-benz:S-Class': [
        { model_trim: 'S 400 d', model_body: 'Sedan', model_engine_fuel: 'Diesel', model_engine_cc: '2925', model_engine_power_ps: '330', model_lkm_mixed: '6.6', model_lkm_hwy: '5.4' },
        { model_trim: 'S 450', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2999', model_engine_power_ps: '367', model_lkm_mixed: '8.3', model_lkm_hwy: '6.5' },
        { model_trim: 'S 500', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '2999', model_engine_power_ps: '435', model_lkm_mixed: '9.0', model_lkm_hwy: '7.0' },
        { model_trim: 'S 580', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '3982', model_engine_power_ps: '503', model_lkm_mixed: '10.2', model_lkm_hwy: '8.0' },
        { model_trim: 'AMG S 63 E Performance', model_body: 'Sedan', model_engine_fuel: 'Hybrid', model_engine_cc: '3982', model_engine_power_ps: '802', model_lkm_mixed: '8.9', model_lkm_hwy: '7.0' },
        { model_trim: 'Maybach S 580', model_body: 'Sedan', model_engine_fuel: 'Gasoline', model_engine_cc: '3982', model_engine_power_ps: '503', model_lkm_mixed: '10.5', model_lkm_hwy: '8.2' },
    ],
    'mercedes-benz:AMG GT': [
        { model_trim: 'AMG GT 43', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '2999', model_engine_power_ps: '476', model_lkm_mixed: '9.6', model_lkm_hwy: '7.5' },
        { model_trim: 'AMG GT 55', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '4000', model_engine_power_ps: '530', model_lkm_mixed: '10.5', model_lkm_hwy: '8.2' },
        { model_trim: 'AMG GT 63', model_body: 'Coupe', model_engine_fuel: 'Gasoline', model_engine_cc: '4000', model_engine_power_ps: '585', model_lkm_mixed: '11.0', model_lkm_hwy: '8.5' },
        { model_trim: 'AMG GT 63 S E Performance', model_body: 'Coupe', model_engine_fuel: 'Hybrid', model_engine_cc: '4000', model_engine_power_ps: '843', model_lkm_mixed: '8.6', model_lkm_hwy: '6.8' },
    ],
}