import React, { useState } from 'react';
import { Ayah } from '../../types/quran';
import { ArabicText } from './ArabicText';
import { TranslationText } from './TranslationText';
import { BookmarkButton } from './BookmarkButton';
import { useAudio } from '../../context/AudioContext';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/app.config';
import {
  Play,
  Pause,
  Copy,
  Share2,
  BookOpen,
  FileEdit,
  Check,
  Volume2
} from 'lucide-react';

interface AyahCardProps {
  ayah: Ayah;
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  onOpenTafsir: (ayahNumber: number) => void;
  onOpenNote: (ayahNumber: number) => void;
  onPlayAyah?: (ayahNumber: number) => void;
  isHighlighted?: boolean;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  surahNumber,
  surahNameLatin,
  surahNameArabic,
  onOpenTafsir,
  onOpenNote,
  onPlayAyah,
  isHighlighted = false
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { settings, showToast, getNoteForAyah } = useApp();
  const [copied, setCopied] = useState(false);

  const existingNote = getNoteForAyah(surahNumber, ayah.nomorAyat);

  const isCurrentPlaying =
    currentTrack?.surahNumber === surahNumber &&
    currentTrack?.ayahNumber === ayah.nomorAyat &&
    isPlaying;

  const handlePlayAyah = () => {
    if (onPlayAyah) {
      onPlayAyah(ayah.nomorAyat);
      return;
    }

    if (isCurrentPlaying) {
      togglePlay();
      return;
    }

    const qariId = settings.defaultQariId || '05';
    const audioUrl = ayah.audio[qariId] || ayah.audio['05'] || ayah.audio['01'];
    const qariInfo = APP_CONFIG.qariList.find((q) => q.id === qariId) || APP_CONFIG.qariList[4];

    if (!audioUrl) {
      showToast('Audio untuk ayat ini belum tersedia dari server.', 'warning');
      return;
    }

    playTrack({
      surahNumber,
      surahNameLatin,
      ayahNumber: ayah.nomorAyat,
      qariId,
      qariName: qariInfo.name,
      audioUrl
    });
  };

  const handleCopy = async () => {
    const textToCopy = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n\n(QS. ${surahNameLatin} [${surahNumber}]: ${ayah.nomorAyat})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast('Ayat dan terjemahan disalin ke clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Gagal menyalin teks.', 'error');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `QS. ${surahNameLatin} [${surahNumber}]: ${ayah.nomorAyat}`,
      text: `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n\n(QS. ${surahNameLatin} [${surahNumber}]: ${ayah.nomorAyat})\nDibaca di val-qur'an`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <article
      id={`ayah-${ayah.nomorAyat}`}
      className={`group p-4 md:p-6 rounded-2xl border transition-all duration-300 scroll-mt-28 ${
        isCurrentPlaying
          ? 'bg-[#C2DFF3]/25 border-[#00A6FF] ring-2 ring-[#00A6FF] shadow-sm'
          : isHighlighted
          ? 'bg-[#C2DFF3]/30 border-[#00A6FF]'
          : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
      }`}
    >
      {/* Top Header of Ayah Card */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        {/* Ayah number badge */}
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#031B4A] text-[#FFFFFF] text-xs font-bold flex items-center justify-center shrink-0">
            {ayah.nomorAyat}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {surahNameLatin} : {ayah.nomorAyat}
          </span>
          {isCurrentPlaying && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00A6FF] text-[#031B4A] animate-pulse">
              <Volume2 className="w-3 h-3" /> Memutar
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Audio play per ayah */}
          <button
            onClick={handlePlayAyah}
            aria-label={isCurrentPlaying ? 'Jeda audio ayat' : 'Putar audio ayat'}
            className={`p-2 rounded-xl transition-colors ${
              isCurrentPlaying
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-slate-500 hover:text-[#1352B9] hover:bg-slate-100'
            }`}
            title="Putar murottal ayat ini"
          >
            {isCurrentPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Tafsir */}
          <button
            onClick={() => onOpenTafsir(ayah.nomorAyat)}
            aria-label="Lihat tafsir Kemenag ayat ini"
            className="p-2 rounded-xl text-slate-500 hover:text-[#1352B9] hover:bg-slate-100 transition-colors"
            title="Tafsir Kemenag RI"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Note */}
          <button
            onClick={() => onOpenNote(ayah.nomorAyat)}
            aria-label="Catatan pribadi untuk ayat ini"
            className={`p-2 rounded-xl transition-colors ${
              existingNote
                ? 'text-[#1352B9] bg-[#C2DFF3]/50'
                : 'text-slate-500 hover:text-[#1352B9] hover:bg-slate-100'
            }`}
            title={existingNote ? 'Lihat/Edit Catatan' : 'Tambah Catatan'}
          >
            <FileEdit className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <BookmarkButton
            surahNumber={surahNumber}
            surahNameLatin={surahNameLatin}
            surahNameArabic={surahNameArabic}
            ayahNumber={ayah.nomorAyat}
            arabicSnippet={ayah.teksArab}
            translationSnippet={ayah.teksIndonesia}
          />

          {/* Copy */}
          <button
            onClick={handleCopy}
            aria-label="Salin ayat"
            className="p-2 rounded-xl text-slate-500 hover:text-[#031B4A] hover:bg-slate-100 transition-colors"
            title="Salin teks Arab & Terjemahan"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Bagikan ayat"
            className="p-2 rounded-xl text-slate-500 hover:text-[#031B4A] hover:bg-slate-100 transition-colors"
            title="Bagikan ayat"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic text with authentic vocalization */}
      <div className="py-2">
        <ArabicText text={ayah.teksArab} />
      </div>

      {/* Translation & Transliteration */}
      <TranslationText
        translation={ayah.teksIndonesia}
        transliteration={ayah.teksLatin}
      />

      {/* Personal Note Tag if exists */}
      {existingNote && (
        <div className="mt-4 p-3 bg-[#C2DFF3]/30 border-l-3 border-[#1352B9] rounded-r-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#031B4A] flex items-center gap-1">
              <FileEdit className="w-3 h-3 text-[#1352B9]" /> Catatan Anda
            </span>
            <span className="text-[10px] text-slate-500">
              {new Date(existingNote.updatedAt).toLocaleDateString('id-ID')}
            </span>
          </div>
          <p className="text-xs text-slate-700 whitespace-pre-wrap">{existingNote.content}</p>
        </div>
      )}
    </article>
  );
};
