import React from 'react';
import { Calendar, Moon, Sparkles } from 'lucide-react';
import { HijriDateInfo } from '../../types/worship';

interface HijriDateHeaderProps {
  hijriInfo: HijriDateInfo;
  className?: string;
}

export const HijriDateHeader: React.FC<HijriDateHeaderProps> = ({ hijriInfo, className = '' }) => {
  const gregorianFormatted = hijriInfo.gregorianDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div
      className={`p-4 sm:p-5 bg-[#031B4A] text-white rounded-2xl border border-[#022478] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#00A6FF]/20 text-[#00A6FF] flex items-center justify-center shrink-0">
          <Moon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {hijriInfo.formatted}
            </h3>
            <span
              dir="rtl"
              lang="ar"
              className="font-arabic text-xs sm:text-sm text-[#00A6FF] hidden sm:inline"
            >
              {hijriInfo.monthNameArabic}
            </span>
          </div>
          <p className="text-xs text-[#C2DFF3] flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#00A6FF]" />
            <span>{gregorianFormatted}</span>
          </p>
        </div>
      </div>

      {/* Holiday / Sunnah Fasting Badge */}
      {(hijriInfo.holiday || hijriInfo.isAyyamulBidh) && (
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {hijriInfo.holiday && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1352B9] text-white rounded-xl text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{hijriInfo.holiday}</span>
            </span>
          )}
          {hijriInfo.isAyyamulBidh && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 text-white rounded-xl text-xs font-medium">
              Puasa Ayyamul Bidh
            </span>
          )}
        </div>
      )}
    </div>
  );
};
