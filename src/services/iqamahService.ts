/**
 * Iqamah Reminder Service for val-qur'an
 * Manages post-adhan Iqamah countdowns, configurable per-prayer delays,
 * gentle chime alerts, and disclaimers regarding congregational mosque schedules.
 */

import { PrayerName } from '../types/worship';
import { notificationService } from './notificationService';

export interface IqamahSettings {
  enabled: boolean;
  delays: Record<PrayerName, number>; // Delay in minutes after adhan
  soundEnabled: boolean;
  notificationEnabled: boolean;
}

const DEFAULT_IQAMAH_SETTINGS: IqamahSettings = {
  enabled: true,
  delays: {
    fajr: 15,
    dhuhr: 10,
    asr: 10,
    maghrib: 7,
    isha: 10,
    imsak: 0,
    sunrise: 0
  },
  soundEnabled: true,
  notificationEnabled: true
};

const STORAGE_KEY = 'val_quran_iqamah_settings_v1';

export const THEOLOGICAL_IQAMAH_NOTE =
  'Jeda iqamah di aplikasi val-qur\'an dirancang sebagai estimasi persiapan ibadah pribadi menuju tempat shalat. Waktu iqamah di setiap masjid dapat bervariasi sesuai ketetapan musyawarah takmir masjid setempat.';

class IqamahService {
  private activeCountdowns: Map<PrayerName, { targetTime: Date; prayerName: PrayerName }> = new Map();

  public getSettings(): IqamahSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_IQAMAH_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_IQAMAH_SETTINGS;
  }

  public saveSettings(settings: Partial<IqamahSettings>): IqamahSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  }

  /**
   * Play Iqamah chime ("Qad qamatis-salah" gentle harmonic cue)
   */
  public playIqamahChime(volume = 0.75): void {
    if (typeof window === 'undefined') return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
      gainNode.connect(ctx.destination);

      // 4 bell tones: F4, A4, C5, F5 (Ascending resolution)
      const sequence = [
        { f: 349.23, time: 0 },    // F4
        { f: 440.00, time: 0.25 }, // A4
        { f: 523.25, time: 0.5 },  // C5
        { f: 698.46, time: 0.75 }  // F5
      ];

      sequence.forEach((item) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.time);

        noteGain.gain.setValueAtTime(0.01, ctx.currentTime + item.time);
        noteGain.gain.exponentialRampToValueAtTime(volume * 0.35, ctx.currentTime + item.time + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.time + 0.8);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        osc.start(ctx.currentTime + item.time);
        osc.stop(ctx.currentTime + item.time + 0.85);
      });
    } catch (e) {
      console.warn('Iqamah chime warning:', e);
    }
  }

  /**
   * Start Iqamah timer for a prayer
   */
  public startIqamahTimer(prayerName: PrayerName, prayerDate: Date): Date | null {
    const settings = this.getSettings();
    if (!settings.enabled) return null;

    const delayMinutes = settings.delays[prayerName] || 10;
    if (delayMinutes <= 0) return null;

    const targetTime = new Date(prayerDate.getTime() + delayMinutes * 60 * 1000);
    this.activeCountdowns.set(prayerName, { targetTime, prayerName });
    return targetTime;
  }

  /**
   * Check active countdown for a prayer
   */
  public getRemainingSeconds(prayerName: PrayerName, now: Date = new Date()): number {
    const entry = this.activeCountdowns.get(prayerName);
    if (!entry) return 0;
    const diff = Math.floor((entry.targetTime.getTime() - now.getTime()) / 1000);
    return Math.max(0, diff);
  }

  /**
   * Trigger Iqamah reminder alert
   */
  public triggerIqamah(prayerLabel: string): void {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    if (settings.soundEnabled) {
      this.playIqamahChime();
    }

    if (settings.notificationEnabled) {
      notificationService.sendNotification(`Waktu Iqamah Telah Tiba — Shalat ${prayerLabel}`, {
        body: 'Saf shalat siap ditegakkan. Luruskan dan rapatkan saf berjamaah.'
      });
    }
  }
}

export const iqamahService = new IqamahService();
