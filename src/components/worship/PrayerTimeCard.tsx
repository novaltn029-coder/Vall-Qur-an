import React from 'react';
import { Bell, BellOff, Clock } from 'lucide-react';
import { PrayerName } from '../../types/worship';

interface PrayerTimeCardProps {
  prayerKey: PrayerName;
  name: string;
  arabicName: string;
  timeString: string;
  isNext?: boolean;
  isCurrent?: boolean;
  isPassed?: boolean;
  isNotificationActive?: boolean;
  onToggleNotification?: (prayerKey: PrayerName) => void;
}

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  prayerKey,
  name,
  arabicName,
  timeString,
  isNext = false,
  isCurrent = false,
  isPassed = false,
  isNotificationActive = true,
  onToggleNotification
}) => {
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        isNext
          ? 'bg-[#C2DFF3]/35 border-[#00A6FF] shadow-xs ring-2 ring-[#00A6FF]'
          : isCurrent
          ? 'bg-emerald-50/50 border-emerald-400'
          : isPassed
          ? 'bg-slate-50/80 border-slate-200 opacity-75'
          : 'bg-white border-[#E2E8F0] hover:border-slate-300'
      }`}
    >
      {/* Left: Indicator & Labels */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
            isNext
              ? 'bg-[#000000] text-[#00A6FF]'
              : isCurrent
              ? 'bg-emerald-600 text-white'
              : 'bg-[#031B4A] text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-[#000000] truncate">{name}</h4>
            {isNext && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00A6FF] text-[#031B4A] uppercase tracking-wide">
                Selanjutnya
              </span>
            )}
            {isCurrent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wide">
                Sekarang
              </span>
            )}
          </div>
          <span
            dir="rtl"
            lang="ar"
            className="font-arabic text-sm text-[#031B4A] block mt-0.5"
          >
            {arabicName}
          </span>
        </div>
      </div>

      {/* Right: Time string & Notification toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xl sm:text-2xl font-bold font-mono text-[#000000]">
          {timeString}
        </span>

        {onToggleNotification && prayerKey !== 'sunrise' && prayerKey !== 'imsak' && (
          <button
            onClick={() => onToggleNotification(prayerKey)}
            aria-label={`Ubah pengingat adzan ${name}`}
            className={`p-2 rounded-xl transition-colors ${
              isNotificationActive
                ? 'bg-[#C2DFF3] text-[#031B4A] hover:bg-[#1352B9] hover:text-white'
                : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isNotificationActive ? 'Pengingat aktif' : 'Pengingat dimatikan'}
          >
            {isNotificationActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
