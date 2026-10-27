/**
 * Location Service for val-qur'an
 * Manages GPS coordinate retrieval, city presets, and local persistence.
 */

import { UserCoordinates } from '../types/worship';

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206
} as const;

export interface CityPreset {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // UTC offset in hours, e.g. 7 for WIB, 8 for WITA, 9 for WIT
  timezoneName: string; // 'WIB' | 'WITA' | 'WIT' | 'AST'
}

export const CITY_PRESETS: CityPreset[] = [
  // Wilayah Banten (Prioritas Wilayah Awal)
  { id: 'btn_srg_kab', name: 'Kabupaten Serang', province: 'Banten', latitude: -6.1156, longitude: 106.1542, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btn_srg_kot', name: 'Kota Serang', province: 'Banten', latitude: -6.1104, longitude: 106.1640, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btn_clg', name: 'Kota Cilegon', province: 'Banten', latitude: -6.0174, longitude: 106.0538, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btn_tgr_kot', name: 'Kota Tangerang', province: 'Banten', latitude: -6.1783, longitude: 106.6319, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btn_tgr_kab', name: 'Kabupaten Tangerang', province: 'Banten', latitude: -6.1950, longitude: 106.4900, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btn_tsel', name: 'Kota Tangerang Selatan', province: 'Banten', latitude: -6.2888, longitude: 106.7179, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btn_pdg', name: 'Kabupaten Pandeglang', province: 'Banten', latitude: -6.3084, longitude: 106.1066, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btn_lbk', name: 'Kabupaten Lebak', province: 'Banten', latitude: -6.5500, longitude: 106.2500, timezoneOffset: 7, timezoneName: 'WIB' },

  // Kota-kota Besar Indonesia Lainnya
  { id: 'jkt', name: 'Jakarta', province: 'DKI Jakarta', latitude: -6.2088, longitude: 106.8456, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'bdg', name: 'Bandung', province: 'Jawa Barat', latitude: -6.9175, longitude: 107.6191, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'sby', name: 'Surabaya', province: 'Jawa Timur', latitude: -7.2575, longitude: 112.7521, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'smg', name: 'Semarang', province: 'Jawa Tengah', latitude: -6.9667, longitude: 110.4167, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'yog', name: 'Yogyakarta', province: 'DI Yogyakarta', latitude: -7.7956, longitude: 110.3695, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'mdn', name: 'Medan', province: 'Sumatera Utara', latitude: 3.5952, longitude: 98.6722, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'pdg_sumbar', name: 'Padang', province: 'Sumatera Barat', latitude: -0.9471, longitude: 100.4172, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'plb', name: 'Palembang', province: 'Sumatera Selatan', latitude: -2.9761, longitude: 104.7754, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'btm', name: 'Batam', province: 'Kepulauan Riau', latitude: 1.1293, longitude: 104.053, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'ach', name: 'Banda Aceh', province: 'Aceh', latitude: 5.5483, longitude: 95.3238, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'mks', name: 'Makassar', province: 'Sulawesi Selatan', latitude: -5.1477, longitude: 119.4327, timezoneOffset: 8, timezoneName: 'WITA' },
  { id: 'dps', name: 'Denpasar', province: 'Bali', latitude: -8.6705, longitude: 115.2126, timezoneOffset: 8, timezoneName: 'WITA' },
  { id: 'mtr', name: 'Mataram (Lombok)', province: 'NTB', latitude: -8.5833, longitude: 116.1167, timezoneOffset: 8, timezoneName: 'WITA' },
  { id: 'bjm', name: 'Banjarmasin', province: 'Kalimantan Selatan', latitude: -3.3167, longitude: 114.5900, timezoneOffset: 8, timezoneName: 'WITA' },
  { id: 'smd', name: 'Samarinda', province: 'Kalimantan Timur', latitude: -0.5022, longitude: 117.1536, timezoneOffset: 8, timezoneName: 'WITA' },
  { id: 'ptk', name: 'Pontianak', province: 'Kalimantan Barat', latitude: -0.0263, longitude: 109.3425, timezoneOffset: 7, timezoneName: 'WIB' },
  { id: 'mnd', name: 'Manado', province: 'Sulawesi Utara', latitude: 1.4748, longitude: 124.8428, timezoneOffset: 8, timezoneName: 'WITA' },
  { id: 'amb', name: 'Ambon', province: 'Maluku', latitude: -3.6554, longitude: 128.1908, timezoneOffset: 9, timezoneName: 'WIT' },
  { id: 'jyp', name: 'Jayapura', province: 'Papua', latitude: -2.5916, longitude: 140.6690, timezoneOffset: 9, timezoneName: 'WIT' },
  { id: 'mkh', name: 'Makkah Al-Mukarramah', province: 'Arab Saudi', latitude: 21.4225, longitude: 39.8262, timezoneOffset: 3, timezoneName: 'AST' },
  { id: 'mdh', name: 'Madinah Al-Munawwarah', province: 'Arab Saudi', latitude: 24.5247, longitude: 39.5692, timezoneOffset: 3, timezoneName: 'AST' }
];

export const DEFAULT_COORDINATES: UserCoordinates = {
  latitude: -6.1156,
  longitude: 106.1542,
  cityName: 'Kabupaten Serang, Banten (Default)',
  source: 'preset'
};

const STORAGE_KEY = 'val_quran_user_location_v1';

export const locationService = {
  getSavedLocation(): UserCoordinates {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }
    return DEFAULT_COORDINATES;
  },

  saveLocation(coords: UserCoordinates): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
    } catch {
      // Ignore
    }
  },

  async getCurrentGpsLocation(): Promise<UserCoordinates> {
    if (!('geolocation' in navigator)) {
      throw new Error('Fitur Geolocation tidak didukung oleh browser Anda.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: UserCoordinates = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            cityName: 'Lokasi Perangkat (GPS)',
            source: 'gps'
          };
          this.saveLocation(coords);
          resolve(coords);
        },
        (error) => {
          let msg = 'Gagal mendeteksi lokasi GPS.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Izin akses lokasi ditolak oleh pengguna atau sistem.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Informasi lokasi perangkat saat ini tidak tersedia.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Waktu permintaan lokasi GPS habis (timeout).';
          }
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  },

  selectPresetCity(presetId: string): UserCoordinates {
    const city = CITY_PRESETS.find((c) => c.id === presetId) || CITY_PRESETS[0];
    const coords: UserCoordinates = {
      latitude: city.latitude,
      longitude: city.longitude,
      cityName: `${city.name}, ${city.province}`,
      source: 'preset'
    };
    this.saveLocation(coords);
    return coords;
  }
};
