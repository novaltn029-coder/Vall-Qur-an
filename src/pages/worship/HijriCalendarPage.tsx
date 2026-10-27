import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sparkles,
  Sliders,
  Clock,
  RotateCcw
} from 'lucide-react';
import {
  hijriCalendarService,
  HIJRI_MONTHS,
  ISLAMIC_HOLIDAYS
} from '../../services/hijriCalendarService';
import { HijriDateInfo } from '../../types/worship';

interface HijriCalendarPageProps {
  onOpenPrayerTimes: () => void;
}

export const HijriCalendarPage: React.FC<HijriCalendarPageProps> = ({
  onOpenPrayerTimes
}) => {
  const [currentDisplayDate, setCurrentDisplayDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [adjustmentDays, setAdjustmentDays] = useState<number>(() =>
    hijriCalendarService.getAdjustmentDays()
  );
  const [showAdjustmentPanel, setShowAdjustmentPanel] = useState<boolean>(false);

  const displayYear = currentDisplayDate.getFullYear();
  const displayMonth = currentDisplayDate.getMonth();

  const monthGrid = hijriCalendarService.generateMonthGrid(displayYear, displayMonth);
  const selectedHijriInfo = hijriCalendarService.getHijriDate(selectedDate, adjustmentDays);

  const handlePrevMonth = () => {
    setCurrentDisplayDate(new Date(displayYear, displayMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDisplayDate(new Date(displayYear, displayMonth + 1, 1));
  };

  const handleResetToday = () => {
    const today = new Date();
    setCurrentDisplayDate(today);
    setSelectedDate(today);
  };

  const handleSaveAdjustment = (days: number) => {
    setAdjustmentDays(days);
    hijriCalendarService.setAdjustmentDays(days);
  };

  const monthNameGregorian = currentDisplayDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });

  const dayHeaders = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Title & Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Kalender Hijriah &amp; Masehi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Integrasi penanggalan Islam, puasa sunnah, dan hari-hari besar Islam.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdjustmentPanel(!showAdjustmentPanel)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
              showAdjustmentPanel
                ? 'bg-[#000000] text-white border-black'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Koreksi Rukyat ({adjustmentDays > 0 ? `+${adjustmentDays}` : adjustmentDays} hari)</span>
          </button>

          <button
            onClick={handleResetToday}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-xs font-semibold"
            title="Kembali ke Hari Ini"
          >
            Hari Ini
          </button>
        </div>
      </div>

      {/* Rukyat Adjustment Drawer if opened */}
      {showAdjustmentPanel && (
        <div className="p-4 bg-white border border-[#1352B9] rounded-2xl shadow-sm space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#031B4A] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#1352B9]" /> Penyesuaian Hisab / Hasil Sidang Isbat
            </h4>
            <button
              onClick={() => setShowAdjustmentPanel(false)}
              className="text-xs text-slate-400 hover:text-black font-semibold"
            >
              Tutup
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Perbedaan penanggalan Hijriah dapat terjadi sesuai kriteria imkanur rukyat pemerintah atau ormas Islam. Anda dapat memajukan atau memundurkan tanggal:
          </p>
          <div className="flex flex-wrap gap-2">
            {[-2, -1, 0, 1, 2].map((val) => (
              <button
                key={val}
                onClick={() => handleSaveAdjustment(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  adjustmentDays === val
                    ? 'bg-[#000000] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {val === 0 ? 'Standar (0 hari)' : `${val > 0 ? `+${val}` : val} hari`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Date Detail Panel */}
      <div className="p-5 sm:p-6 bg-[#031B4A] text-white rounded-3xl border border-[#022478] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold px-2.5 py-1 bg-[#022478] text-[#00A6FF] rounded-lg border border-[#1352B9] inline-block mb-1">
            Tanggal Dipilih
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {selectedHijriInfo.formatted}
          </h3>
          <p className="text-xs text-[#C2DFF3] flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-[#00A6FF]" />
            <span>
              {selectedDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </p>

          {/* Holiday or Sunnah fasting label */}
          {(selectedHijriInfo.holiday || selectedHijriInfo.isAyyamulBidh) && (
            <div className="pt-2 flex flex-wrap gap-2">
              {selectedHijriInfo.holiday && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1352B9] text-white text-xs font-bold rounded-xl shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{selectedHijriInfo.holiday}</span>
                </span>
              )}
              {selectedHijriInfo.isAyyamulBidh && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white text-xs font-medium rounded-xl">
                  Jadwal Puasa Ayyamul Bidh
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onOpenPrayerTimes}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#000000] text-white text-xs sm:text-sm font-bold rounded-2xl hover:bg-[#1352B9] transition-colors self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Clock className="w-4 h-4 text-[#00A6FF]" />
          <span>Lihat Jadwal Salat</span>
        </button>
      </div>

      {/* Official Government Isbat Disclaimer */}
      <div className="p-3.5 bg-blue-50/70 border border-[#C2DFF3] rounded-2xl flex items-start gap-2.5 text-xs text-[#031B4A]">
        <Moon className="w-4 h-4 text-[#1352B9] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-[#000000]">Ketetapan Resmi Kementerian Agama RI:</strong>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Kalender di atas dihitung dengan hisab astronomis standar Indonesia (MABIMS). Khusus penentuan awal <strong>1 Ramadan</strong>, <strong>1 Syawwal (Idulfitri)</strong>, dan <strong>10 Dzulhijjah (Iduladha)</strong>, umat Islam di Indonesia tetap mengacu pada hasil Sidang Isbat resmi Kementerian Agama RI melalui ru&apos;yatul hilal.
          </p>
        </div>
      </div>

      {/* Month Navigator Header */}
      <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between shadow-2xs">
        <button
          onClick={handlePrevMonth}
          aria-label="Bulan sebelumnya"
          className="p-2 text-slate-400 hover:text-black rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold text-[#000000]">
            {monthNameGregorian}
          </h3>
          <p className="text-xs text-[#1352B9] font-semibold">
            {selectedHijriInfo.monthName} {selectedHijriInfo.year} H
          </p>
        </div>

        <button
          onClick={handleNextMonth}
          aria-label="Bulan berikutnya"
          className="p-2 text-slate-400 hover:text-black rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {dayHeaders.map((dh, i) => (
            <div
              key={dh}
              className={`text-[11px] sm:text-xs font-bold py-1 ${
                i === 0 ? 'text-red-600' : i === 5 ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {dh}
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {monthGrid.map((dayItem, idx) => {
            if (!dayItem) {
              return <div key={`empty-${idx}`} className="h-14 sm:h-20 bg-slate-50/50 rounded-xl" />;
            }

            const isSelected = hijriCalendarService.isSameDay(dayItem.gregorianDate, selectedDate);
            const isToday = dayItem.isToday;
            const hasHoliday = !!dayItem.hijriInfo.holiday;
            const isAyyamulBidh = !!dayItem.hijriInfo.isAyyamulBidh;

            return (
              <button
                key={`day-${dayItem.gregorianDay}`}
                onClick={() => setSelectedDate(dayItem.gregorianDate)}
                className={`h-14 sm:h-20 p-1 sm:p-2 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#000000] text-white border-black shadow-sm ring-2 ring-[#00A6FF]'
                    : isToday
                    ? 'bg-[#C2DFF3]/35 border-[#00A6FF]'
                    : 'bg-white border-slate-100 hover:border-[#1352B9] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-bold font-mono ${
                      isSelected ? 'text-white' : isToday ? 'text-[#1352B9]' : 'text-slate-900'
                    }`}
                  >
                    {dayItem.gregorianDay}
                  </span>

                  {/* Hijri day badge */}
                  <span
                    className={`text-[10px] sm:text-xs font-bold font-arabic ${
                      isSelected ? 'text-[#00A6FF]' : 'text-slate-400'
                    }`}
                  >
                    {dayItem.hijriInfo.day}
                  </span>
                </div>

                {/* Micro indicator dots */}
                <div className="flex items-center gap-1 truncate">
                  {hasHoliday && (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
                      title={dayItem.hijriInfo.holiday}
                    />
                  )}
                  {isAyyamulBidh && (
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                      title="Puasa Ayyamul Bidh"
                    />
                  )}
                  <span
                    className={`text-[9px] sm:text-[10px] truncate ${
                      isSelected ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {dayItem.hijriInfo.monthName.slice(0, 5)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Islamic Holidays List */}
      <section className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-[#1352B9]" />
          <h3 className="text-base font-bold text-[#031B4A]">
            Daftar Hari Besar Islam (Kalender Hijriah)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ISLAMIC_HOLIDAYS.map((h, i) => (
            <div
              key={`${h.name}-${i}`}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center shrink-0 font-bold text-xs">
                {h.hijriDay}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#000000]">{h.name}</h4>
                <p className="text-[11px] text-[#1352B9] font-medium">
                  {h.hijriDay} {HIJRI_MONTHS.find((m) => m.id === h.hijriMonth)?.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  {h.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
