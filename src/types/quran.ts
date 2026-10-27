export interface SurahSummary {
  nomor: number;
  nama: string; // Arabic name, e.g. "الفاتحة"
  namaLatin: string; // "Al-Fatihah"
  jumlahAyat: number;
  tempatTurun: string; // "Mekah" | "Madinah"
  arti: string; // "Pembukaan"
  deskripsi: string;
  audioFull: Record<string, string>; // "01": url, ...
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>; // "01": url, ...
}

export interface SurahNavReference {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface SurahDetail extends SurahSummary {
  suratSebelumnya: SurahNavReference | false;
  suratSelanjutnya: SurahNavReference | false;
  ayat: Ayah[];
}

export interface TafsirAyah {
  ayat: number;
  teks: string;
}

export interface SurahTafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  tafsir: TafsirAyah[];
}

export interface BookmarkItem {
  id: string; // e.g., "surah-2-ayah-255"
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicSnippet: string;
  translationSnippet: string;
  createdAt: number;
}

export interface NoteItem {
  id: string;
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber: number;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingHistory {
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  ayahNumber: number;
  timestamp: number;
}

export interface TilawahProgress {
  todayDate: string; // YYYY-MM-DD
  ayatReadToday: number;
  completedAyatIds: string[]; // ["1:1", "1:2"]
}

export interface AppSettings {
  arabicFontSize: number;
  arabicLineHeight: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  autoScrollSpeed: number; // 0.5, 1, 1.5, 2, 3
  defaultQariId: string; // "01" .. "06"
  dailyTargetAyat: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber?: number; // if ayah specific, or undefined for full surah
  qariId: string;
  qariName: string;
  audioUrl: string;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error?: string | null;
}
