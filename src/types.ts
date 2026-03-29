export type Theme = 'light' | 'dark';

export interface SavedCar {
    id: string;
    makeDisplay: string;
    makeId: string;
    modelName: string;
    modelId: string;
    modelYear: string;
    trimName?: string;
    year?: number;
    image?: string;
    addedAt?: number;
    powerKw?: number;
    powerPs?: number;
    topSpeedKph?: number;
    acceleration?: number;
    consumptionL100km?: number;
    engineCc?: number;
}

export interface CarMake {
    make_id: string;       // Povinné pro API
    make_display: string;  // Povinné pro API
    make_is_common?: string;
    make_country?: string;
}

export interface CarModel {
    model_make_id: string;
    model_name: string;    // Povinné pro API
}

export interface CarTrim {
    model_id: string;
    model_make_id: string;
    model_name: string;
    model_trim: string;
    model_year: string;
    model_body?: string;
    model_engine_fuel?: string;
    model_engine_cc?: string;
    model_engine_power_ps?: string;
    model_lkm_mixed?: string;
    model_lkm_hwy?: string;
}

export interface CarYears {
    min_year: string;
    max_year: string;
}

export interface CarVehicle {
    model_id: string;
    model_make_id: string;
    model_make_display: string;
    model_name: string;
    model_trim: string;
    model_year: string;
    model_engine_power_ps: string;
    model_lkm_mixed: string;
    model_lkm_hwy: string;
    model_lkm_city: string;
    model_engine_fuel?: string;
    model_engine_cc?: string;
    model_top_speed_kph?: string;
    model_0_to_100_kph?: string;
    model_engine_type?: string;
    model_engine_cyl?: string;
    model_engine_torque_nm?: string;
    model_engine_power_rpm?: string;
    model_engine_compression?: string;
    model_drive?: string;
    model_transmission_type?: string;
    model_fuel_cap_l?: string;
    model_co2?: string;
    model_length_mm?: string;
    model_width_mm?: string;
    model_height_mm?: string;
    model_wheelbase_mm?: string;
    model_weight_kg?: string;
    model_seats?: string;
    model_doors?: string;
    model_engine_position?: string;
    model_body?: string;
    model_engine_valves_per_cyl?: string;
    model_engine_bore_mm?: string;
    model_engine_stroke_mm?: string;
}