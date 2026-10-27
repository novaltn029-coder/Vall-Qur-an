/**
 * Prayer Times Calculation Service for val-qur'an
 * Implements Astronomical Solar Algorithm standard (Kemenag RI / MWL / Umm Al-Qura)
 * with 100% offline mathematical calculation and optional Aladhan API synchronization.
 */

import { PrayerTimes, PrayerName, NextPrayerInfo, AdhanReminderSettings, PrayerStatus } from '../types/worship';
import { adhanAudioService } from './adhanAudioService';
import { imsakReminderService } from './imsakReminderService';
import { iqamahService } from './iqamahService';
import { notificationService } from './notificationService';

export interface CalculationParameters {
  fajrAngle: number;
  ishaAngle: number;
  ishaIntervalMinutes?: number;
  asrFactor: number; // 1 for Shafi'i/standard, 2 for Hanafi
  dhuhrSafetyMinutes: number;
}

const METHODS: Record<string, CalculationParameters> = {
  KEMENAG: {
    fajrAngle: 20,
    ishaAngle: 18,
    asrFactor: 1,
    dhuhrSafetyMinutes: 2 // Ihtiyath standard Kemenag RI
  },
  MWL: {
    fajrAngle: 18,
    ishaAngle: 17,
    asrFactor: 1,
    dhuhrSafetyMinutes: 1
  },
  EGYPT: {
    fajrAngle: 19.5,
    ishaAngle: 17.5,
    asrFactor: 1,
    dhuhrSafetyMinutes: 1
  },
  MAKKAH: {
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaIntervalMinutes: 90,
    asrFactor: 1,
    dhuhrSafetyMinutes: 1
  }
};

const DEFAULT_SETTINGS: AdhanReminderSettings = {
  fajr: true,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
  soundEnabled: true,
  soundType: 'adhan_makkah',
  audioSourceType: 'remote_doha',
  fajrSpecialAdhan: true,
  volume: 0.8,
  calculationMethod: 'KEMENAG',
  asrJuristic: 'STANDARD',
  imsakReminderEnabled: true,
  imsakOffsetMinutes: 10,
  iqamahReminderEnabled: true,
  iqamahDelayMinutes: 10,
  simulationModeEnabled: false
};

const STORAGE_SETTINGS_KEY = 'val_quran_adhan_settings_v1';
const SIMULATION_STORAGE_KEY = 'val_quran_simulation_active_v1';

export const prayerTimesService = {
  getSettings(): AdhanReminderSettings {
    try {
      const data = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<AdhanReminderSettings>): AdhanReminderSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  },

  /**
   * Astronomical calculation of prayer times
   */
  calculatePrayerTimes(
    date: Date,
    latitude: number,
    longitude: number,
    timezoneOffsetHours: number,
    methodKey: 'KEMENAG' | 'MWL' | 'EGYPT' | 'MAKKAH' = 'KEMENAG',
    asrJuristic: 'STANDARD' | 'HANAFI' = 'STANDARD',
    imsakOffsetMinutes = 10
  ): PrayerTimes {
    const method = METHODS[methodKey] || METHODS.KEMENAG;
    const asrFactor = asrJuristic === 'HANAFI' ? 2 : 1;

    // Day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Julian Century and Solar coordinates
    const D = dayOfYear + (12 - timezoneOffsetHours) / 24;
    const g = (357.529 + 0.98560028 * D) % 360;
    const q = (280.459 + 0.98564736 * D) % 360;
    const L = (q + 1.915 * Math.sin((g * Math.PI) / 180) + 0.02 * Math.sin((2 * g * Math.PI) / 180)) % 360;

    const e = 23.439 - 0.00000036 * D; // Obliquity of the ecliptic
    const sinDec = Math.sin((e * Math.PI) / 180) * Math.sin((L * Math.PI) / 180);
    const declination = Math.asin(sinDec); // In radians

    // Equation of Time in hours
    const RA =
      Math.atan2(
        Math.cos((e * Math.PI) / 180) * Math.sin((L * Math.PI) / 180),
        Math.cos((L * Math.PI) / 180)
      ) / 15;
    let EqT = q / 15 - (RA < 0 ? RA + 24 : RA);
    if (EqT > 12) EqT -= 24;
    if (EqT < -12) EqT += 24;

    // Solar Noon (Zuhur transit)
    const solarNoon = 12 + timezoneOffsetHours - longitude / 15 - EqT;
    const latRad = (latitude * Math.PI) / 180;

    // Helper: calculate hour angle for a specific altitude alpha (in degrees)
    const hourAngle = (alphaDeg: number, isBelowHorizon = true): number => {
      const alphaRad = (alphaDeg * Math.PI) / 180;
      const cosH =
        (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(declination)) /
        (Math.cos(latRad) * Math.cos(declination));

      if (cosH > 1 || cosH < -1) {
        return isBelowHorizon ? 0 : 6;
      }
      return (Math.acos(cosH) * 180) / Math.PI / 15;
    };

    // Subuh (Fajr)
    const fajrH = hourAngle(-method.fajrAngle);
    const fajrTime = solarNoon - fajrH;

    // Terbit (Sunrise)
    const sunriseH = hourAngle(-0.8333); // Apparent sunrise with atmospheric refraction
    const sunriseTime = solarNoon - sunriseH;

    // Zuhur: Solar Noon + safety minutes (Ihtiyath)
    const dhuhrTime = solarNoon + (method.dhuhrSafetyMinutes || 2) / 60;

    // Asar: Altitude when shadow length = t * obj + noon shadow
    const noonAlt = 90 - Math.abs(latitude - (declination * 180) / Math.PI);
    const noonShadow = 1 / Math.tan((noonAlt * Math.PI) / 180);
    const asrAlt = (Math.atan(1 / (asrFactor + noonShadow)) * 180) / Math.PI;
    const asrH = hourAngle(asrAlt, false);
    const asrTime = solarNoon + asrH;

    // Maghrib: Sunset
    const sunsetH = hourAngle(-0.8333);
    const maghribTime = solarNoon + sunsetH + 2 / 60; // 2 min safety for Maghrib

    // Isya:
    let ishaTime: number;
    if (method.ishaIntervalMinutes) {
      ishaTime = maghribTime + method.ishaIntervalMinutes / 60;
    } else {
      const ishaH = hourAngle(-method.ishaAngle);
      ishaTime = solarNoon + ishaH;
    }

    // Imsak: Configurable minutes before Subuh (Default 10 min Ihtiyath)
    const imsakTime = fajrTime - (imsakOffsetMinutes || 10) / 60;

    const formatHour = (h: number): string => {
      let norm = ((h % 24) + 24) % 24;
      const hours = Math.floor(norm);
      const minutes = Math.floor((norm - hours) * 60);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    return {
      imsak: formatHour(imsakTime),
      fajr: formatHour(fajrTime),
      sunrise: formatHour(sunriseTime),
      dhuhr: formatHour(dhuhrTime),
      asr: formatHour(asrTime),
      maghrib: formatHour(maghribTime),
      isha: formatHour(ishaTime)
    };
  },

  /**
   * Determine whether a prayer is 'upcoming', 'active' (currently within ~30 min window), or 'passed'
   */
  getPrayerStatus(
    prayerTimeStr: string,
    currentDate: Date = new Date(),
    selectedDate: Date = new Date(),
    nextPrayerTimeStr?: string
  ): PrayerStatus {
    const [h, m] = prayerTimeStr.split(':').map((v) => parseInt(v, 10));
    const prayerTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      h,
      m,
      0
    );

    const now = currentDate.getTime();
    const prayerMs = prayerTime.getTime();

    // Upcoming if current time is before the prayer
    if (now < prayerMs) {
      return 'upcoming';
    }

    // If next prayer time exists on the same day, active window is between this prayer and next prayer (or up to 45 mins)
    let windowEndMs = prayerMs + 45 * 60 * 1000;
    if (nextPrayerTimeStr) {
      const [nh, nm] = nextPrayerTimeStr.split(':').map((v) => parseInt(v, 10));
      const nextTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        nh,
        nm,
        0
      );
      windowEndMs = nextTime.getTime();
    }

    if (now >= prayerMs && now <= windowEndMs) {
      return 'active';
    }

    return 'passed';
  },

  /**
   * Determine the next upcoming prayer and countdown
   */
  getNextPrayer(times: PrayerTimes, currentDate: Date = new Date()): NextPrayerInfo {
    const prayers: { name: PrayerName; label: string; arabicName: string; timeStr: string }[] = [
      { name: 'fajr', label: 'Subuh', arabicName: 'الفجر', timeStr: times.fajr },
      { name: 'sunrise', label: 'Terbit', arabicName: 'الشروق', timeStr: times.sunrise },
      { name: 'dhuhr', label: 'Zuhur', arabicName: 'الظهر', timeStr: times.dhuhr },
      { name: 'asr', label: 'Asar', arabicName: 'العصر', timeStr: times.asr },
      { name: 'maghrib', label: 'Magrib', arabicName: 'المغرب', timeStr: times.maghrib },
      { name: 'isha', label: 'Isya', arabicName: 'العشاء', timeStr: times.isha }
    ];

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    for (const p of prayers) {
      const [h, m] = p.timeStr.split(':').map((v) => parseInt(v, 10));
      const target = new Date(currentYear, currentMonth, currentDay, h, m, 0);

      const diffSecs = Math.floor((target.getTime() - currentDate.getTime()) / 1000);
      if (diffSecs > 0) {
        return {
          name: p.name,
          label: p.label,
          arabicName: p.arabicName,
          timeString: p.timeStr,
          remainingSeconds: diffSecs,
          targetTime: target
        };
      }
    }

    // If past Isya today, next prayer is Subuh tomorrow
    const [fh, fm] = times.fajr.split(':').map((v) => parseInt(v, 10));
    const tomorrowFajr = new Date(currentYear, currentMonth, currentDay + 1, fh, fm, 0);
    const diffTomorrow = Math.floor((tomorrowFajr.getTime() - currentDate.getTime()) / 1000);

    return {
      name: 'fajr',
      label: 'Subuh',
      arabicName: 'الفجر',
      timeString: times.fajr,
      remainingSeconds: diffTomorrow,
      targetTime: tomorrowFajr
    };
  },

  /**
   * Check if Simulation Mode is enabled
   */
  isSimulationMode(): boolean {
    try {
      return localStorage.getItem(SIMULATION_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Toggle Simulation Mode for QA and verification
   */
  setSimulationMode(enabled: boolean): void {
    try {
      localStorage.setItem(SIMULATION_STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {
      // Ignore
    }
  },

  /**
   * Trigger immediate or delayed simulation of adhan / prayer reminder
   */
  simulatePrayerAdhan(
    prayerName: PrayerName,
    delaySeconds = 3,
    locationName = 'Kabupaten Serang (Simulasi)'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isFajr = prayerName === 'fajr';
        const labels: Record<string, string> = {
          fajr: 'Subuh',
          dhuhr: 'Dzuhur',
          asr: 'Ashar',
          maghrib: 'Maghrib',
          isha: 'Isya',
          imsak: 'Imsak'
        };
        const label = labels[prayerName] || prayerName;

        if (prayerName === 'imsak') {
          imsakReminderService.playImsakChime();
          notificationService.sendNotification('Waktu Imsak Telah Tiba (Simulasi)', {
            body: `Pengingat imsak untuk ${locationName}. Persiapkan diri menuju shalat Subuh.`
          });
          resolve(true);
          return;
        }

        // Trigger Adhan sound
        const trackId = isFajr ? 'adhan_doha_fajr' : `adhan_doha_${prayerName}`;
        adhanAudioService.playAdhan(trackId, isFajr, { isPreview: true, previewMaxSeconds: 15 });

        // Trigger Notification
        notificationService.sendNotification(`Waktu Shalat ${label} Telah Tiba (Simulasi)`, {
          body: `Masuk waktu shalat fardhu ${label} untuk wilayah ${locationName}. Mari laksanakan shalat tepat waktu.`
        });

        // Schedule Iqamah countdown
        iqamahService.startIqamahTimer(prayerName, new Date());
        resolve(true);
      }, delaySeconds * 1000);
    });
  },

  /**
   * Minute tick check for live adhan & imsak triggers
   */
  checkAndTriggerPrayerTimes(
    times: PrayerTimes,
    locationName: string,
    locationId: string,
    currentDate: Date = new Date()
  ): void {
    const settings = this.getSettings();
    if (!settings.soundEnabled) return;

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const nowTimeStr = `${hours}:${minutes}`;
    const todayStr = currentDate.toISOString().slice(0, 10);

    // 1. Check Imsak
    if (times.imsak === nowTimeStr && settings.imsakReminderEnabled) {
      imsakReminderService.triggerImsakReminder(todayStr, locationName);
    }

    // 2. Check Fardhu Prayers
    type FardhuPrayer = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    const prayerKeys: { name: FardhuPrayer; timeStr: string; label: string }[] = [
      { name: 'fajr', timeStr: times.fajr, label: 'Subuh' },
      { name: 'dhuhr', timeStr: times.dhuhr, label: 'Dzuhur' },
      { name: 'asr', timeStr: times.asr, label: 'Ashar' },
      { name: 'maghrib', timeStr: times.maghrib, label: 'Maghrib' },
      { name: 'isha', timeStr: times.isha, label: 'Isya' }
    ];

    for (const p of prayerKeys) {
      if (p.timeStr === nowTimeStr && settings[p.name]) {
        const played = adhanAudioService.triggerPrayerAdhan(
          p.name,
          p.timeStr,
          locationId,
          settings.fajrSpecialAdhan ?? true
        );
        if (played) {
          notificationService.sendNotification(`Waktu Shalat ${p.label} Telah Tiba`, {
            body: `Panggilan shalat fardhu ${p.label} untuk wilayah ${locationName}. Hayya 'alas-salah.`
          });

          // Start Iqamah timer
          if (settings.iqamahReminderEnabled) {
            iqamahService.startIqamahTimer(p.name, currentDate);
          }
        }
      }
    }
  }
};
