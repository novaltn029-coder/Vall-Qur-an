/**
 * Global Quran Search Service
 * Supports:
 * - Surah search (by Latin name, Arabic name, translation/meaning, surah number)
 * - Ayah reference search (e.g., "2:255", "18:10", "36:1")
 * - Word & phrase search across Indonesian translations
 * - Transparent index coverage status
 */

import { quranApi } from './quranApi';
import { SurahSummary, SurahDetail } from '../types/quran';

export interface SearchResultItem {
  type: 'surah' | 'ayah';
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  ayahNumber?: number;
  arabicSnippet?: string;
  translationSnippet?: string;
  matchReason: string;
}

export interface SearchState {
  query: string;
  results: SearchResultItem[];
  isLoading: boolean;
  totalIndexedSurahs: number;
  totalAvailableSurahs: number;
}

export const searchService = {
  /**
   * Parse reference pattern like "2:255" or "Surat 2 Ayat 255"
   */
  parseReference(query: string): { surah: number; ayah?: number } | null {
    const trimmed = query.trim();

    // Pattern: "2:255" or "2 : 255"
    const colonMatch = trimmed.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
    if (colonMatch) {
      const s = parseInt(colonMatch[1], 10);
      const a = parseInt(colonMatch[2], 10);
      if (s >= 1 && s <= 114) {
        return { surah: s, ayah: a };
      }
    }

    // Pattern: just a single number "1" - "114"
    const singleNumberMatch = trimmed.match(/^(\d{1,3})$/);
    if (singleNumberMatch) {
      const s = parseInt(singleNumberMatch[1], 10);
      if (s >= 1 && s <= 114) {
        return { surah: s };
      }
    }

    return null;
  },

  /**
   * Perform comprehensive search
   */
  async search(
    query: string,
    surahList: SurahSummary[],
    signal?: AbortSignal
  ): Promise<SearchResultItem[]> {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const results: SearchResultItem[] = [];

    // 1. Check for reference syntax (e.g. 2:255)
    const ref = this.parseReference(query);
    if (ref) {
      const targetSurah = surahList.find((s) => s.nomor === ref.surah);
      if (targetSurah) {
        if (ref.ayah) {
          // Validate ayah number within surah limits
          if (ref.ayah <= targetSurah.jumlahAyat) {
            try {
              const detail = await quranApi.getSurahDetail(ref.surah, signal);
              const ayahData = detail.ayat.find((a) => a.nomorAyat === ref.ayah);
              if (ayahData) {
                results.push({
                  type: 'ayah',
                  surahNumber: targetSurah.nomor,
                  surahNameLatin: targetSurah.namaLatin,
                  surahNameArabic: targetSurah.nama,
                  ayahNumber: ref.ayah,
                  arabicSnippet: ayahData.teksArab,
                  translationSnippet: ayahData.teksIndonesia,
                  matchReason: `Referensi Surat ${targetSurah.namaLatin} Ayat ${ref.ayah}`
                });
              }
            } catch {
              results.push({
                type: 'ayah',
                surahNumber: targetSurah.nomor,
                surahNameLatin: targetSurah.namaLatin,
                surahNameArabic: targetSurah.nama,
                ayahNumber: ref.ayah,
                matchReason: `Referensi Surat ${targetSurah.namaLatin} Ayat ${ref.ayah}`
              });
            }
          }
        } else {
          // Just surah match by number
          results.push({
            type: 'surah',
            surahNumber: targetSurah.nomor,
            surahNameLatin: targetSurah.namaLatin,
            surahNameArabic: targetSurah.nama,
            matchReason: `Surat ke-${targetSurah.nomor} (${targetSurah.arti})`
          });
        }
      }
    }

    // 2. Surah name & translation match
    surahList.forEach((surah) => {
      const matchNameLatin = surah.namaLatin.toLowerCase().includes(normalizedQuery);
      const matchArti = surah.arti.toLowerCase().includes(normalizedQuery);
      const matchArabic = surah.nama.includes(query.trim());

      if (matchNameLatin || matchArti || matchArabic) {
        // avoid duplicate if already added by reference
        if (!results.some((r) => r.type === 'surah' && r.surahNumber === surah.nomor)) {
          results.push({
            type: 'surah',
            surahNumber: surah.nomor,
            surahNameLatin: surah.namaLatin,
            surahNameArabic: surah.nama,
            matchReason: matchNameLatin
              ? `Nama Surat: ${surah.namaLatin}`
              : matchArti
              ? `Arti Surat: "${surah.arti}"`
              : `Nama Arab: ${surah.nama}`
          });
        }
      }
    });

    // 3. Search across cached surah details in localStorage or loaded
    // This provides instant ayah-level keyword search for cached content without slamming the API
    try {
      for (let i = 1; i <= 114; i++) {
        if (signal?.aborted) break;
        const cachedStr = localStorage.getItem(`val_quran_cache_surah_v2_${i}`);
        if (cachedStr) {
          const detail = JSON.parse(cachedStr) as SurahDetail;
          if (detail && Array.isArray(detail.ayat)) {
            for (const a of detail.ayat) {
              const transLower = a.teksIndonesia.toLowerCase();
              if (transLower.includes(normalizedQuery)) {
                results.push({
                  type: 'ayah',
                  surahNumber: detail.nomor,
                  surahNameLatin: detail.namaLatin,
                  surahNameArabic: detail.nama,
                  ayahNumber: a.nomorAyat,
                  arabicSnippet: a.teksArab,
                  translationSnippet: a.teksIndonesia,
                  matchReason: `Kecocokan kata dalam Terjemahan Kemenag`
                });

                if (results.length >= 50) break; // Limit to 50 results for fast UI
              }
            }
          }
        }
        if (results.length >= 50) break;
      }
    } catch {
      // Ignore cache traversal errors
    }

    return results;
  },

  /**
   * Count how many surahs are cached in local memory/storage
   */
  getCachedSurahsCount(): number {
    let count = 0;
    for (let i = 1; i <= 114; i++) {
      if (localStorage.getItem(`val_quran_cache_surah_v2_${i}`)) {
        count++;
      }
    }
    return count;
  }
};
