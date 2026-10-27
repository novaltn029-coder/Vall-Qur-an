/**
 * Dua Audio Service for val-qur'an
 * Manages audio playback for daily supplications and dhikr.
 * Uses verified audio endpoints where available, and browser SpeechSynthesis
 * or Web Audio API as an offline recitation aid.
 */

import { DUA_AUDIO_MAP, DuaAudioEntry } from '../config/audioCatalog';

export interface DuaPlaybackState {
  duaId: string | null;
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentTime: number;
  duration: number;
}

type DuaListener = (state: DuaPlaybackState) => void;

class DuaAudioService {
  private audioEl: HTMLAudioElement | null = null;
  private currentDuaId: string | null = null;
  private listeners: Set<DuaListener> = new Set();
  private state: DuaPlaybackState = {
    duaId: null,
    isPlaying: false,
    progress: 0,
    currentTime: 0,
    duration: 0
  };

  public subscribe(listener: DuaListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(updates: Partial<DuaPlaybackState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach((fn) => fn(this.state));
  }

  public getAudioEntry(duaId: string): DuaAudioEntry | undefined {
    return DUA_AUDIO_MAP[duaId];
  }

  public stop(): void {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.src = '';
      } catch {
        // Ignore
      }
      this.audioEl = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentDuaId = null;
    this.notify({
      duaId: null,
      isPlaying: false,
      progress: 0,
      currentTime: 0,
      duration: 0
    });
  }

  public async playDua(duaId: string, arabicText?: string): Promise<boolean> {
    if (this.state.isPlaying && this.currentDuaId === duaId) {
      this.stop();
      return false;
    }

    this.stop();
    const entry = this.getAudioEntry(duaId);

    // If verified remote audio URL is available
    if (entry?.audioUrl && entry.status === 'verified_remote') {
      try {
        const audio = new Audio();
        this.audioEl = audio;
        this.currentDuaId = duaId;
        audio.src = entry.audioUrl;

        this.notify({
          duaId,
          isPlaying: true,
          progress: 0,
          currentTime: 0,
          duration: 0
        });

        audio.ontimeupdate = () => {
          if (audio.duration) {
            this.notify({
              currentTime: audio.currentTime,
              duration: audio.duration,
              progress: audio.currentTime / audio.duration
            });
          }
        };

        audio.onended = () => {
          this.stop();
        };

        audio.onerror = () => {
          console.warn('Dua remote audio playback error. Falling back to speech synthesis.');
          if (arabicText) {
            this.playSpeechSynthesis(duaId, arabicText);
          } else {
            this.stop();
          }
        };

        await audio.play();
        return true;
      } catch (err) {
        console.warn('Dua play error:', err);
        if (arabicText) {
          return this.playSpeechSynthesis(duaId, arabicText);
        }
        return false;
      }
    }

    // Fallback: Browser speech synthesis for Arabic recitation aid
    if (arabicText) {
      return this.playSpeechSynthesis(duaId, arabicText);
    }

    return false;
  }

  private playSpeechSynthesis(duaId: string, arabicText: string): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // Calmer pace for spiritual reading

      this.currentDuaId = duaId;
      this.notify({
        duaId,
        isPlaying: true,
        progress: 0.5,
        currentTime: 0,
        duration: 5
      });

      utterance.onend = () => {
        this.stop();
      };

      utterance.onerror = () => {
        this.stop();
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      this.stop();
      return false;
    }
  }
}

export const duaAudioService = new DuaAudioService();
