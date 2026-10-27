import React from 'react';
import { SurahSummary } from '../../types/quran';

interface SurahCardProps {
  surah: SurahSummary;
  onSelect: (surahNumber: number) => void;
  isLastRead?: boolean;
}

export const SurahCard: React.FC<SurahCardProps> = ({ surah, onSelect, isLastRead }) => {
  return (
    <div
      onClick={() => onSelect(surah.nomor)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(surah.nomor);
        }
      }}
      className={`relative group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
        isLastRead
          ? 'bg-[#C2DFF3]/25 border-[#1352B9] shadow-xs'
          : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#1352B9] hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Number + Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#FFFFFF] text-sm font-bold flex items-center justify-center shrink-0 group-hover:bg-[#000000] transition-colors">
            {surah.nomor}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#000000] group-hover:text-[#1352B9] transition-colors truncate">
                {surah.namaLatin}
              </h3>
              {isLastRead && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1352B9] text-white rounded">
                  Terakhir
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 truncate mt-0.5">
              {surah.arti} • {surah.jumlahAyat} Ayat • {surah.tempatTurun}
            </p>
          </div>
        </div>

        {/* Right: Arabic Name */}
        <div className="text-right shrink-0">
          <span
            dir="rtl"
            lang="ar"
            className="font-arabic text-xl sm:text-2xl font-bold text-[#031B4A] group-hover:text-[#1352B9] transition-colors leading-normal"
          >
            {surah.nama}
          </span>
        </div>
      </div>
    </div>
  );
};
