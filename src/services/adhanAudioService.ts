/**
 * Adhan Audio Service for val-qur'an
 * Robust audio management for Islamic prayer calls:
 * - HTML5 Audio with fallback to Web Audio API harmonic chimes
 * - Dedicated Fajr adhan handling ("Ash-shalatu khairum minan naum")
 * - Autoplay unlocking gesture detection
 * - Strict deduplication mechanism (${date}_${prayer}_${time}_${locationId})
 * - Volume control, preview testing, and graceful cancellation
 */

import { AUDIO_CATALOG, AudioItem } from '../config/audioCatalog';
import { PrayerName } from '../types/worship';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface PlaybackState {
  status: PlaybackStatus;
  currentTrackId?: string;
  currentTitle?: string;
  isFajrSpecial?: boolean;
  isSynthesizedFallback?: boolean;
  volume: number;
  errorMessage?: string;
}

type PlaybackListener = (state: PlaybackState) => void;

class AdhanAudioService {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isUnlocked = false;
  private listeners: Set<PlaybackListener> = new Set();
  private playedDeduplicationKeys: Set<string> = new Set();
  private previewTimeout: ReturnType<typeof setTimeout> | null = null;

  private currentState: PlaybackState = {
    status: 'idle',
    volume: 0.8
  };

  constructor() {
    this.initSessionDeduplication();
    if (typeof window !== 'undefined') {
      // Listen for first user interaction to unlock audio context without intrusive prompts
      const unlockHandler = () => {
        this.unlockAudio();
        window.removeEventListener('click', unlockHandler);
        window.removeEventListener('touchstart', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
      };
      window.addEventListener('click', unlockHandler, { passive: true });
      window.addEventListener('touchstart', unlockHandler, { passive: true });
      window.addEventListener('keydown', unlockHandler, { passive: true });
    }
  }

  private initSessionDeduplication(): void {
    try {
      const stored = sessionStorage.getItem('val_quran_played_adhans_v1');
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        parsed.forEach((k) => this.playedDeduplicationKeys.add(k));
      }
    } catch {
      // Fallback to in-memory set
    }
  }

  private saveDeduplicationKey(key: string): void {
    this.playedDeduplicationKeys.add(key);
    try {
      sessionStorage.setItem(
        'val_quran_played_adhans_v1',
        JSON.stringify(Array.from(this.playedDeduplicationKeys))
      );
    } catch {
      // Ignore
    }
  }

  public hasAlreadyPlayed(key: string): boolean {
    return this.playedDeduplicationKeys.has(key);
  }

  public generateDedupKey(
    dateStr: string,
    prayerName: PrayerName,
    timeString: string,
    locationId: string
  ): string {
    return `${dateStr}_${prayerName}_${timeString}_${locationId}`;
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  private notify(updates: Partial<PlaybackState>): void {
    this.currentState = { ...this.currentState, ...updates };
    this.listeners.forEach((fn) => fn(this.currentState));
  }

  public isAudioUnlocked(): boolean {
    return this.isUnlocked;
  }

  /**
   * Unlock Web Audio API context and HTML5 audio permissions through user gesture
   */
  public async unlockAudio(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.isUnlocked = true;
      return true;
    } catch (e) {
      console.warn('AudioContext unlock warning:', e);
      return false;
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.currentState.volume = clamped;
    if (this.audioEl) {
      this.audioEl.volume = clamped;
    }
    this.notify({ volume: clamped });
  }

  public getVolume(): number {
    return this.currentState.volume;
  }

  public getState(): PlaybackState {
    return this.currentState;
  }

  /**
   * Stop any current playback or synthesis immediately
   */
  public stop(): void {
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }

    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.audioEl.src = '';
      } catch {
        // Ignore
      }
      this.audioEl = null;
    }

    this.notify({
      status: 'idle',
      currentTrackId: undefined,
      currentTitle: undefined,
      errorMessage: undefined
    });
  }

  /**
   * Play specific adhan track with automated fallback to synthesized chime if audio fails
   */
  public async playAdhan(
    trackId: string,
    isFajr = false,
    options?: { isPreview?: boolean; previewMaxSeconds?: number }
  ): Promise<boolean> {
    this.stop();
    await this.unlockAudio();

    const trackItem: AudioItem | undefined = AUDIO_CATALOG[trackId] || AUDIO_CATALOG['adhan_doha_dhuhr'];

    // If item is specifically synthesized or has no remote URL, use Web Audio API directly
    if (!trackItem?.audioUrl || trackItem.status === 'synthesized_offline') {
      return this.playSynthesizedChime(
        trackItem?.offlineSynthesizerId || (isFajr ? 'fajr_chime_bayati' : 'adhan_chime_bayati'),
        isFajr
      );
    }

    this.notify({
      status: 'loading',
      currentTrackId: trackItem.id,
      currentTitle: trackItem.title,
      isFajrSpecial: isFajr,
      isSynthesizedFallback: false
    });

    try {
      const audio = new Audio();
      this.audioEl = audio;
      audio.crossOrigin = 'anonymous';
      audio.src = trackItem.audioUrl;
      audio.volume = this.currentState.volume;

      audio.onplay = () => {
        this.notify({ status: 'playing' });
      };

      audio.onended = () => {
        this.stop();
      };

      audio.onerror = () => {
        console.warn(`[val-qur'an] Remote audio load error for ${trackItem.id}. Switching to offline harmonic chime.`);
        this.playSynthesizedChime(
          trackItem.offlineSynthesizerId || (isFajr ? 'fajr_chime_bayati' : 'adhan_chime_bayati'),
          isFajr
        );
      };

      await audio.play();

      // If preview mode, automatically stop after previewMaxSeconds
      if (options?.isPreview) {
        const duration = (options.previewMaxSeconds || 15) * 1000;
        this.previewTimeout = setTimeout(() => {
          this.stop();
        }, duration);
      }

      return true;
    } catch (err) {
      console.warn('[val-qur\'an] HTML5 Audio autoplay blocked or failed:', err);
      // Seamlessly fall back to synthesized Web Audio
      return this.playSynthesizedChime(
        trackItem.offlineSynthesizerId || (isFajr ? 'fajr_chime_bayati' : 'adhan_chime_bayati'),
        isFajr
      );
    }
  }

  /**
   * Synthesize harmonic Adhan chime via Web Audio API (Guaranteed offline & instant)
   */
  public playSynthesizedChime(chimeId = 'adhan_chime_bayati', isFajr = false): boolean {
    if (typeof window === 'undefined') return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;

      const ctx = this.audioCtx || new AudioContextClass();
      this.audioCtx = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const volume = this.currentState.volume;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gainNode.connect(ctx.destination);

      this.notify({
        status: 'playing',
        currentTrackId: chimeId,
        currentTitle: isFajr ? 'Melodi Adzan Subuh (Synthesized)' : 'Melodi Adzan Bayati (Synthesized)',
        isFajrSpecial: isFajr,
        isSynthesizedFallback: true
      });

      // Harmonic Bayati scale frequencies
      const notes = isFajr
        ? [
            { f: 293.66, dur: 0.8, delay: 0 },    // D4
            { f: 329.63, dur: 0.8, delay: 0.8 },  // E4
            { f: 349.23, dur: 1.0, delay: 1.6 },  // F4
            { f: 392.00, dur: 1.2, delay: 2.6 },  // G4
            { f: 440.00, dur: 1.4, delay: 3.8 },  // A4
            { f: 392.00, dur: 1.0, delay: 5.2 },  // G4
            { f: 349.23, dur: 1.2, delay: 6.2 },  // F4
            { f: 293.66, dur: 2.0, delay: 7.4 }   // D4 (Fajr Resolution)
          ]
        : [
            { f: 293.66, dur: 0.6, delay: 0 },    // D4
            { f: 349.23, dur: 0.7, delay: 0.6 },  // F4
            { f: 392.00, dur: 0.9, delay: 1.3 },  // G4
            { f: 440.00, dur: 1.2, delay: 2.2 },  // A4
            { f: 392.00, dur: 0.8, delay: 3.4 },  // G4
            { f: 349.23, dur: 1.2, delay: 4.2 },  // F4
            { f: 293.66, dur: 1.8, delay: 5.4 }   // D4
          ];

      const totalDuration = notes[notes.length - 1].delay + notes[notes.length - 1].dur;

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.delay);

        noteGain.gain.setValueAtTime(0.01, ctx.currentTime + n.delay);
        noteGain.gain.exponentialRampToValueAtTime(volume * 0.35, ctx.currentTime + n.delay + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.delay + n.dur);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        osc.start(ctx.currentTime + n.delay);
        osc.stop(ctx.currentTime + n.delay + n.dur);
      });

      this.previewTimeout = setTimeout(() => {
        this.stop();
      }, totalDuration * 1000 + 300);

      return true;
    } catch (err) {
      console.warn('Synthesized chime error:', err);
      this.notify({ status: 'error', errorMessage: 'Gagal memutar audio sintetis.' });
      return false;
    }
  }

  /**
   * Handle automated adhan trigger with strict deduplication
   */
  public triggerPrayerAdhan(
    prayerName: PrayerName,
    timeStr: string,
    locationId: string,
    isFajrSpecialEnabled = true
  ): boolean {
    const todayStr = new Date().toISOString().slice(0, 10);
    const key = this.generateDedupKey(todayStr, prayerName, timeStr, locationId);

    if (this.hasAlreadyPlayed(key)) {
      return false;
    }

    this.saveDeduplicationKey(key);

    const isFajr = prayerName === 'fajr';
    const trackId = isFajr && isFajrSpecialEnabled
      ? 'adhan_doha_fajr'
      : prayerName === 'asr'
      ? 'adhan_doha_asr'
      : prayerName === 'maghrib'
      ? 'adhan_doha_maghrib'
      : prayerName === 'isha'
      ? 'adhan_doha_isha'
      : 'adhan_doha_dhuhr';

    this.playAdhan(trackId, isFajr);
    return true;
  }
}

export const adhanAudioService = new AdhanAudioService();
