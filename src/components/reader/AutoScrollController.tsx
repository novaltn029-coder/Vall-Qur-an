import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Square, Gauge, ChevronDown } from 'lucide-react';

interface AutoScrollControllerProps {
  onStop?: () => void;
}

const SPEED_OPTIONS = [
  { label: '0.5x Sangat Lambat', value: 0.5, pixelsPerSec: 20 },
  { label: '1x Normal', value: 1.0, pixelsPerSec: 45 },
  { label: '1.5x Sedang', value: 1.5, pixelsPerSec: 75 },
  { label: '2x Cepat', value: 2.0, pixelsPerSec: 120 },
  { label: '3x Sangat Cepat', value: 3.0, pixelsPerSec: 190 }
];

export const AutoScrollController: React.FC<AutoScrollControllerProps> = ({ onStop }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const accumulatedScrollRef = useRef<number>(0);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopAutoScroll = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    lastTimestampRef.current = null;
    accumulatedScrollRef.current = 0;
    setIsActive(false);
    setIsPaused(false);
    if (onStop) onStop();
  }, [onStop]);

  const pauseAutoScroll = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    lastTimestampRef.current = null;
    setIsPaused(true);
  };

  const startOrResumeAutoScroll = () => {
    if (prefersReducedMotion) {
      alert('Mode Reduced Motion aktif di sistem operasi Anda.');
      return;
    }
    setIsActive(true);
    setIsPaused(false);
    lastTimestampRef.current = null;
  };

  useEffect(() => {
    if (!isActive || isPaused) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const speedConfig =
      SPEED_OPTIONS.find((s) => s.value === currentSpeed) || SPEED_OPTIONS[1];
    const pxPerSecond = speedConfig.pixelsPerSec;

    const scrollLoop = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const deltaMs = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      // Don't scroll if user is selecting text
      const hasSelection =
        window.getSelection() && window.getSelection()!.toString().length > 0;

      if (!hasSelection && deltaMs > 0 && deltaMs < 200) {
        const scrollDelta = (pxPerSecond * deltaMs) / 1000;
        accumulatedScrollRef.current += scrollDelta;

        if (accumulatedScrollRef.current >= 1) {
          const step = Math.floor(accumulatedScrollRef.current);
          window.scrollBy({ top: step, behavior: 'instant' as ScrollBehavior });
          accumulatedScrollRef.current -= step;
        }

        // Check if reached page bottom
        const isBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
        if (isBottom) {
          stopAutoScroll();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, isPaused, currentSpeed, stopAutoScroll]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      role="region"
      aria-label="Kontrol Auto-Scroll Tilawah"
      className="inline-flex items-center gap-1.5 p-1.5 bg-[#031B4A] text-white rounded-2xl border border-[#022478] shadow-lg"
    >
      {!isActive ? (
        <button
          onClick={startOrResumeAutoScroll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00A6FF] text-[#031B4A] text-xs font-bold rounded-xl hover:bg-white transition-colors"
          title="Mulai Auto-Scroll Tilawah"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Auto-Scroll</span>
        </button>
      ) : isPaused ? (
        <button
          onClick={startOrResumeAutoScroll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00A6FF] text-[#031B4A] text-xs font-bold rounded-xl hover:bg-white transition-colors"
          title="Lanjutkan Auto-Scroll"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Lanjut</span>
        </button>
      ) : (
        <button
          onClick={pauseAutoScroll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-[#031B4A] text-xs font-bold rounded-xl hover:bg-white transition-colors"
          title="Jeda Auto-Scroll"
        >
          <Pause className="w-3.5 h-3.5 fill-current" />
          <span>Jeda</span>
        </button>
      )}

      {isActive && (
        <button
          onClick={stopAutoScroll}
          className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-[#022478] rounded-xl transition-colors"
          title="Hentikan Auto-Scroll"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      )}

      {/* Speed Selector */}
      <div className="relative">
        <button
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#022478] text-[#C2DFF3] hover:text-white text-xs font-semibold rounded-xl transition-colors"
          title="Ubah Kecepatan Scroll"
        >
          <Gauge className="w-3.5 h-3.5 text-[#00A6FF]" />
          <span>{currentSpeed}x</span>
          <ChevronDown className="w-3 h-3 ml-0.5" />
        </button>

        {showSpeedMenu && (
          <div className="absolute bottom-full mb-2 left-0 w-44 bg-[#031B4A] border border-[#022478] rounded-xl shadow-2xl p-1 z-50">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setCurrentSpeed(opt.value);
                  setShowSpeedMenu(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                  currentSpeed === opt.value
                    ? 'bg-[#00A6FF] text-[#031B4A] font-bold'
                    : 'text-slate-200 hover:bg-[#022478]'
                }`}
              >
                <span>{opt.label}</span>
                {currentSpeed === opt.value && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
