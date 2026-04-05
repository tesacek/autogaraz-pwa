// src/services/staticCarData.ts
// Kompletní statická data — modely, obrázky (Wikimedia), plné specifikace

import type { CarModel, CarTrim, CarVehicle } from '../types'

export const STATIC_MODELS: Record<string, CarModel[]> = {
    'mercedes-benz': [
        { model_make_id: 'mercedes-benz', model_name: 'A-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'C-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'CLA' },
        { model_make_id: 'mercedes-benz', model_name: 'CLS' },
        { model_make_id: 'mercedes-benz', model_name: 'E-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'G-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'GLA' },
        { model_make_id: 'mercedes-benz', model_name: 'GLC' },
        { model_make_id: 'mercedes-benz', model_name: 'GLE' },
        { model_make_id: 'mercedes-benz', model_name: 'GLS' },
        { model_make_id: 'mercedes-benz', model_name: 'S-Class' },
        { model_make_id: 'mercedes-benz', model_name: 'SL' },
        { model_make_id: 'mercedes-benz', model_name: 'AMG GT' },
        { model_make_id: 'mercedes-benz', model_name: 'EQS' },
        { model_make_id: 'mercedes-benz', model_name: 'EQE' },
    ],
    'bmw': [
        { model_make_id: 'bmw', model_name: '1 Series' },
        { model_make_id: 'bmw', model_name: '2 Series' },
        { model_make_id: 'bmw', model_name: '3 Series' },
        { model_make_id: 'bmw', model_name: '4 Series' },
        { model_make_id: 'bmw', model_name: '5 Series' },
        { model_make_id: 'bmw', model_name: '7 Series' },
        { model_make_id: 'bmw', model_name: '8 Series' },
        { model_make_id: 'bmw', model_name: 'M2' },
        { model_make_id: 'bmw', model_name: 'M3' },
        { model_make_id: 'bmw', model_name: 'M4' },
        { model_make_id: 'bmw', model_name: 'M5' },
        { model_make_id: 'bmw', model_name: 'X3' },
        { model_make_id: 'bmw', model_name: 'X5' },
        { model_make_id: 'bmw', model_name: 'X6' },
        { model_make_id: 'bmw', model_name: 'X7' },
        { model_make_id: 'bmw', model_name: 'i4' },
        { model_make_id: 'bmw', model_name: 'iX' },
        { model_make_id: 'bmw', model_name: 'Z4' },
    ],
    'audi': [
        { model_make_id: 'audi', model_name: 'A3' },
        { model_make_id: 'audi', model_name: 'A4' },
        { model_make_id: 'audi', model_name: 'A5' },
        { model_make_id: 'audi', model_name: 'A6' },
        { model_make_id: 'audi', model_name: 'A7' },
        { model_make_id: 'audi', model_name: 'A8' },
        { model_make_id: 'audi', model_name: 'Q3' },
        { model_make_id: 'audi', model_name: 'Q5' },
        { model_make_id: 'audi', model_name: 'Q7' },
        { model_make_id: 'audi', model_name: 'Q8' },
        { model_make_id: 'audi', model_name: 'RS3' },
        { model_make_id: 'audi', model_name: 'RS4' },
        { model_make_id: 'audi', model_name: 'RS6' },
        { model_make_id: 'audi', model_name: 'RS7' },
        { model_make_id: 'audi', model_name: 'TT' },
        { model_make_id: 'audi', model_name: 'R8' },
        { model_make_id: 'audi', model_name: 'e-tron GT' },
    ],
}

// Obrázky z Wikimedia Commons (volné licence, bez API klíče)
const MODEL_IMAGES: Record<string, string> = {
    'bmw:M3': 'https://source.unsplash.com/800x500/?BMW+M3+competition',
    'bmw:M4': 'https://source.unsplash.com/800x500/?BMW+M4+coupe',
    'bmw:M5': 'https://source.unsplash.com/800x500/?BMW+M5+sedan',
    'bmw:M2': 'https://source.unsplash.com/800x500/?BMW+M2+coupe',
    'bmw:3 Series': 'https://source.unsplash.com/800x500/?BMW+3+Series',
    'bmw:5 Series': 'https://source.unsplash.com/800x500/?BMW+5+Series',
    'bmw:7 Series': 'https://source.unsplash.com/800x500/?BMW+7+Series',
    'bmw:X5': 'https://source.unsplash.com/800x500/?BMW+X5+SUV',
    'bmw:X3': 'https://source.unsplash.com/800x500/?BMW+X3+SUV',
    'bmw:X6': 'https://source.unsplash.com/800x500/?BMW+X6+SUV',
    'bmw:X7': 'https://source.unsplash.com/800x500/?BMW+X7+luxury',
    'bmw:i4': 'https://source.unsplash.com/800x500/?BMW+i4+electric',
    'bmw:iX': 'https://source.unsplash.com/800x500/?BMW+iX+electric',
    'bmw:Z4': 'https://source.unsplash.com/800x500/?BMW+Z4+roadster',
    'bmw:4 Series': 'https://source.unsplash.com/800x500/?BMW+4+Series+coupe',
    'bmw:8 Series': 'https://source.unsplash.com/800x500/?BMW+8+Series',
    'bmw:1 Series': 'https://source.unsplash.com/800x500/?BMW+1+Series',
    'bmw:2 Series': 'https://source.unsplash.com/800x500/?BMW+2+Series',
    'mercedes-benz:C-Class': 'https://source.unsplash.com/800x500/?Mercedes+C+Class',
    'mercedes-benz:E-Class': 'https://source.unsplash.com/800x500/?Mercedes+E+Class',
    'mercedes-benz:S-Class': 'https://source.unsplash.com/800x500/?Mercedes+S+Class+luxury',
    'mercedes-benz:A-Class': 'https://source.unsplash.com/800x500/?Mercedes+A+Class',
    'mercedes-benz:GLC': 'https://source.unsplash.com/800x500/?Mercedes+GLC+SUV',
    'mercedes-benz:GLE': 'https://source.unsplash.com/800x500/?Mercedes+GLE+SUV',
    'mercedes-benz:G-Class': 'https://source.unsplash.com/800x500/?Mercedes+G+Class+AMG',
    'mercedes-benz:AMG GT': 'https://source.unsplash.com/800x500/?Mercedes+AMG+GT+sports',
    'mercedes-benz:CLA': 'https://source.unsplash.com/800x500/?Mercedes+CLA+coupe',
    'mercedes-benz:CLS': 'https://source.unsplash.com/800x500/?Mercedes+CLS+sedan',
    'mercedes-benz:GLA': 'https://source.unsplash.com/800x500/?Mercedes+GLA+SUV',
    'mercedes-benz:GLS': 'https://source.unsplash.com/800x500/?Mercedes+GLS+luxury',
    'mercedes-benz:SL': 'https://source.unsplash.com/800x500/?Mercedes+SL+roadster',
    'mercedes-benz:EQS': 'https://source.unsplash.com/800x500/?Mercedes+EQS+electric',
    'mercedes-benz:EQE': 'https://source.unsplash.com/800x500/?Mercedes+EQE+electric',
    'audi:A4': 'https://source.unsplash.com/800x500/?Audi+A4+sedan',
    'audi:A6': 'https://source.unsplash.com/800x500/?Audi+A6+sedan',
    'audi:A3': 'https://source.unsplash.com/800x500/?Audi+A3+sportback',
    'audi:A5': 'https://source.unsplash.com/800x500/?Audi+A5+coupe',
    'audi:A7': 'https://source.unsplash.com/800x500/?Audi+A7+sportback',
    'audi:A8': 'https://source.unsplash.com/800x500/?Audi+A8+luxury',
    'audi:Q3': 'https://source.unsplash.com/800x500/?Audi+Q3+SUV',
    'audi:Q5': 'https://source.unsplash.com/800x500/?Audi+Q5+SUV',
    'audi:Q7': 'https://source.unsplash.com/800x500/?Audi+Q7+SUV',
    'audi:Q8': 'https://source.unsplash.com/800x500/?Audi+Q8+SUV',
    'audi:RS6': 'https://source.unsplash.com/800x500/?Audi+RS6+Avant',
    'audi:RS3': 'https://source.unsplash.com/800x500/?Audi+RS3+sportback',
    'audi:RS4': 'https://source.unsplash.com/800x500/?Audi+RS4+Avant',
    'audi:RS7': 'https://source.unsplash.com/800x500/?Audi+RS7+sportback',
    'audi:R8': 'https://source.unsplash.com/800x500/?Audi+R8+V10+supercar',
    'audi:TT': 'https://source.unsplash.com/800x500/?Audi+TT+coupe',
    'audi:e-tron GT': 'https://source.unsplash.com/800x500/?Audi+e-tron+GT+electric',
}
export function getModelImage(makeId: string, modelName: string): string {
    return MODEL_IMAGES[`${makeId}:${modelName}`]
        ?? `https://source.unsplash.com/800x500/?${encodeURIComponent(makeId + ' ' + modelName + ' car')}`
}

export function getStaticYears(_makeId: string, modelName: string): number[] {
    const ranges: Record<string, [number, number]> = {
        'M2': [2016, 2024], 'M3': [1986, 2024], 'M4': [2014, 2024], 'M5': [1985, 2024],
        '1 Series': [2004, 2024], '2 Series': [2014, 2024], '3 Series': [1975, 2024],
        '4 Series': [2013, 2024], '5 Series': [1972, 2024], '7 Series': [1977, 2024],
        '8 Series': [2018, 2024], 'X3': [2003, 2024], 'X5': [1999, 2024],
        'X6': [2008, 2024], 'X7': [2019, 2024], 'i4': [2021, 2024], 'iX': [2021, 2024], 'Z4': [1989, 2024],
        'A-Class': [1997, 2024], 'C-Class': [1993, 2024], 'E-Class': [1993, 2024],
        'S-Class': [1972, 2024], 'G-Class': [1979, 2024], 'GLA': [2013, 2024],
        'GLC': [2015, 2024], 'GLE': [2015, 2024], 'GLS': [2019, 2024],
        'CLA': [2013, 2024], 'CLS': [2004, 2024], 'SL': [1954, 2024],
        'AMG GT': [2014, 2024], 'EQS': [2021, 2024], 'EQE': [2022, 2024],
        'A3': [1996, 2024], 'A4': [1994, 2024], 'A5': [2007, 2024], 'A6': [1994, 2024],
        'A7': [2010, 2024], 'A8': [1994, 2024], 'Q3': [2011, 2024], 'Q5': [2008, 2024],
        'Q7': [2005, 2024], 'Q8': [2018, 2024], 'RS3': [2011, 2024], 'RS4': [2000, 2024],
        'RS6': [2002, 2024], 'RS7': [2013, 2024], 'TT': [1998, 2023],
        'R8': [2006, 2024], 'e-tron GT': [2021, 2024],
    }
    const range = ranges[modelName] ?? [2010, 2024]
    const years: number[] = []
    for (let y = range[1]; y >= range[0]; y--) years.push(y)
    return years
}

type FullSpec = Omit<CarVehicle, 'model_id' | 'model_make_id' | 'model_make_display' | 'model_name' | 'model_year'>

const FULL_SPECS: Record<string, FullSpec[]> = {
    'bmw:M3': [
        { model_trim: 'Competition', model_engine_power_ps: '510', model_lkm_mixed: '10.4', model_lkm_hwy: '8.1', model_lkm_city: '13.5', model_engine_fuel: 'Benzín', model_engine_cc: '2993', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '650', model_engine_power_rpm: '6250', model_engine_compression: '10.2:1', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.9', model_top_speed_kph: '290', model_fuel_cap_l: '59', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1730', model_length_mm: '4794', model_width_mm: '1903', model_height_mm: '1433', model_wheelbase_mm: '2857', model_engine_position: 'Přední' },
        { model_trim: 'CS', model_engine_power_ps: '550', model_lkm_mixed: '10.8', model_lkm_hwy: '8.3', model_lkm_city: '14.0', model_engine_fuel: 'Benzín', model_engine_cc: '2993', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '650', model_engine_power_rpm: '6500', model_engine_compression: '10.2:1', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.4', model_top_speed_kph: '302', model_fuel_cap_l: '59', model_body: 'Sedan', model_seats: '4', model_doors: '4', model_weight_kg: '1650', model_length_mm: '4794', model_width_mm: '1903', model_height_mm: '1433', model_wheelbase_mm: '2857', model_engine_position: 'Přední' },
    ],
    'bmw:M4': [
        { model_trim: 'Competition', model_engine_power_ps: '510', model_lkm_mixed: '10.4', model_lkm_hwy: '8.0', model_lkm_city: '13.5', model_engine_fuel: 'Benzín', model_engine_cc: '2993', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '650', model_engine_power_rpm: '6250', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.9', model_top_speed_kph: '290', model_fuel_cap_l: '59', model_body: 'Kupé', model_seats: '4', model_doors: '2', model_weight_kg: '1725', model_length_mm: '4794', model_width_mm: '1887', model_height_mm: '1393', model_wheelbase_mm: '2857', model_engine_position: 'Přední' },
        { model_trim: 'CSL', model_engine_power_ps: '550', model_lkm_mixed: '10.9', model_lkm_hwy: '8.4', model_lkm_city: '14.0', model_engine_fuel: 'Benzín', model_engine_cc: '2993', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '650', model_engine_power_rpm: '6500', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.7', model_top_speed_kph: '307', model_fuel_cap_l: '59', model_body: 'Kupé', model_seats: '2', model_doors: '2', model_weight_kg: '1625', model_length_mm: '4794', model_width_mm: '1887', model_height_mm: '1393', model_wheelbase_mm: '2857', model_engine_position: 'Přední' },
    ],
    'bmw:M5': [
        { model_trim: 'Competition', model_engine_power_ps: '625', model_lkm_mixed: '11.9', model_lkm_hwy: '8.7', model_lkm_city: '16.0', model_engine_fuel: 'Benzín', model_engine_cc: '4395', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '750', model_engine_power_rpm: '6000', model_engine_compression: '10.0:1', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.3', model_top_speed_kph: '305', model_fuel_cap_l: '68', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1900', model_length_mm: '4953', model_width_mm: '1903', model_height_mm: '1465', model_wheelbase_mm: '2975', model_engine_position: 'Přední' },
    ],
    'bmw:3 Series': [
        { model_trim: '320d xDrive', model_engine_power_ps: '190', model_lkm_mixed: '5.0', model_lkm_hwy: '4.1', model_lkm_city: '6.4', model_engine_fuel: 'Nafta', model_engine_cc: '1995', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '400', model_engine_power_rpm: '4000', model_engine_compression: '16.5:1', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '6.8', model_top_speed_kph: '235', model_fuel_cap_l: '59', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1610', model_length_mm: '4709', model_width_mm: '1827', model_height_mm: '1435', model_wheelbase_mm: '2851', model_engine_position: 'Přední' },
        { model_trim: '330i M Sport', model_engine_power_ps: '258', model_lkm_mixed: '7.2', model_lkm_hwy: '5.6', model_lkm_city: '9.4', model_engine_fuel: 'Benzín', model_engine_cc: '2998', model_engine_type: 'Řadový 6válec', model_engine_cyl: '6', model_engine_torque_nm: '400', model_engine_power_rpm: '5200', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '5.8', model_top_speed_kph: '250', model_fuel_cap_l: '59', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1540', model_length_mm: '4709', model_width_mm: '1827', model_height_mm: '1435', model_wheelbase_mm: '2851', model_engine_position: 'Přední' },
        { model_trim: '340i xDrive', model_engine_power_ps: '374', model_lkm_mixed: '8.0', model_lkm_hwy: '6.1', model_lkm_city: '10.5', model_engine_fuel: 'Benzín', model_engine_cc: '2998', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '500', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '4.6', model_top_speed_kph: '250', model_fuel_cap_l: '59', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1680', model_length_mm: '4709', model_width_mm: '1827', model_height_mm: '1435', model_wheelbase_mm: '2851', model_engine_position: 'Přední' },
    ],
    'bmw:5 Series': [
        { model_trim: '520d', model_engine_power_ps: '163', model_lkm_mixed: '5.0', model_lkm_hwy: '4.0', model_lkm_city: '6.5', model_engine_fuel: 'Nafta', model_engine_cc: '1995', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '400', model_engine_power_rpm: '4000', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '8.3', model_top_speed_kph: '224', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1660', model_length_mm: '4963', model_width_mm: '1868', model_height_mm: '1473', model_wheelbase_mm: '2975', model_engine_position: 'Přední' },
        { model_trim: '530i xDrive', model_engine_power_ps: '252', model_lkm_mixed: '7.0', model_lkm_hwy: '5.5', model_lkm_city: '9.0', model_engine_fuel: 'Benzín', model_engine_cc: '2998', model_engine_type: 'Řadový 6válec', model_engine_cyl: '6', model_engine_torque_nm: '400', model_engine_power_rpm: '5200', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '6.2', model_top_speed_kph: '250', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1780', model_length_mm: '4963', model_width_mm: '1868', model_height_mm: '1473', model_wheelbase_mm: '2975', model_engine_position: 'Přední' },
        { model_trim: 'M550i xDrive', model_engine_power_ps: '530', model_lkm_mixed: '10.8', model_lkm_hwy: '8.0', model_lkm_city: '14.0', model_engine_fuel: 'Benzín', model_engine_cc: '4395', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '750', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.9', model_top_speed_kph: '250', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2005', model_length_mm: '4963', model_width_mm: '1868', model_height_mm: '1473', model_wheelbase_mm: '2975', model_engine_position: 'Přední' },
    ],
    'bmw:X5': [
        { model_trim: 'xDrive30d M Sport', model_engine_power_ps: '286', model_lkm_mixed: '6.6', model_lkm_hwy: '5.4', model_lkm_city: '8.3', model_engine_fuel: 'Nafta', model_engine_cc: '2993', model_engine_type: 'Řadový 6válec', model_engine_cyl: '6', model_engine_torque_nm: '650', model_engine_power_rpm: '4000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '6.1', model_top_speed_kph: '235', model_fuel_cap_l: '85', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2095', model_length_mm: '4922', model_width_mm: '2004', model_height_mm: '1745', model_wheelbase_mm: '2975', model_engine_position: 'Přední' },
        { model_trim: 'M50i', model_engine_power_ps: '530', model_lkm_mixed: '11.7', model_lkm_hwy: '8.9', model_lkm_city: '15.4', model_engine_fuel: 'Benzín', model_engine_cc: '4395', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '750', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '4.3', model_top_speed_kph: '250', model_fuel_cap_l: '85', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2235', model_length_mm: '4922', model_width_mm: '2004', model_height_mm: '1745', model_wheelbase_mm: '2975', model_engine_position: 'Přední' },
    ],
    'mercedes-benz:C-Class': [
        { model_trim: 'C 200 AMG Line', model_engine_power_ps: '204', model_lkm_mixed: '6.6', model_lkm_hwy: '5.1', model_lkm_city: '8.7', model_engine_fuel: 'Benzín', model_engine_cc: '1496', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '300', model_engine_power_rpm: '5800', model_engine_compression: '10.5:1', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '7.3', model_top_speed_kph: '240', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1545', model_length_mm: '4751', model_width_mm: '1820', model_height_mm: '1438', model_wheelbase_mm: '2865', model_engine_position: 'Přední' },
        { model_trim: 'C 220 d', model_engine_power_ps: '200', model_lkm_mixed: '5.0', model_lkm_hwy: '4.0', model_lkm_city: '6.5', model_engine_fuel: 'Nafta', model_engine_cc: '1993', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '440', model_engine_power_rpm: '3800', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '7.3', model_top_speed_kph: '239', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1595', model_length_mm: '4751', model_width_mm: '1820', model_height_mm: '1438', model_wheelbase_mm: '2865', model_engine_position: 'Přední' },
        { model_trim: 'AMG C 43 4MATIC', model_engine_power_ps: '408', model_lkm_mixed: '8.5', model_lkm_hwy: '6.8', model_lkm_city: '11.0', model_engine_fuel: 'Benzín', model_engine_cc: '1999', model_engine_type: 'Řadový 4válec biturbo', model_engine_cyl: '4', model_engine_torque_nm: '500', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '4.6', model_top_speed_kph: '270', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1780', model_length_mm: '4751', model_width_mm: '1820', model_height_mm: '1438', model_wheelbase_mm: '2865', model_engine_position: 'Přední' },
        { model_trim: 'AMG C 63 S E Performance', model_engine_power_ps: '680', model_lkm_mixed: '6.7', model_lkm_hwy: '5.0', model_lkm_city: '9.5', model_engine_fuel: 'Plug-in hybrid', model_engine_cc: '1999', model_engine_type: 'Řadový 4válec + EM', model_engine_cyl: '4', model_engine_torque_nm: '1020', model_engine_power_rpm: '6750', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '3.4', model_top_speed_kph: '280', model_fuel_cap_l: '55', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2111', model_length_mm: '4751', model_width_mm: '1820', model_height_mm: '1438', model_wheelbase_mm: '2865', model_engine_position: 'Přední' },
    ],
    'mercedes-benz:S-Class': [
        { model_trim: 'S 500 4MATIC', model_engine_power_ps: '435', model_lkm_mixed: '9.0', model_lkm_hwy: '7.0', model_lkm_city: '11.8', model_engine_fuel: 'Benzín', model_engine_cc: '2999', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '520', model_engine_power_rpm: '6100', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '4.9', model_top_speed_kph: '250', model_fuel_cap_l: '90', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2155', model_length_mm: '5289', model_width_mm: '1954', model_height_mm: '1503', model_wheelbase_mm: '3216', model_engine_position: 'Přední' },
        { model_trim: 'S 580 4MATIC', model_engine_power_ps: '503', model_lkm_mixed: '10.2', model_lkm_hwy: '8.0', model_lkm_city: '13.2', model_engine_fuel: 'Benzín', model_engine_cc: '3982', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '700', model_engine_power_rpm: '5000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '4.4', model_top_speed_kph: '250', model_fuel_cap_l: '90', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2285', model_length_mm: '5289', model_width_mm: '1954', model_height_mm: '1503', model_wheelbase_mm: '3216', model_engine_position: 'Přední' },
        { model_trim: 'AMG S 63 E Performance', model_engine_power_ps: '802', model_lkm_mixed: '8.9', model_lkm_hwy: '7.0', model_lkm_city: '12.0', model_engine_fuel: 'Plug-in hybrid', model_engine_cc: '3982', model_engine_type: 'V8 + elektromotor', model_engine_cyl: '8', model_engine_torque_nm: '1430', model_engine_power_rpm: '5500', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '3.3', model_top_speed_kph: '290', model_fuel_cap_l: '65', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2510', model_length_mm: '5289', model_width_mm: '1954', model_height_mm: '1503', model_wheelbase_mm: '3216', model_engine_position: 'Přední' },
    ],
    'mercedes-benz:G-Class': [
        { model_trim: 'G 500', model_engine_power_ps: '422', model_lkm_mixed: '13.1', model_lkm_hwy: '10.5', model_lkm_city: '17.0', model_engine_fuel: 'Benzín', model_engine_cc: '3982', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '610', model_engine_power_rpm: '5000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '5.9', model_top_speed_kph: '210', model_fuel_cap_l: '100', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2485', model_length_mm: '4624', model_width_mm: '1931', model_height_mm: '1969', model_wheelbase_mm: '2890', model_engine_position: 'Přední' },
        { model_trim: 'AMG G 63', model_engine_power_ps: '585', model_lkm_mixed: '14.7', model_lkm_hwy: '11.5', model_lkm_city: '19.5', model_engine_fuel: 'Benzín', model_engine_cc: '3982', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '850', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '4.5', model_top_speed_kph: '220', model_fuel_cap_l: '100', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2560', model_length_mm: '4624', model_width_mm: '1931', model_height_mm: '1969', model_wheelbase_mm: '2890', model_engine_position: 'Přední' },
    ],
    'audi:A4': [
        { model_trim: '35 TDI S line', model_engine_power_ps: '150', model_lkm_mixed: '5.0', model_lkm_hwy: '4.1', model_lkm_city: '6.4', model_engine_fuel: 'Nafta', model_engine_cc: '1968', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '360', model_engine_power_rpm: '3800', model_drive: 'Přední pohon (FWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '8.9', model_top_speed_kph: '224', model_fuel_cap_l: '58', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1520', model_length_mm: '4762', model_width_mm: '1842', model_height_mm: '1427', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
        { model_trim: '40 TDI quattro S line', model_engine_power_ps: '204', model_lkm_mixed: '5.3', model_lkm_hwy: '4.3', model_lkm_city: '6.8', model_engine_fuel: 'Nafta', model_engine_cc: '1968', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '400', model_engine_power_rpm: '3850', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '7.1', model_top_speed_kph: '239', model_fuel_cap_l: '58', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1635', model_length_mm: '4762', model_width_mm: '1842', model_height_mm: '1427', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
        { model_trim: '45 TFSI quattro S line', model_engine_power_ps: '265', model_lkm_mixed: '7.5', model_lkm_hwy: '5.8', model_lkm_city: '9.8', model_engine_fuel: 'Benzín', model_engine_cc: '1984', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '370', model_engine_power_rpm: '5000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '5.6', model_top_speed_kph: '250', model_fuel_cap_l: '58', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1665', model_length_mm: '4762', model_width_mm: '1842', model_height_mm: '1427', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
    ],
    'audi:RS6': [
        { model_trim: 'Avant', model_engine_power_ps: '600', model_lkm_mixed: '11.7', model_lkm_hwy: '8.8', model_lkm_city: '15.5', model_engine_fuel: 'Benzín', model_engine_cc: '3996', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '800', model_engine_power_rpm: '6000', model_engine_compression: '10.5:1', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.6', model_top_speed_kph: '305', model_fuel_cap_l: '73', model_body: 'Kombi', model_seats: '5', model_doors: '5', model_weight_kg: '2075', model_length_mm: '4995', model_width_mm: '1951', model_height_mm: '1459', model_wheelbase_mm: '2924', model_engine_position: 'Přední' },
        { model_trim: 'Avant performance', model_engine_power_ps: '630', model_lkm_mixed: '12.0', model_lkm_hwy: '9.0', model_lkm_city: '15.8', model_engine_fuel: 'Benzín', model_engine_cc: '3996', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '850', model_engine_power_rpm: '6150', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.4', model_top_speed_kph: '305', model_fuel_cap_l: '73', model_body: 'Kombi', model_seats: '5', model_doors: '5', model_weight_kg: '2095', model_length_mm: '4995', model_width_mm: '1951', model_height_mm: '1459', model_wheelbase_mm: '2924', model_engine_position: 'Přední' },
    ],
    'audi:R8': [
        { model_trim: 'V10 performance', model_engine_power_ps: '620', model_lkm_mixed: '13.9', model_lkm_hwy: '10.8', model_lkm_city: '19.0', model_engine_fuel: 'Benzín', model_engine_cc: '5204', model_engine_type: 'V10 přirozeně sací', model_engine_cyl: '10', model_engine_torque_nm: '580', model_engine_power_rpm: '8250', model_engine_compression: '12.7:1', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. dvouspojkový', model_0_to_100_kph: '3.1', model_top_speed_kph: '331', model_fuel_cap_l: '83', model_body: 'Kupé', model_seats: '2', model_doors: '2', model_weight_kg: '1695', model_length_mm: '4426', model_width_mm: '1940', model_height_mm: '1239', model_wheelbase_mm: '2650', model_engine_position: 'Střední' },
        { model_trim: 'V10 Spyder', model_engine_power_ps: '570', model_lkm_mixed: '13.7', model_lkm_hwy: '10.5', model_lkm_city: '18.5', model_engine_fuel: 'Benzín', model_engine_cc: '5204', model_engine_type: 'V10 přirozeně sací', model_engine_cyl: '10', model_engine_torque_nm: '550', model_engine_power_rpm: '8000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. dvouspojkový', model_0_to_100_kph: '3.2', model_top_speed_kph: '323', model_fuel_cap_l: '83', model_body: 'Roadster', model_seats: '2', model_doors: '2', model_weight_kg: '1720', model_length_mm: '4426', model_width_mm: '1940', model_height_mm: '1248', model_wheelbase_mm: '2650', model_engine_position: 'Střední' },
    ],
    'audi:e-tron GT': [
        { model_trim: 'quattro', model_engine_power_ps: '476', model_lkm_mixed: '0', model_lkm_hwy: '0', model_lkm_city: '0', model_engine_fuel: 'Elektřina', model_engine_cc: '0', model_engine_type: 'Dual elektromotor', model_engine_cyl: '0', model_engine_torque_nm: '630', model_engine_power_rpm: '0', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '2-stupňová převodovka', model_0_to_100_kph: '4.1', model_top_speed_kph: '245', model_body: 'Fastback', model_seats: '4', model_doors: '4', model_weight_kg: '2347', model_length_mm: '4989', model_width_mm: '1964', model_height_mm: '1414', model_wheelbase_mm: '2900', model_engine_position: 'Přední+zadní' },
        { model_trim: 'RS e-tron GT', model_engine_power_ps: '598', model_lkm_mixed: '0', model_lkm_hwy: '0', model_lkm_city: '0', model_engine_fuel: 'Elektřina', model_engine_cc: '0', model_engine_type: 'Dual elektromotor', model_engine_cyl: '0', model_engine_torque_nm: '830', model_engine_power_rpm: '0', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '2-stupňová převodovka', model_0_to_100_kph: '3.3', model_top_speed_kph: '250', model_body: 'Fastback', model_seats: '4', model_doors: '4', model_weight_kg: '2383', model_length_mm: '4989', model_width_mm: '1964', model_height_mm: '1414', model_wheelbase_mm: '2900', model_engine_position: 'Přední+zadní' },
    ],
    'mercedes-benz:CLA': [
        { model_trim: 'CLA 200', model_engine_power_ps: '163', model_lkm_mixed: '6.3', model_lkm_hwy: '5.0', model_lkm_city: '8.2', model_engine_fuel: 'Benzín', model_engine_cc: '1332', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '250', model_engine_power_rpm: '5500', model_drive: 'Přední pohon (FWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '8.2', model_top_speed_kph: '232', model_fuel_cap_l: '50', model_body: 'Kupé', model_seats: '5', model_doors: '4', model_weight_kg: '1385', model_length_mm: '4688', model_width_mm: '1830', model_height_mm: '1433', model_wheelbase_mm: '2729', model_engine_position: 'Přední' },
        { model_trim: 'CLA 220 d', model_engine_power_ps: '190', model_lkm_mixed: '4.9', model_lkm_hwy: '3.9', model_lkm_city: '6.3', model_engine_fuel: 'Nafta', model_engine_cc: '1950', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '400', model_engine_power_rpm: '3800', model_drive: 'Přední pohon (FWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '7.3', model_top_speed_kph: '240', model_fuel_cap_l: '50', model_body: 'Kupé', model_seats: '5', model_doors: '4', model_weight_kg: '1450', model_length_mm: '4688', model_width_mm: '1830', model_height_mm: '1433', model_wheelbase_mm: '2729', model_engine_position: 'Přední' },
        { model_trim: 'AMG CLA 45 S', model_engine_power_ps: '421', model_lkm_mixed: '8.7', model_lkm_hwy: '7.0', model_lkm_city: '11.5', model_engine_fuel: 'Benzín', model_engine_cc: '1991', model_engine_type: 'Řadový 4válec biturbo', model_engine_cyl: '4', model_engine_torque_nm: '500', model_engine_power_rpm: '6750', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. DSG', model_0_to_100_kph: '4.0', model_top_speed_kph: '270', model_fuel_cap_l: '50', model_body: 'Kupé', model_seats: '5', model_doors: '4', model_weight_kg: '1600', model_length_mm: '4688', model_width_mm: '1830', model_height_mm: '1433', model_wheelbase_mm: '2729', model_engine_position: 'Přední' },
    ],
    'mercedes-benz:E-Class': [
        { model_trim: 'E 200', model_engine_power_ps: '197', model_lkm_mixed: '6.8', model_lkm_hwy: '5.3', model_lkm_city: '8.9', model_engine_fuel: 'Benzín', model_engine_cc: '1496', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '320', model_engine_power_rpm: '5800', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '7.7', model_top_speed_kph: '240', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1650', model_length_mm: '4923', model_width_mm: '1852', model_height_mm: '1468', model_wheelbase_mm: '2939', model_engine_position: 'Přední' },
        { model_trim: 'E 220 d', model_engine_power_ps: '200', model_lkm_mixed: '5.1', model_lkm_hwy: '4.1', model_lkm_city: '6.6', model_engine_fuel: 'Nafta', model_engine_cc: '1993', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '440', model_engine_power_rpm: '3800', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '7.3', model_top_speed_kph: '240', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1710', model_length_mm: '4923', model_width_mm: '1852', model_height_mm: '1468', model_wheelbase_mm: '2939', model_engine_position: 'Přední' },
        { model_trim: 'E 400 d 4MATIC', model_engine_power_ps: '330', model_lkm_mixed: '6.4', model_lkm_hwy: '5.2', model_lkm_city: '8.3', model_engine_fuel: 'Nafta', model_engine_cc: '2925', model_engine_type: 'Řadový 6válec', model_engine_cyl: '6', model_engine_torque_nm: '700', model_engine_power_rpm: '3200', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '5.3', model_top_speed_kph: '250', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1885', model_length_mm: '4923', model_width_mm: '1852', model_height_mm: '1468', model_wheelbase_mm: '2939', model_engine_position: 'Přední' },
        { model_trim: 'AMG E 53 4MATIC+', model_engine_power_ps: '435', model_lkm_mixed: '8.9', model_lkm_hwy: '7.1', model_lkm_city: '11.6', model_engine_fuel: 'Benzín', model_engine_cc: '2999', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '520', model_engine_power_rpm: '5800', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '4.5', model_top_speed_kph: '270', model_fuel_cap_l: '66', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1960', model_length_mm: '4923', model_width_mm: '1852', model_height_mm: '1468', model_wheelbase_mm: '2939', model_engine_position: 'Přední' },
    ],
    'mercedes-benz:GLE': [
        { model_trim: 'GLE 300 d 4MATIC', model_engine_power_ps: '245', model_lkm_mixed: '6.8', model_lkm_hwy: '5.5', model_lkm_city: '8.8', model_engine_fuel: 'Nafta', model_engine_cc: '1950', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '500', model_engine_power_rpm: '3600', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '7.3', model_top_speed_kph: '230', model_fuel_cap_l: '85', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2125', model_length_mm: '4924', model_width_mm: '2019', model_height_mm: '1796', model_wheelbase_mm: '2995', model_engine_position: 'Přední' },
        { model_trim: 'GLE 450 4MATIC', model_engine_power_ps: '367', model_lkm_mixed: '8.8', model_lkm_hwy: '7.0', model_lkm_city: '11.4', model_engine_fuel: 'Benzín', model_engine_cc: '2999', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '500', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '5.7', model_top_speed_kph: '250', model_fuel_cap_l: '85', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2205', model_length_mm: '4924', model_width_mm: '2019', model_height_mm: '1796', model_wheelbase_mm: '2995', model_engine_position: 'Přední' },
        { model_trim: 'AMG GLE 63 S 4MATIC+', model_engine_power_ps: '612', model_lkm_mixed: '13.1', model_lkm_hwy: '10.3', model_lkm_city: '17.3', model_engine_fuel: 'Benzín', model_engine_cc: '3982', model_engine_type: 'V8 biturbo', model_engine_cyl: '8', model_engine_torque_nm: '850', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '9-st. automat', model_0_to_100_kph: '4.2', model_top_speed_kph: '280', model_fuel_cap_l: '85', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2460', model_length_mm: '4924', model_width_mm: '2019', model_height_mm: '1796', model_wheelbase_mm: '2995', model_engine_position: 'Přední' },
    ],
    'mercedes-benz:A-Class': [
        { model_trim: 'A 180', model_engine_power_ps: '136', model_lkm_mixed: '6.0', model_lkm_hwy: '4.7', model_lkm_city: '7.8', model_engine_fuel: 'Benzín', model_engine_cc: '1332', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '200', model_engine_power_rpm: '5500', model_drive: 'Přední pohon (FWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '9.2', model_top_speed_kph: '216', model_fuel_cap_l: '43', model_body: 'Hatchback', model_seats: '5', model_doors: '5', model_weight_kg: '1350', model_length_mm: '4419', model_width_mm: '1796', model_height_mm: '1440', model_wheelbase_mm: '2729', model_engine_position: 'Přední' },
        { model_trim: 'A 200', model_engine_power_ps: '163', model_lkm_mixed: '6.3', model_lkm_hwy: '5.0', model_lkm_city: '8.2', model_engine_fuel: 'Benzín', model_engine_cc: '1332', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '250', model_engine_power_rpm: '5500', model_drive: 'Přední pohon (FWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '8.0', model_top_speed_kph: '232', model_fuel_cap_l: '43', model_body: 'Hatchback', model_seats: '5', model_doors: '5', model_weight_kg: '1380', model_length_mm: '4419', model_width_mm: '1796', model_height_mm: '1440', model_wheelbase_mm: '2729', model_engine_position: 'Přední' },
        { model_trim: 'AMG A 45 S 4MATIC+', model_engine_power_ps: '421', model_lkm_mixed: '8.7', model_lkm_hwy: '7.0', model_lkm_city: '11.5', model_engine_fuel: 'Benzín', model_engine_cc: '1991', model_engine_type: 'Řadový 4válec biturbo', model_engine_cyl: '4', model_engine_torque_nm: '500', model_engine_power_rpm: '6750', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. DSG', model_0_to_100_kph: '3.9', model_top_speed_kph: '270', model_fuel_cap_l: '43', model_body: 'Hatchback', model_seats: '5', model_doors: '5', model_weight_kg: '1620', model_length_mm: '4419', model_width_mm: '1796', model_height_mm: '1440', model_wheelbase_mm: '2729', model_engine_position: 'Přední' },
    ],
    'audi:A6': [
        { model_trim: '40 TDI S line', model_engine_power_ps: '204', model_lkm_mixed: '5.2', model_lkm_hwy: '4.2', model_lkm_city: '6.7', model_engine_fuel: 'Nafta', model_engine_cc: '1968', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '400', model_engine_power_rpm: '3850', model_drive: 'Přední pohon (FWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '8.0', model_top_speed_kph: '234', model_fuel_cap_l: '73', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1660', model_length_mm: '4939', model_width_mm: '1886', model_height_mm: '1457', model_wheelbase_mm: '2924', model_engine_position: 'Přední' },
        { model_trim: '55 TFSI quattro S line', model_engine_power_ps: '340', model_lkm_mixed: '8.5', model_lkm_hwy: '6.8', model_lkm_city: '11.0', model_engine_fuel: 'Benzín', model_engine_cc: '2995', model_engine_type: 'V6 biturbo', model_engine_cyl: '6', model_engine_torque_nm: '500', model_engine_power_rpm: '5000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '5.1', model_top_speed_kph: '250', model_fuel_cap_l: '73', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1850', model_length_mm: '4939', model_width_mm: '1886', model_height_mm: '1457', model_wheelbase_mm: '2924', model_engine_position: 'Přední' },
    ],
    'audi:Q5': [
        { model_trim: '35 TDI S line', model_engine_power_ps: '163', model_lkm_mixed: '5.8', model_lkm_hwy: '4.8', model_lkm_city: '7.4', model_engine_fuel: 'Nafta', model_engine_cc: '1968', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '370', model_engine_power_rpm: '3500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '8.9', model_top_speed_kph: '213', model_fuel_cap_l: '75', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '1800', model_length_mm: '4663', model_width_mm: '1893', model_height_mm: '1659', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
        { model_trim: '45 TFSI quattro S line', model_engine_power_ps: '265', model_lkm_mixed: '8.0', model_lkm_hwy: '6.4', model_lkm_city: '10.3', model_engine_fuel: 'Benzín', model_engine_cc: '1984', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '370', model_engine_power_rpm: '5000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '6.3', model_top_speed_kph: '237', model_fuel_cap_l: '75', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '1880', model_length_mm: '4663', model_width_mm: '1893', model_height_mm: '1659', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
        { model_trim: 'SQ5 TDI', model_engine_power_ps: '341', model_lkm_mixed: '7.3', model_lkm_hwy: '6.0', model_lkm_city: '9.4', model_engine_fuel: 'Nafta', model_engine_cc: '2967', model_engine_type: 'V6', model_engine_cyl: '6', model_engine_torque_nm: '700', model_engine_power_rpm: '2500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '5.1', model_top_speed_kph: '250', model_fuel_cap_l: '75', model_body: 'SUV', model_seats: '5', model_doors: '5', model_weight_kg: '2010', model_length_mm: '4663', model_width_mm: '1893', model_height_mm: '1659', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
    ],
    'bmw:7 Series': [
        { model_trim: '740d xDrive', model_engine_power_ps: '340', model_lkm_mixed: '6.6', model_lkm_hwy: '5.4', model_lkm_city: '8.5', model_engine_fuel: 'Nafta', model_engine_cc: '2993', model_engine_type: 'Řadový 6válec', model_engine_cyl: '6', model_engine_torque_nm: '700', model_engine_power_rpm: '4000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '5.6', model_top_speed_kph: '250', model_fuel_cap_l: '78', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2055', model_length_mm: '5391', model_width_mm: '1950', model_height_mm: '1544', model_wheelbase_mm: '3215', model_engine_position: 'Přední' },
        { model_trim: '750e xDrive Plug-in Hybrid', model_engine_power_ps: '490', model_lkm_mixed: '2.5', model_lkm_hwy: '1.8', model_lkm_city: '3.5', model_engine_fuel: 'Plug-in hybrid', model_engine_cc: '2998', model_engine_type: 'Řadový 6válec + EM', model_engine_cyl: '6', model_engine_torque_nm: '700', model_engine_power_rpm: '5200', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '4.9', model_top_speed_kph: '250', model_fuel_cap_l: '69', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2315', model_length_mm: '5391', model_width_mm: '1950', model_height_mm: '1544', model_wheelbase_mm: '3215', model_engine_position: 'Přední' },
        { model_trim: 'M760e xDrive', model_engine_power_ps: '571', model_lkm_mixed: '3.3', model_lkm_hwy: '2.5', model_lkm_city: '4.5', model_engine_fuel: 'Plug-in hybrid', model_engine_cc: '2998', model_engine_type: 'V8 + elektromotor', model_engine_cyl: '8', model_engine_torque_nm: '800', model_engine_power_rpm: '5200', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '4.3', model_top_speed_kph: '250', model_fuel_cap_l: '69', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '2465', model_length_mm: '5391', model_width_mm: '1950', model_height_mm: '1544', model_wheelbase_mm: '3215', model_engine_position: 'Přední' },
    ],
    'bmw:Z4': [
        { model_trim: 'sDrive20i', model_engine_power_ps: '197', model_lkm_mixed: '7.1', model_lkm_hwy: '5.7', model_lkm_city: '9.2', model_engine_fuel: 'Benzín', model_engine_cc: '1998', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '320', model_engine_power_rpm: '5000', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '6.6', model_top_speed_kph: '240', model_fuel_cap_l: '52', model_body: 'Roadster', model_seats: '2', model_doors: '2', model_weight_kg: '1485', model_length_mm: '4324', model_width_mm: '1864', model_height_mm: '1304', model_wheelbase_mm: '2470', model_engine_position: 'Přední' },
        { model_trim: 'M40i', model_engine_power_ps: '340', model_lkm_mixed: '8.4', model_lkm_hwy: '6.7', model_lkm_city: '10.9', model_engine_fuel: 'Benzín', model_engine_cc: '2998', model_engine_type: 'Řadový 6válec', model_engine_cyl: '6', model_engine_torque_nm: '500', model_engine_power_rpm: '5500', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '4.5', model_top_speed_kph: '250', model_fuel_cap_l: '52', model_body: 'Roadster', model_seats: '2', model_doors: '2', model_weight_kg: '1570', model_length_mm: '4324', model_width_mm: '1864', model_height_mm: '1304', model_wheelbase_mm: '2470', model_engine_position: 'Přední' },
    ],
    'bmw:i4': [
        { model_trim: 'eDrive40', model_engine_power_ps: '340', model_lkm_mixed: '0', model_lkm_hwy: '0', model_lkm_city: '0', model_engine_fuel: 'Elektřina', model_engine_cc: '0', model_engine_type: 'Elektromotor', model_engine_cyl: '0', model_engine_torque_nm: '430', model_engine_power_rpm: '0', model_drive: 'Zadní pohon (RWD)', model_transmission_type: '1-stupňová', model_0_to_100_kph: '5.7', model_top_speed_kph: '190', model_body: 'Gran Coupé', model_seats: '5', model_doors: '4', model_weight_kg: '2215', model_length_mm: '4783', model_width_mm: '1852', model_height_mm: '1448', model_wheelbase_mm: '2856', model_engine_position: 'Zadní' },
        { model_trim: 'M50 xDrive', model_engine_power_ps: '544', model_lkm_mixed: '0', model_lkm_hwy: '0', model_lkm_city: '0', model_engine_fuel: 'Elektřina', model_engine_cc: '0', model_engine_type: 'Dual elektromotor', model_engine_cyl: '0', model_engine_torque_nm: '795', model_engine_power_rpm: '0', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '1-stupňová', model_0_to_100_kph: '3.9', model_top_speed_kph: '225', model_body: 'Gran Coupé', model_seats: '5', model_doors: '4', model_weight_kg: '2355', model_length_mm: '4783', model_width_mm: '1852', model_height_mm: '1448', model_wheelbase_mm: '2856', model_engine_position: 'Přední+zadní' },
    ],
    'audi:RS3': [
        { model_trim: 'Sportback', model_engine_power_ps: '400', model_lkm_mixed: '9.9', model_lkm_hwy: '7.9', model_lkm_city: '13.2', model_engine_fuel: 'Benzín', model_engine_cc: '2480', model_engine_type: 'Řadový 5válec', model_engine_cyl: '5', model_engine_torque_nm: '500', model_engine_power_rpm: '5600', model_engine_compression: '9.6:1', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '3.8', model_top_speed_kph: '290', model_fuel_cap_l: '55', model_body: 'Hatchback', model_seats: '5', model_doors: '5', model_weight_kg: '1570', model_length_mm: '4318', model_width_mm: '1815', model_height_mm: '1421', model_wheelbase_mm: '2636', model_engine_position: 'Přední' },
        { model_trim: 'Sedan', model_engine_power_ps: '400', model_lkm_mixed: '9.9', model_lkm_hwy: '7.9', model_lkm_city: '13.2', model_engine_fuel: 'Benzín', model_engine_cc: '2480', model_engine_type: 'Řadový 5válec', model_engine_cyl: '5', model_engine_torque_nm: '500', model_engine_power_rpm: '5600', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '3.8', model_top_speed_kph: '290', model_fuel_cap_l: '55', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1565', model_length_mm: '4506', model_width_mm: '1815', model_height_mm: '1412', model_wheelbase_mm: '2636', model_engine_position: 'Přední' },
    ],
    'audi:RS4': [
        { model_trim: 'Avant', model_engine_power_ps: '450', model_lkm_mixed: '9.9', model_lkm_hwy: '8.0', model_lkm_city: '13.0', model_engine_fuel: 'Benzín', model_engine_cc: '2894', model_engine_type: 'V6 biturbo', model_engine_cyl: '6', model_engine_torque_nm: '600', model_engine_power_rpm: '5000', model_engine_compression: '10.5:1', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '4.1', model_top_speed_kph: '280', model_fuel_cap_l: '73', model_body: 'Kombi', model_seats: '5', model_doors: '5', model_weight_kg: '1740', model_length_mm: '4783', model_width_mm: '1865', model_height_mm: '1444', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
        { model_trim: 'Avant competition plus', model_engine_power_ps: '530', model_lkm_mixed: '10.2', model_lkm_hwy: '8.2', model_lkm_city: '13.5', model_engine_fuel: 'Benzín', model_engine_cc: '2894', model_engine_type: 'V6 biturbo', model_engine_cyl: '6', model_engine_torque_nm: '600', model_engine_power_rpm: '5500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '3.9', model_top_speed_kph: '290', model_fuel_cap_l: '73', model_body: 'Kombi', model_seats: '5', model_doors: '5', model_weight_kg: '1775', model_length_mm: '4783', model_width_mm: '1865', model_height_mm: '1444', model_wheelbase_mm: '2820', model_engine_position: 'Přední' },
    ],
    'audi:TT': [
        { model_trim: 'TTS Coupé', model_engine_power_ps: '320', model_lkm_mixed: '7.9', model_lkm_hwy: '6.4', model_lkm_city: '10.3', model_engine_fuel: 'Benzín', model_engine_cc: '1984', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '400', model_engine_power_rpm: '5400', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '4.9', model_top_speed_kph: '250', model_fuel_cap_l: '55', model_body: 'Kupé', model_seats: '4', model_doors: '3', model_weight_kg: '1420', model_length_mm: '4180', model_width_mm: '1832', model_height_mm: '1352', model_wheelbase_mm: '2505', model_engine_position: 'Přední' },
        { model_trim: 'TT RS Coupé', model_engine_power_ps: '400', model_lkm_mixed: '9.4', model_lkm_hwy: '7.5', model_lkm_city: '12.5', model_engine_fuel: 'Benzín', model_engine_cc: '2480', model_engine_type: 'Řadový 5válec', model_engine_cyl: '5', model_engine_torque_nm: '480', model_engine_power_rpm: '5850', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '7-st. DSG', model_0_to_100_kph: '3.7', model_top_speed_kph: '280', model_fuel_cap_l: '55', model_body: 'Kupé', model_seats: '4', model_doors: '3', model_weight_kg: '1500', model_length_mm: '4180', model_width_mm: '1832', model_height_mm: '1352', model_wheelbase_mm: '2505', model_engine_position: 'Přední' },
    ],

}

function buildGenericSpecs(modelName: string): FullSpec[] {
    const isPerf = /^(M[2-9]|RS|AMG|R8)/i.test(modelName)
    if (isPerf) return [{ model_trim: 'Base', model_engine_power_ps: '450', model_lkm_mixed: '10.0', model_lkm_hwy: '8.0', model_lkm_city: '13.0', model_engine_fuel: 'Benzín', model_engine_cc: '2993', model_engine_type: 'Řadový 6válec biturbo', model_engine_cyl: '6', model_engine_torque_nm: '600', model_engine_power_rpm: '6000', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '4.2', model_top_speed_kph: '280', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1750' }]
    return [
        { model_trim: '2.0 TDI', model_engine_power_ps: '150', model_lkm_mixed: '5.2', model_lkm_hwy: '4.2', model_lkm_city: '6.8', model_engine_fuel: 'Nafta', model_engine_cc: '1968', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '360', model_engine_power_rpm: '3800', model_drive: 'Přední pohon (FWD)', model_transmission_type: '7-st. automat', model_0_to_100_kph: '8.5', model_top_speed_kph: '220', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1550' },
        { model_trim: '2.0 TFSI', model_engine_power_ps: '190', model_lkm_mixed: '6.8', model_lkm_hwy: '5.4', model_lkm_city: '8.8', model_engine_fuel: 'Benzín', model_engine_cc: '1984', model_engine_type: 'Řadový 4válec', model_engine_cyl: '4', model_engine_torque_nm: '320', model_engine_power_rpm: '4500', model_drive: 'Přední pohon (FWD)', model_transmission_type: '7-st. automat', model_0_to_100_kph: '7.2', model_top_speed_kph: '235', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1570' },
        { model_trim: '3.0 TDI quattro', model_engine_power_ps: '231', model_lkm_mixed: '6.0', model_lkm_hwy: '5.0', model_lkm_city: '7.5', model_engine_fuel: 'Nafta', model_engine_cc: '2967', model_engine_type: 'V6', model_engine_cyl: '6', model_engine_torque_nm: '500', model_engine_power_rpm: '3500', model_drive: 'Pohon všech kol (AWD)', model_transmission_type: '8-st. automat', model_0_to_100_kph: '6.2', model_top_speed_kph: '250', model_body: 'Sedan', model_seats: '5', model_doors: '4', model_weight_kg: '1680' },
    ]
}

export function getStaticTrims(makeId: string, modelName: string, year: number): CarTrim[] {
    const key = `${makeId}:${modelName}`
    const specs = FULL_SPECS[key] ?? buildGenericSpecs(modelName)
    return specs.map((spec, i) => ({
        model_id: `static_${makeId}_${modelName}_${year}_${i}`.replace(/\s/g, '_'),
        model_make_id: makeId,
        model_name: modelName,
        model_trim: spec.model_trim,
        model_year: String(year),
        model_body: spec.model_body,
        model_engine_fuel: spec.model_engine_fuel,
        model_engine_cc: spec.model_engine_cc,
        model_engine_power_ps: spec.model_engine_power_ps,
        model_lkm_mixed: spec.model_lkm_mixed,
        model_lkm_hwy: spec.model_lkm_hwy,
    }))
}

export function getStaticVehicle(makeId: string, modelName: string, year: number, index: number): CarVehicle | null {
    const key = `${makeId}:${modelName}`
    const specs = FULL_SPECS[key] ?? buildGenericSpecs(modelName)
    const spec = specs[index] ?? specs[0]
    if (!spec) return null
    const makeDisplay = makeId === 'mercedes-benz' ? 'Mercedes-Benz' : makeId === 'bmw' ? 'BMW' : 'Audi'
    return {
        model_id: `static_${makeId}_${modelName}_${year}_${index}`.replace(/\s/g, '_'),
        model_make_id: makeId,
        model_make_display: makeDisplay,
        model_name: modelName,
        model_year: String(year),
        ...spec,
    }
}