import React, { useState, useEffect } from 'react';
import { quranApi } from '../../services/quranApi';
import { SurahTafsir } from '../../types/quran';
import { X, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';

interface TafsirPanelProps {
  isOpen: boolean;
  surahNumber: number;
  initialAyahNumber: number;
  totalAyat: number;
  surahNameLatin: string;
  onClose: () => void;
}

export const TafsirPanel: React.FC<TafsirPanelProps> = ({
  isOpen,
  surahNumber,
  initialAyahNumber,
  totalAyat,
  surahNameLatin,
  onClose
}) => {
  const [currentAyah, setCurrentAyah] = useState(initialAyahNumber);
  const [tafsirData, setTafsirData] = useState<SurahTafsir | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentAyah(initialAyahNumber);
  }, [initialAyahNumber]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const controller = new AbortController();

    async function loadTafsir() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await quranApi.getSurahTafsir(surahNumber, controller.signal);
        if (isMounted) {
          setTafsirData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Gagal memuat tafsir surat.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTafsir();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isOpen, surahNumber]);

  if (!isOpen) return null;

  const currentTafsirItem = tafsirData?.tafsir.find((t) => t.ayat === currentAyah);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-[#FFFFFF] w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#031B4A] text-white flex items-center justify-between border-b border-[#022478]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00A6FF]/20 text-[#00A6FF] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Tafsir Kemenag RI
              </h3>
              <p className="text-xs text-[#C2DFF3]">
                QS. {surahNameLatin} : Ayat {currentAyah} dari {totalAyat}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup panel tafsir"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#022478] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ayah selector bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
          <button
            disabled={currentAyah <= 1}
            onClick={() => setCurrentAyah((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-1 font-semibold text-[#031B4A] disabled:opacity-40 hover:text-[#1352B9]"
          >
            <ChevronLeft className="w-4 h-4" /> Ayat Sebelumnya
          </button>

          <span className="font-bold text-slate-700">
            Ayat {currentAyah} / {totalAyat}
          </span>

          <button
            disabled={currentAyah >= totalAyat}
            onClick={() => setCurrentAyah((prev) => Math.min(totalAyat, prev + 1))}
            className="flex items-center gap-1 font-semibold text-[#031B4A] disabled:opacity-40 hover:text-[#1352B9]"
          >
            Ayat Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && (
            <LoadingState
              message="Memuat naskah tafsir Kemenag RI..."
              subMessage="Mengambil penjelasan resmi Kemenag"
            />
          )}

          {error && (
            <ErrorState
              title="Gagal Memuat Tafsir"
              message={error}
              onRetry={() => {
                setError(null);
                setIsLoading(true);
                quranApi.getSurahTafsir(surahNumber).then(setTafsirData).catch((e) => setError(e.message));
              }}
            />
          )}

          {!isLoading && !error && currentTafsirItem && (
            <div className="space-y-4 text-slate-800 text-sm md:text-base leading-relaxed">
              <div className="p-3 bg-[#C2DFF3]/30 rounded-xl border border-[#C2DFF3] text-xs text-[#031B4A] font-medium">
                Sumber: Kementerian Agama Republik Indonesia (Kemenag RI) — Tafsir Wajiz & Tahlili
              </div>
              <div className="whitespace-pre-wrap font-sans space-y-3">
                {currentTafsirItem.teks.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !error && !currentTafsirItem && (
            <div className="p-8 text-center text-slate-500">
              <p>Tafsir untuk ayat ini belum tersedia dari sumber data.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#000000] text-white text-xs font-semibold rounded-xl hover:bg-[#031B4A] transition-colors"
          >
            Tutup Tafsir
          </button>
        </div>
      </div>
    </div>
  );
};
