import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Copy,
  Share2,
  Check,
  Type,
  BookOpen,
  Sparkles,
  Play,
  Square,
  Volume2
} from 'lucide-react';
import { duaService, AUTHENTIC_DUAS } from '../../services/duaService';
import { duaAudioService } from '../../services/duaAudioService';
import { useApp } from '../../context/AppContext';

interface DuaReaderPageProps {
  duaId: string;
  onBack: () => void;
  onNavigateDua: (duaId: string) => void;
}

export const DuaReaderPage: React.FC<DuaReaderPageProps> = ({
  duaId,
  onBack,
  onNavigateDua
}) => {
  const { showToast } = useApp();
  const [fontSize, setFontSize] = useState<number>(28);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() =>
    duaService.isDuaBookmarked(duaId)
  );

  const dua = duaService.getDuaById(duaId) || AUTHENTIC_DUAS[0];
  const audioEntry = duaAudioService.getAudioEntry(dua.id);

  useEffect(() => {
    const unsub = duaAudioService.subscribe((st) => {
      setIsPlaying(st.isPlaying && st.duaId === dua.id);
    });
    return () => {
      unsub();
      duaAudioService.stop();
    };
  }, [dua.id]);

  const currentIndex = AUTHENTIC_DUAS.findIndex((d) => d.id === dua.id);
  const prevDua = currentIndex > 0 ? AUTHENTIC_DUAS[currentIndex - 1] : null;
  const nextDua =
    currentIndex < AUTHENTIC_DUAS.length - 1 ? AUTHENTIC_DUAS[currentIndex + 1] : null;

  const handleToggleBookmark = () => {
    const newState = duaService.toggleBookmarkDua(dua.id);
    setIsBookmarked(newState);
    showToast(
      newState ? 'Do\'a ditambahkan ke bookmark.' : 'Do\'a dihapus dari bookmark.',
      'info'
    );
  };

  const handleCopy = async () => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n"${dua.translation}"\n\nSumber: ${dua.reference}\nDibaca di val-qur'an`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Teks do\'a disalin ke clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Gagal menyalin teks do\'a.', 'error');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: dua.title,
      text: `${dua.title}\n\n${dua.arabic}\n\n"${dua.translation}"\n\nSumber: ${dua.reference}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          aria-label="Kembali ke daftar do'a"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#031B4A] hover:text-[#1352B9] transition-colors p-1.5 rounded-xl hover:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Do'a</span>
        </button>

        {/* Font size buttons */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          <button
            onClick={() => setFontSize((s) => Math.max(20, s - 2))}
            aria-label="Kecilkan teks"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((s) => Math.min(44, s + 2))}
            aria-label="Besarkan teks"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            A+
          </button>
        </div>
      </div>

      {/* Main Dua Card */}
      <article className="p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-3xl shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#C2DFF3] text-[#031B4A] mb-2 inline-block">
              {dua.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#000000] leading-snug">
              {dua.title}
            </h1>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleToggleBookmark}
              aria-label={isBookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
              className={`p-2.5 rounded-xl transition-colors ${
                isBookmarked
                  ? 'bg-[#C2DFF3] text-[#031B4A]'
                  : 'text-slate-400 hover:text-black hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              aria-label="Salin do'a"
              className="p-2.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              aria-label="Bagikan do'a"
              className="p-2.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Player Bar */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => {
                if (isPlaying) {
                  duaAudioService.stop();
                  setIsPlaying(false);
                } else {
                  duaAudioService.playDua(dua.id, dua.arabic).then((res) => {
                    setIsPlaying(res);
                  });
                }
              }}
              className={`p-2 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                isPlaying
                  ? 'bg-red-600 text-white'
                  : 'bg-[#000000] text-[#00A6FF] hover:bg-[#1352B9] hover:text-white'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#031B4A] block truncate">
                {isPlaying ? 'Memutar Audio / Pelafalan Do\'a' : 'Dengarkan Pelafalan'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {audioEntry?.status === 'verified_remote'
                  ? `Qari: ${audioEntry.qariName || 'Mishary Rashid'} (Rekaman Terverifikasi)`
                  : 'Bantuan Sintesis Suara Bahasa Arab'}
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C2DFF3] text-[#031B4A] shrink-0">
            {audioEntry?.status === 'verified_remote' ? 'Audio MP3' : 'Audio Sintesis'}
          </span>
        </div>

        {/* Arabic Text */}
        <div className="py-4">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-[#000000] text-right select-text leading-relaxed tracking-normal"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
          >
            {dua.arabic}
          </p>
        </div>

        {/* Transliteration */}
        {dua.transliteration && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-[#1352B9] uppercase tracking-wide block mb-1">
              Pelafalan Transliterasi:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 italic font-sans leading-relaxed">
              {dua.transliteration}
            </p>
          </div>
        )}

        {/* Translation */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Terjemahan:
          </span>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
            "{dua.translation}"
          </p>
        </div>

        {/* Reference & Benefits */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <BookOpen className="w-3.5 h-3.5 text-[#1352B9]" />
            <span>
              Rujukan Sanad: <strong>{dua.reference}</strong>
            </span>
          </div>

          {dua.benefits && (
            <div className="p-3 bg-[#C2DFF3]/30 border border-[#C2DFF3] rounded-xl text-[#031B4A] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#00A6FF] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="block mb-0.5">Keutamaan &amp; Faedah:</strong>
                {dua.benefits}
              </p>
            </div>
          )}
        </div>
      </article>

      {/* Prev / Next Dua Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {prevDua ? (
          <button
            onClick={() => onNavigateDua(prevDua.id)}
            className="inline-flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block">Do'a Sebelumnya</span>
              <span className="text-xs font-bold text-[#000000] truncate block max-w-[150px] sm:max-w-[200px]">
                {prevDua.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextDua ? (
          <button
            onClick={() => onNavigateDua(nextDua.id)}
            className="inline-flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-right transition-all"
          >
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block">Do'a Selanjutnya</span>
              <span className="text-xs font-bold text-[#000000] truncate block max-w-[150px] sm:max-w-[200px]">
                {nextDua.title}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
