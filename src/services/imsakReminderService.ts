/**
 * Imsak Reminder Service for val-qur'an
 * Manages pre-dawn Imsak reminders, configurable offset minutes (default 10m),
 * synthesized alert chime, and clear theological context regarding fasting limits.
 */

import { notificationService } from './notificationService';

export interface ImsakSettings {
  enabled: boolean;
  offsetMinutes: number; // typically 10 minutes before Fajr
  soundEnabled: boolean;
  notificationEnabled: boolean;
}

const DEFAULT_IMSAK_SETTINGS: ImsakSettings = {
  enabled: true,
  offsetMinutes: 10,
  soundEnabled: true,
  notificationEnabled: true
};

const STORAGE_KEY = 'val_quran_imsak_settings_v1';

export const THEOLOGICAL_IMSAK_NOTE =
  'Waktu Imsak adalah waktu kehati-hatian (ihtiyath) yang dianjurkan para ulama nusantara dan Kemenag RI sekitar 10 menit sebelum fajar shadiq agar kaum muslimin dapat menyudahi sahur dengan tenang. Batas wajib menahan diri (mulai puasa) menurut syariat adalah tepat saat masuknya waktu shalat Subuh.';

class ImsakReminderService {
  private playedTodayKeys: Set<string> = new Set();

  public getSettings(): ImsakSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_IMSAK_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_IMSAK_SETTINGS;
  }

  public saveSettings(settings: Partial<ImsakSettings>): ImsakSettings {
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
   * Play Imsak alert tone (gentle triad reminder chime)
   */
  public playImsakChime(volume = 0.7): void {
    if (typeof window === 'undefined') return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
      gainNode.connect(ctx.destination);

      // 3 gentle chimes: E5, G#5, B5 (Major chord of gentle awakening)
      const triad = [
        { f: 659.25, time: 0 },    // E5
        { f: 830.61, time: 0.3 },  // G#5
        { f: 987.77, time: 0.6 }   // B5
      ];

      triad.forEach((tone) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.f, ctx.currentTime + tone.time);

        noteGain.gain.setValueAtTime(0.01, ctx.currentTime + tone.time);
        noteGain.gain.exponentialRampToValueAtTime(volume * 0.3, ctx.currentTime + tone.time + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tone.time + 0.9);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        osc.start(ctx.currentTime + tone.time);
        osc.stop(ctx.currentTime + tone.time + 0.95);
      });
    } catch (e) {
      console.warn('Imsak chime warning:', e);
    }
  }

  /**
   * Trigger Imsak reminder alert if enabled and not already triggered today
   */
  public triggerImsakReminder(dateStr: string, locationName: string): boolean {
    const settings = this.getSettings();
    if (!settings.enabled) return false;

    const key = `imsak_${dateStr}`;
    if (this.playedTodayKeys.has(key)) return false;

    this.playedTodayKeys.add(key);

    if (settings.soundEnabled) {
      this.playImsakChime();
    }

    if (settings.notificationEnabled) {
      notificationService.sendNotification('Waktu Imsak Telah Tiba', {
        body: `Waktu kehati-hatian (ihtiyath) untuk wilayah ${locationName}. Persiapkan diri menuju shalat Subuh.`
      });
    }

    return true;
  }
}

export const imsakReminderService = new ImsakReminderService();
