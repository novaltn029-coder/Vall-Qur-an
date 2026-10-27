/**
 * Types for val-qur'an Muslim Companion Modules:
 * - Kiblat (Qibla)
 * - Waktu Salat & Adzan (Prayer Times)
 * - Do'a Harian (Daily Prayers)
 * - Tahlil (Tahlil Reading Sequence)
 * - Kalender Hijriah (Hijri Calendar)
 */

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  cityName?: string;
  source: 'gps' | 'preset' | 'manual';
}

export interface QiblaCalculationResult {
  latitude: number;
  longitude: number;
  qiblaBearing: number; // In degrees 0 - 360 from true North
  distanceKm: number;
}

export interface PrayerTimes {
  fajr: string; // "04:35"
  sunrise: string; // "05:48"
  dhuhr: string; // "11:58"
  asr: string; // "15:15"
  maghrib: string; // "18:02"
  isha: string; // "19:12"
  imsak?: string; // "04:25"
}

export type PrayerName = 'imsak' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface NextPrayerInfo {
  name: PrayerName;
  label: string;
  arabicName: string;
  timeString: string;
  remainingSeconds: number;
  targetTime: Date;
}

export type PrayerStatus = 'upcoming' | 'active' | 'passed';

export interface AdhanReminderSettings {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  soundEnabled: boolean;
  soundType: 'adhan_makkah' | 'chime_peaceful' | 'beep_soft';
  audioSourceType?: 'remote_doha' | 'synthesized_bayati' | 'chime_peaceful' | 'beep_soft';
  fajrSpecialAdhan?: boolean;
  volume: number; // 0 to 1
  calculationMethod: 'KEMENAG' | 'MWL' | 'EGYPT' | 'MAKKAH';
  asrJuristic: 'STANDARD' | 'HANAFI';
  imsakReminderEnabled?: boolean;
  imsakOffsetMinutes?: number;
  iqamahReminderEnabled?: boolean;
  iqamahDelayMinutes?: number;
  simulationModeEnabled?: boolean;
}

export interface DailyDua {
  id: string;
  title: string;
  category: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  benefits?: string;
  isBookmarked?: boolean;
}

export interface TahlilStep {
  id: number;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  repeatCount: number; // e.g. 1, 3, 33, 100
  notes?: string;
}

export interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  monthNameArabic: string;
  year: number;
  formatted: string; // "15 Syawwal 1447 H"
  gregorianDate: Date;
  holiday?: string;
  isAyyamulBidh?: boolean;
}

export interface IslamicHoliday {
  hijriMonth: number; // 1-12
  hijriDay: number;
  name: string;
  description: string;
  isHolidayNational?: boolean;
}
