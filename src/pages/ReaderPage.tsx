import React, { useState, useEffect, useRef, useCallback } from 'react';
import { quranApi } from '../services/quranApi';
import { SurahDetail } from '../types/quran';
import { AyahCard } from '../components/reader/AyahCard';
import { TafsirPanel } from '../components/reader/TafsirPanel';
import { NoteModal } from '../components/reader/NoteModal';
import { AutoScrollController } from '../components/reader/AutoScrollController';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { APP_CONFIG } from '../config/app.config';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BookOpen,
  Volume2,
  Sliders,
  Type,
  ArrowUp,
  Info
} from 'lucide-react';

interface ReaderPageProps {
  surahNumber: number;
  initialAyahNumber?: number;
  onNavigateSurah: (surahNumber: number, ayahNumber?: number) => void;
  onBack: () => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({
  surahNumber,
  initialAyahNumber = 1,
  onNavigateSurah,
  onBack
}) => {
  const { settings, updateSettings, saveLastRead, showToast } = useApp();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [showFontControl, setShowFontControl] = useState<boolean>(false);

  // Tafsir Modal state
  const [tafsirModalOpen, setTafsirModalOpen] = useState<boolean>(false);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<number>(1);

  // Note Modal state
  const [noteModalOpen, setNoteModalOpen] = useState<boolean>(false);
  const [selectedNoteAyah, setSelectedNoteAyah] = useState<number>(1);

  // Highlighting specific ayah navigated from search/bookmark
  const [highlightedAyah, setHighlightedAyah] = useState<number | null>(initialAyahNumber > 1 ? initialAyahNumber : null);

  const topRef = useRef<HTMLDivElement | null>(null);

  // Fetch Surah Detail
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchSurah() {
      setIsLoading(true);
      setError(null);
      try {
        const detail = await quranApi.getSurahDetail(surahNumber, controller.signal);
        if (isMounted) {
          setSurahData(detail);

          // Save last read position
          saveLastRead({
            surahNumber: detail.nomor,
            surahNameLatin: detail.namaLatin,
            surahNameArabic: detail.nama,
            ayahNumber: initialAyahNumber || 1
          });
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || `Gagal memuat surat ke-${surahNumber}.`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSurah();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [surahNumber, saveLastRead, initialAyahNumber]);

  // Handle scroll to initial ayah after surahData loads
  useEffect(() => {
    if (surahData && initialAyahNumber && initialAyahNumber > 1) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`ayah-${initialAyahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
      return () => clearTimeout(timer);
    } else if (surahData && (!initialAyahNumber || initialAyahNumber === 1)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [surahData, initialAyahNumber]);

  // Jump to ayah handler
  const handleJumpToAyah = (ayahNum: number) => {
    setHighlightedAyah(ayahNum);
    const el = document.getElementById(`ayah-${ayahNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (surahData) {
      saveLastRead({
        surahNumber: surahData.nomor,
        surahNameLatin: surahData.namaLatin,
        surahNameArabic: surahData.nama,
        ayahNumber: ayahNum
      });
    }
  };

  // Full Surah Audio play
  const isFullSurahPlaying =
    currentTrack?.surahNumber === surahNumber && !currentTrack?.ayahNumber && isPlaying;

  const handlePlayFullSurah = () => {
    if (!surahData) return;
    if (isFullSurahPlaying) {
      togglePlay();
      return;
    }

    const qariId = settings.defaultQariId || '05';
    const audioUrl = surahData.audioFull[qariId] || surahData.audioFull['05'] || surahData.audioFull['01'];
    const qariInfo = APP_CONFIG.qariList.find((q) => q.id === qariId) || APP_CONFIG.qariList[4];

    if (!audioUrl) {
      alert('Audio full surat belum tersedia.');
      return;
    }

    playTrack({
      surahNumber: surahData.nomor,
      surahNameLatin: surahData.namaLatin,
      qariId,
      qariName: qariInfo.name,
      audioUrl
    });
  };

  // Automated sequential playback for partial ayah audio with smooth auto-scroll downward
  const playAyahSequentially = useCallback(
    (ayahNum: number) => {
      if (!surahData) return;

      const targetAyah = surahData.ayat.find((a) => a.nomorAyat === ayahNum);
      if (!targetAyah) return;

      const qariId = settings.defaultQariId || '05';
      const audioUrl = targetAyah.audio[qariId] || targetAyah.audio['05'] || targetAyah.audio['01'];
      const qariInfo = APP_CONFIG.qariList.find((q) => q.id === qariId) || APP_CONFIG.qariList[4];

      if (!audioUrl) {
        showToast(`Audio untuk ayat ${ayahNum} belum tersedia dari server.`, 'warning');
        return;
      }

      setHighlightedAyah(ayahNum);

      // Auto-scroll effect downward to the active ayah
      setTimeout(() => {
        const el = document.getElementById(`ayah-${ayahNum}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 80);

      // Save reading progress
      saveLastRead({
        surahNumber: surahData.nomor,
        surahNameLatin: surahData.namaLatin,
        surahNameArabic: surahData.nama,
        ayahNumber: ayahNum
      });

      // Play track with callback to automatically advance to next ayah upon completion
      playTrack(
        {
          surahNumber: surahData.nomor,
          surahNameLatin: surahData.namaLatin,
          ayahNumber: ayahNum,
          qariId,
          qariName: qariInfo.name,
          audioUrl
        },
        () => {
          // Track ended callback: continue to next ayah automatically with auto-scroll
          const nextAyahNum = ayahNum + 1;
          if (nextAyahNum <= surahData.jumlahAyat) {
            setTimeout(() => {
              playAyahSequentially(nextAyahNum);
            }, 300);
          } else {
            showToast(`Selesai tilawah Surat ${surahData.namaLatin}.`, 'success');
          }
        }
      );
    },
    [surahData, settings.defaultQariId, playTrack, showToast, saveLastRead]
  );

  const handleToggleAyahAudio = useCallback(
    (ayahNum: number) => {
      const isCurrentlyPlayingThisAyah =
        currentTrack?.surahNumber === surahNumber &&
        currentTrack?.ayahNumber === ayahNum &&
        isPlaying;

      if (isCurrentlyPlayingThisAyah) {
        togglePlay();
      } else {
        playAyahSequentially(ayahNum);
      }
    },
    [currentTrack, surahNumber, isPlaying, togglePlay, playAyahSequentially]
  );

  // Basmalah logic:
  // Surah 1: Ayah 1 is already Basmalah.
  // Surah 9 (At-Taubah): Does NOT have Basmalah.
  // Other surahs (2-114 except 9): Show standard Basmalah header.
  const showBasmalahHeader = surahNumber !== 1 && surahNumber !== 9;

  return (
    <div ref={topRef} className="space-y-6 pb-28 md:pb-16 max-w-4xl lg:max-w-5xl mx-auto w-full">
      {/* Top back & toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 bg-white/95 backdrop-blur-xs py-2.5 px-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#031B4A] hover:text-[#1352B9] transition-colors p-1.5 rounded-xl hover:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Surat</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Auto-Scroll Controller */}
          <AutoScrollController />

          {/* Font Typography Popover button */}
          <button
            onClick={() => setShowFontControl(!showFontControl)}
            aria-label="Atur ukuran huruf Arab"
            className={`p-2 rounded-xl transition-colors border ${
              showFontControl
                ? 'bg-[#000000] text-white border-black'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Pengaturan Font Arab"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Jump to ayah dropdown */}
          {surahData && surahData.jumlahAyat > 1 && (
            <select
              aria-label="Pilih nomor ayat untuk loncat langsung"
              onChange={(e) => handleJumpToAyah(parseInt(e.target.value, 10))}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A6FF]"
              defaultValue={initialAyahNumber || 1}
            >
              <option value="" disabled>
                Lompat Ayat
              </option>
              {Array.from({ length: surahData.jumlahAyat }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Ayat {num}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Floating Font Control Drawer if opened */}
      {showFontControl && (
        <div className="p-4 bg-[#FFFFFF] border border-[#1352B9] rounded-2xl shadow-lg space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#031B4A] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#1352B9]" /> Pengaturan Tipografi Pembaca
            </span>
            <button
              onClick={() => setShowFontControl(false)}
              className="text-xs text-slate-400 hover:text-black font-semibold"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Font Size */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Ukuran Font Arab:</span>
                <span className="font-bold text-[#031B4A]">{settings.arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min={20}
                max={44}
                step={2}
                value={settings.arabicFontSize}
                onChange={(e) => updateSettings({ arabicFontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-[#00A6FF] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Line Height */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Jarak Baris (Line Height):</span>
                <span className="font-bold text-[#031B4A]">{settings.arabicLineHeight}</span>
              </div>
              <input
                type="range"
                min={1.8}
                max={3.0}
                step={0.1}
                value={settings.arabicLineHeight}
                onChange={(e) => updateSettings({ arabicLineHeight: parseFloat(e.target.value) })}
                className="w-full accent-[#00A6FF] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading & Error States */}
      {isLoading && (
        <LoadingState
          message={`Memuat Surat ke-${surahNumber}...`}
          subMessage="Mengambil teks Arab, nomor ayat, dan terjemahan resmi"
        />
      )}

      {error && (
        <ErrorState
          title="Gagal Memuat Surat"
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            quranApi
              .getSurahDetail(surahNumber)
              .then(setSurahData)
              .catch((e) => setError(e.message))
              .finally(() => setIsLoading(false));
          }}
        />
      )}

      {!isLoading && !error && surahData && (
        <div className="space-y-6">
          {/* Surah Header Card */}
          <div className="p-6 sm:p-8 bg-[#031B4A] text-white rounded-3xl border border-[#022478] shadow-sm text-center relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <span className="inline-block px-3 py-1 bg-[#022478] text-[#00A6FF] rounded-full text-xs font-bold border border-[#1352B9]">
                Surat ke-{surahData.nomor} • {surahData.tempatTurun} • {surahData.jumlahAyat} Ayat
              </span>

              {/* Arabic Surah Title */}
              <h2
                dir="rtl"
                lang="ar"
                className="font-arabic text-4xl sm:text-5xl font-bold text-[#FFFFFF] py-1"
              >
                {surahData.nama}
              </h2>

              {/* Latin Name & Meaning */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {surahData.namaLatin}
              </h3>
              <p className="text-sm text-[#C2DFF3]">
                Artinya: <span className="font-semibold text-white">"{surahData.arti}"</span>
              </p>

              {/* Controls inside Surah Header: Audio Full and Info */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={handlePlayFullSurah}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#000000] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#1352B9] transition-colors focus:ring-2 focus:ring-[#00A6FF]"
                >
                  {isFullSurahPlaying ? (
                    <>
                      <Pause className="w-4 h-4 text-[#00A6FF]" />
                      <span>Jeda Murottal Surat</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-[#00A6FF]" />
                      <span>Putar Audio Full Surat</span>
                    </>
                  )}
                </button>

                {surahData.deskripsi && (
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#022478] text-[#C2DFF3] hover:text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Info className="w-4 h-4 text-[#00A6FF]" />
                    <span>{showDescription ? 'Tutup Pengantar' : 'Pengantar Surat'}</span>
                  </button>
                )}
              </div>

              {/* Description Accordion */}
              {showDescription && (
                <div
                  className="mt-4 p-4 bg-[#022478]/80 text-[#C2DFF3] text-xs leading-relaxed text-left rounded-2xl border border-[#1352B9] max-h-48 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: surahData.deskripsi }}
                />
              )}
            </div>
          </div>

          {/* Sacred Basmalah Header (for surahs 2-114 except 9) */}
          {showBasmalahHeader && (
            <div className="py-6 px-4 text-center bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl sm:text-3xl text-[#031B4A] font-bold"
              >
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <p className="text-xs text-slate-500 mt-2 font-sans">
                Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
              </p>
            </div>
          )}

          {/* Ayah Cards List */}
          <div className="space-y-4">
            {surahData.ayat.map((ayah) => (
              <AyahCard
                key={ayah.nomorAyat}
                ayah={ayah}
                surahNumber={surahData.nomor}
                surahNameLatin={surahData.namaLatin}
                surahNameArabic={surahData.nama}
                onOpenTafsir={(num) => {
                  setSelectedTafsirAyah(num);
                  setTafsirModalOpen(true);
                }}
                onOpenNote={(num) => {
                  setSelectedNoteAyah(num);
                  setNoteModalOpen(true);
                }}
                onPlayAyah={handleToggleAyahAudio}
                isHighlighted={highlightedAyah === ayah.nomorAyat}
              />
            ))}
          </div>

          {/* Bottom Surah Navigation (Previous & Next Surah) */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {surahData.suratSebelumnya ? (
              <button
                onClick={() => onNavigateSurah(surahData.suratSebelumnya ? surahData.suratSebelumnya.nomor : 1, 1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-[#1352B9]" />
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Surat Sebelumnya</span>
                  <span className="text-sm font-bold text-[#000000] group-hover:text-[#1352B9]">
                    {surahData.suratSebelumnya.namaLatin} ({surahData.suratSebelumnya.nomor})
                  </span>
                </div>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Ke Atas</span>
            </button>

            {surahData.suratSelanjutnya ? (
              <button
                onClick={() => onNavigateSurah(surahData.suratSelanjutnya ? surahData.suratSelanjutnya.nomor : 1, 1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-right transition-all group"
              >
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Surat Selanjutnya</span>
                  <span className="text-sm font-bold text-[#000000] group-hover:text-[#1352B9]">
                    {surahData.suratSelanjutnya.namaLatin} ({surahData.suratSelanjutnya.nomor})
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1352B9]" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}

      {/* Tafsir Modal */}
      {surahData && (
        <TafsirPanel
          isOpen={tafsirModalOpen}
          surahNumber={surahData.nomor}
          initialAyahNumber={selectedTafsirAyah}
          totalAyat={surahData.jumlahAyat}
          surahNameLatin={surahData.namaLatin}
          onClose={() => setTafsirModalOpen(false)}
        />
      )}

      {/* Note Modal */}
      {surahData && (
        <NoteModal
          isOpen={noteModalOpen}
          surahNumber={surahData.nomor}
          surahNameLatin={surahData.namaLatin}
          ayahNumber={selectedNoteAyah}
          onClose={() => setNoteModalOpen(false)}
        />
      )}
    </div>
  );
};
