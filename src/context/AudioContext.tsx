/**
 * Global Audio Context for val-qur'an
 * Manages full surah audio and per-ayah murottal playback,
 * allowing background playback with mini-player across all pages.
 */

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '../config/app.config';

export interface CurrentTrack {
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber?: number; // if ayah-specific
  qariId: string;
  qariName: string;
  audioUrl: string;
}

interface AudioContextValue {
  currentTrack: CurrentTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  error: string | null;
  playTrack: (track: CurrentTrack, onEnded?: () => void) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (timeSeconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  stopAudio: () => void;
  setOnTrackEnded: (callback: (() => void) | null) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndedRef = useRef<(() => void) | null>(null);

  // Initialize single HTMLAudioElement instance
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEndedRef.current) {
        const cb = onEndedRef.current;
        cb();
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError('Gagal memuat audio murottal dari server. Silakan coba qari lain atau periksa koneksi.');
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const setOnTrackEnded = useCallback((callback: (() => void) | null) => {
    onEndedRef.current = callback;
  }, []);

  const playTrack = useCallback((track: CurrentTrack, onEnded?: () => void) => {
    if (!audioRef.current) return;
    setError(null);
    setCurrentTrack(track);
    setIsLoading(true);
    if (onEnded !== undefined) {
      onEndedRef.current = onEnded;
    }

    const audio = audioRef.current;
    if (audio.src !== track.audioUrl) {
      audio.src = track.audioUrl;
      audio.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Playback prevented or failed:', err);
        setIsPlaying(false);
        setIsLoading(false);
        setError('Browser memblokir pemutaran otomatis atau file audio tidak dapat diakses.');
      });
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setError('Gagal memutar audio.');
      });
    }
  }, [isPlaying, currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().catch(() => {
        setError('Gagal melanjutkan audio.');
      });
    }
  }, [currentTrack]);

  const seek = useCallback((timeSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeSeconds;
      setCurrentTime(timeSeconds);
    }
  }, []);

  const setVolumeLevel = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    setVolume(clamped);
  }, []);

  const stopAudio = useCallback(() => {
    onEndedRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        volume,
        error,
        playTrack,
        togglePlay,
        pause,
        resume,
        seek,
        setVolumeLevel,
        stopAudio,
        setOnTrackEnded
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
