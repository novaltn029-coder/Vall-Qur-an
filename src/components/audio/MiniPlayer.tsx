import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, X, Volume2, ChevronUp, ChevronDown } from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    togglePlay,
    stopAudio,
    seek,
    volume,
    setVolumeLevel,
    error
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      role="region"
      aria-label="Pemutar Audio Murottal"
      className="fixed bottom-16 md:bottom-4 left-3 right-3 md:left-auto md:right-6 md:w-96 z-40 bg-[#031B4A] text-[#FFFFFF] rounded-2xl border border-[#022478] shadow-2xl transition-all duration-200 overflow-hidden"
    >
      {/* Top mini progress bar */}
      <div
        className="h-1.5 w-full bg-[#022478] cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          if (duration > 0) {
            seek(ratio * duration);
          }
        }}
      >
        <div
          className="h-full bg-[#00A6FF] transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-3 sm:p-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#022478] border border-[#1352B9] flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4 text-[#00A6FF]" />
            </div>

            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                QS. {currentTrack.surahNameLatin}
                {currentTrack.ayahNumber ? ` : Ayat ${currentTrack.ayahNumber}` : ' (Full Surat)'}
              </h4>
              <p className="text-[11px] text-[#C2DFF3] truncate">
                Qari: {currentTrack.qariName}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={togglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Jeda pemutaran' : 'Lanjutkan pemutaran'}
              className="w-9 h-9 rounded-xl bg-[#00A6FF] text-[#031B4A] hover:bg-white flex items-center justify-center transition-colors"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#031B4A] border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Tutup detail audio' : 'Buka kontrol audio'}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-[#022478] rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            <button
              onClick={stopAudio}
              aria-label="Hentikan dan tutup audio"
              className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-[#022478] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-[#022478] space-y-2.5 animate-in fade-in duration-150">
            {/* Time stamps */}
            <div className="flex items-center justify-between text-[11px] text-[#C2DFF3] font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Seek slider */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full accent-[#00A6FF] h-1.5 bg-[#022478] rounded-lg appearance-none cursor-pointer"
            />

            {/* Volume control */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#00A6FF]" /> Volume
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
                className="w-28 accent-[#00A6FF] h-1.5 bg-[#022478] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-[11px] text-red-300 mt-2 bg-red-950/40 p-2 rounded-lg border border-red-800">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
