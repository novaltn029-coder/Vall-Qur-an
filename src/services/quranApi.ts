/**
 * Quran API Service for equran.id v2
 * Integrates official endpoints:
 * - /surat: Get all 114 surahs
 * - /surat/{nomor}: Get surah detail with all ayat and audio
 * - /tafsir/{nomor}: Get authentic Kemenag RI tafsir per ayah
 */

import { APP_CONFIG } from '../config/app.config';
import { SurahSummary, SurahDetail, SurahTafsir } from '../types/quran';

const API_BASE = APP_CONFIG.apiBaseUrl;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_RETRIES = 2;

// In-memory cache for fast page transitions
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// Storage cache key helpers
const SURAH_LIST_STORAGE_KEY = 'val_quran_cache_surah_list_v2';
const SURAH_DETAIL_PREFIX = 'val_quran_cache_surah_v2_';
const TAFSIR_DETAIL_PREFIX = 'val_quran_cache_tafsir_v2_';

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Combine caller signal if provided
  let signal = controller.signal;
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        await new Promise((res) => setTimeout(res, 800));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new Error(`HTTP ${response.status}: Gagal memuat data dari server Al-Qur'an.`);
    }

    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      if (options.signal?.aborted) {
        throw new Error('Permintaan dibatalkan pengguna.');
      }
      if (retries > 0) {
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new Error('Koneksi waktu habis (timeout). Silakan periksa jaringan internet Anda.');
    }

    if (retries > 0 && !(error instanceof DOMException && error.name === 'AbortError')) {
      await new Promise((res) => setTimeout(res, 800));
      return fetchWithRetry(url, options, retries - 1);
    }

    throw error instanceof Error
      ? error
      : new Error('Terjadi kesalahan jaringan saat menghubungi server Al-Qur\'an.');
  }
}

export const quranApi = {
  /**
   * Fetch all 114 surahs summary
   */
  async getAllSurahs(signal?: AbortSignal): Promise<SurahSummary[]> {
    const cacheKey = 'surah_list';
    const cachedMem = memoryCache.get(cacheKey);
    if (cachedMem && Date.now() - cachedMem.timestamp < CACHE_TTL_MS) {
      return cachedMem.data as SurahSummary[];
    }

    // Check localStorage cache
    try {
      const stored = localStorage.getItem(SURAH_LIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 114) {
          memoryCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
          // Background refresh if online
          if (navigator.onLine) {
            this.refreshSurahsInBackground();
          }
          return parsed;
        }
      }
    } catch {
      // Ignore storage read error
    }

    try {
      const response = await fetchWithRetry(`${API_BASE}/surat`, { signal });
      const json = await response.json();

      if (json.code !== 200 || !Array.isArray(json.data)) {
        throw new Error(json.message || 'Format data surat tidak valid.');
      }

      const surahs: SurahSummary[] = json.data;
      memoryCache.set(cacheKey, { data: surahs, timestamp: Date.now() });

      try {
        localStorage.setItem(SURAH_LIST_STORAGE_KEY, JSON.stringify(surahs));
      } catch {
        // Storage quota full or unavailable
      }

      return surahs;
    } catch (err) {
      // Fallback to cached version if offline
      try {
        const stored = localStorage.getItem(SURAH_LIST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignore
      }
      throw err;
    }
  },

  async refreshSurahsInBackground(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/surat`);
      if (response.ok) {
        const json = await response.json();
        if (json.code === 200 && Array.isArray(json.data)) {
          localStorage.setItem(SURAH_LIST_STORAGE_KEY, JSON.stringify(json.data));
          memoryCache.set('surah_list', { data: json.data, timestamp: Date.now() });
        }
      }
    } catch {
      // Silent background catch
    }
  },

  /**
   * Fetch complete Surah detail including all Ayat and Audio mappings
   */
  async getSurahDetail(surahNumber: number, signal?: AbortSignal): Promise<SurahDetail> {
    if (surahNumber < 1 || surahNumber > 114) {
      throw new Error(`Nomor surat ${surahNumber} tidak valid (harus 1 - 114).`);
    }

    const cacheKey = `surah_${surahNumber}`;
    const cachedMem = memoryCache.get(cacheKey);
    if (cachedMem && Date.now() - cachedMem.timestamp < CACHE_TTL_MS) {
      return cachedMem.data as SurahDetail;
    }

    // Check localStorage
    const storageKey = `${SURAH_DETAIL_PREFIX}${surahNumber}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SurahDetail;
        if (parsed && parsed.nomor === surahNumber && Array.isArray(parsed.ayat)) {
          memoryCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
          return parsed;
        }
      }
    } catch {
      // Ignore
    }

    try {
      const response = await fetchWithRetry(`${API_BASE}/surat/${surahNumber}`, { signal });
      const json = await response.json();

      if (json.code !== 200 || !json.data || !Array.isArray(json.data.ayat)) {
        throw new Error(json.message || `Gagal memuat data surat ${surahNumber}.`);
      }

      const detail: SurahDetail = json.data;
      memoryCache.set(cacheKey, { data: detail, timestamp: Date.now() });

      try {
        localStorage.setItem(storageKey, JSON.stringify(detail));
      } catch {
        // Handle storage quota limit smoothly
      }

      return detail;
    } catch (err) {
      // Try local fallback
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as SurahDetail;
          if (parsed && parsed.nomor === surahNumber && Array.isArray(parsed.ayat)) {
            return parsed;
          }
        }
      } catch {
        // Ignore
      }
      throw err;
    }
  },

  /**
   * Fetch authentic Kemenag RI Tafsir for Surah
   */
  async getSurahTafsir(surahNumber: number, signal?: AbortSignal): Promise<SurahTafsir> {
    if (surahNumber < 1 || surahNumber > 114) {
      throw new Error(`Nomor surat ${surahNumber} tidak valid.`);
    }

    const cacheKey = `tafsir_${surahNumber}`;
    const cachedMem = memoryCache.get(cacheKey);
    if (cachedMem && Date.now() - cachedMem.timestamp < CACHE_TTL_MS) {
      return cachedMem.data as SurahTafsir;
    }

    const storageKey = `${TAFSIR_DETAIL_PREFIX}${surahNumber}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SurahTafsir;
        if (parsed && parsed.nomor === surahNumber && Array.isArray(parsed.tafsir)) {
          memoryCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
          return parsed;
        }
      }
    } catch {
      // Ignore
    }

    try {
      const response = await fetchWithRetry(`${API_BASE}/tafsir/${surahNumber}`, { signal });
      const json = await response.json();

      if (json.code !== 200 || !json.data || !Array.isArray(json.data.tafsir)) {
        throw new Error(json.message || `Gagal memuat tafsir surat ${surahNumber}.`);
      }

      const tafsirData: SurahTafsir = json.data;
      memoryCache.set(cacheKey, { data: tafsirData, timestamp: Date.now() });

      try {
        localStorage.setItem(storageKey, JSON.stringify(tafsirData));
      } catch {
        // Storage limit
      }

      return tafsirData;
    } catch (err) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as SurahTafsir;
          if (parsed && parsed.nomor === surahNumber && Array.isArray(parsed.tafsir)) {
            return parsed;
          }
        }
      } catch {
        // Ignore
      }
      throw err;
    }
  }
};
