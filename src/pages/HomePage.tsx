import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../config/app.config';
import {
  PRAYER_SCHEDULE,
  PRAYER_LIST,
  calculateNextPrayerCountdown,
  PrayerCountdownState
} from '../config/prayerConfig';
import { hijriCalendarService } from '../services/hijriCalendarService';
import { AUTHENTIC_DUAS } from '../services/duaService';
import {
  BookOpen,
  Search,
  Bookmark,
  Clock,
  Compass,
  Calendar,
  Smartphone,
  Download,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';
import heroMosqueImg from '../assets/images/blue_mosque_hero_1793083939480.jpg';

interface HomePageProps {
  onNavigate: (tab: string, params?: { surah?: number; ayah?: number; duaId?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const {
    lastRead,
    tilawahProgress,
    bookmarks,
    settings,
    isInstallable,
    promptInstall,
    openInstallModal,
    isStandalone
  } = useApp();

  // Dynamic countdown state
  const [countdownState, setCountdownState] = useState<PrayerCountdownState>(() =>
    calculateNextPrayerCountdown()
  );

  // Live timer interval to update countdown every second in Asia/Jakarta timezone
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownState(calculateNextPrayerCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tilawah Reading Progress calculations
  const dailyTargetAyat = settings?.dailyTargetAyat || 10;
  const readAyat = tilawahProgress?.ayatReadToday || 0;
  // Compute percentage based on daily target or fallback starter indicator
  const progressPercent = readAyat > 0
    ? Math.min(100, Math.round((readAyat / dailyTargetAyat) * 100))
    : (lastRead ? 32 : 15);

  const displayReadPages = lastRead
    ? Math.max(1, Math.min(114, Math.round(lastRead.surahNumber * 0.9 + 5)))
    : 36;
  const totalQuranPages = 114;

  // Hijri calendar info
  const today = new Date();
  const hijriInfo = hijriCalendarService.getHijriDate(today);

  // Format Indonesian Gregorian Date
  const indonesianDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dayNameIndo = indonesianDays[today.getDay()];
  const monthNameIndo = indonesianMonths[today.getMonth()];
  const formattedGregorian = `${dayNameIndo}, ${today.getDate()} ${monthNameIndo} ${today.getFullYear()}`;

  // Current week date numbers for the weekly calendar widget
  const getWeekDays = () => {
    const days = [];
    const currentDayOfWeek = today.getDay(); // 0 is Sunday
    // Adjust to Monday = 0
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const shortDayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);
      const isToday = d.toDateString() === today.toDateString();
      days.push({
        label: shortDayLabels[i],
        dateNum: d.getDate(),
        isToday
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Featured Dua (e.g. Doa sebelum makan or first authentic dua)
  const featuredDua = AUTHENTIC_DUAS[0] || {
    id: 'dua-makan-sebelum',
    title: 'Do\'a Sebelum Makan',
    translation: 'Dengan menyebut nama Allah.'
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* ============================================================ */}
      {/* 1. HERO SECTION: Serene Mosque Visual & Islamic Reflection */}
      {/* ============================================================ */}
      <section className="relative rounded-3xl overflow-hidden border border-[#022478] shadow-md bg-[#031B4A] min-h-[220px] sm:min-h-[250px] flex items-center">
        {/* Background Image with Ambient Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroMosqueImg}
            alt="Masjid Biru val-qur'an"
            className="w-full h-full object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031B4A] via-[#031B4A]/90 to-[#022478]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031B4A] via-transparent to-transparent opacity-90" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl text-left">
            {/* Islamic Greeting */}
            <div className="flex items-center gap-1.5 text-white/95 text-xs sm:text-sm font-semibold tracking-wide">
              <span>Assalamu’alaikum</span>
            </div>
            <p className="text-xs sm:text-[13px] text-[#C2DFF3] mt-0.5 leading-relaxed">
              Semoga hari ini menjadi langkah baik menuju ridha-Nya. ✨
            </p>

            {/* Main Title */}
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white mt-3 tracking-tight leading-snug">
              Dekatkan Diri kepada Allah dengan{' '}
              <span className="text-[#00A6FF]">Al-Qur’an</span>
            </h2>

            {/* Main CTA Button: Lanjutkan Membaca */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={() =>
                  onNavigate('reader', {
                    surah: lastRead ? lastRead.surahNumber : 1,
                    ayah: lastRead ? lastRead.ayahNumber : 1
                  })
                }
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-[#00A6FF] text-[#031B4A] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#C2DFF3] active:scale-[0.98] transition-all shadow-md focus:ring-2 focus:ring-white"
              >
                <BookOpen className="w-4 h-4 text-[#031B4A]" />
                <span>Lanjutkan Membaca</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Sub-caption referencing exact last read surah & ayah */}
              <span className="text-xs text-[#C2DFF3] font-medium sm:ml-1">
                {lastRead
                  ? `Surat ${lastRead.surahNameLatin} • Ayat ${lastRead.ayahNumber}`
                  : 'Surat Al-Baqarah • Ayat 286'}
              </span>
            </div>
          </div>

          {/* Right Calligraphy Emblem Badge */}
          <div className="hidden sm:flex flex-col items-center justify-center p-4 rounded-2xl bg-[#031B4A]/60 border border-[#1352B9]/40 backdrop-blur-xs text-center shrink-0">
            <span className="font-arabic text-3xl font-bold text-white tracking-wide">
              القُرْآنُ الكَرِيم
            </span>
            <span className="text-[10px] tracking-widest text-[#C2DFF3] font-semibold uppercase mt-1">
              Al-Qur'an Petunjuk Hidup
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. READING PROGRESS CARD (Progres Tilawah) */}
      {/* ============================================================ */}
      <section aria-labelledby="reading-progress-heading">
        <div
          onClick={() => onNavigate('history')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
        >
          {/* Circular Progress Ring */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Track */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress Stroke */}
                <path
                  className="text-[#00A6FF]"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <BookOpen className="w-4 h-4 text-[#1352B9] mb-0.5" />
                <span className="text-xs font-bold text-[#000000]">{progressPercent}%</span>
              </div>
            </div>

            {/* Progress Information */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  id="reading-progress-heading"
                  className="text-sm sm:text-base font-bold text-[#000000]"
                >
                  Progres Tilawah
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dari {totalQuranPages} halaman
              </p>

              {/* Linear Progress Bar */}
              <div className="w-40 sm:w-60 bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#1352B9] to-[#00A6FF] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-1.5">
                <span className="text-[#00A6FF] font-bold">{displayReadPages}</span> / {totalQuranPages} halaman
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. QUICK ACCESS GRID (Akses Cepat — 8 Feature Icons) */}
      {/* ============================================================ */}
      <section aria-labelledby="quick-access-heading">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 id="quick-access-heading" className="text-base font-bold text-[#000000]">
            Akses Cepat
          </h3>
          <button
            onClick={() => onNavigate('worship')}
            className="text-xs font-semibold text-[#1352B9] hover:underline flex items-center gap-1"
          >
            <span>Semua Fitur</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* 1. Al-Qur'an */}
          <button
            onClick={() => onNavigate('surahs')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Al-Qur'an</span>
          </button>

          {/* 2. Kiblat */}
          <button
            onClick={() => onNavigate('qibla')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Kiblat</span>
          </button>

          {/* 3. Waktu Salat */}
          <button
            onClick={() => onNavigate('prayer-times')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Waktu Salat</span>
          </button>

          {/* 4. Adzan */}
          <button
            onClick={() => onNavigate('adhan-settings')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Adzan</span>
          </button>

          {/* 5. Do'a */}
          <button
            onClick={() => onNavigate('duas')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              {/* Praying hands SVG icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <path d="M12 18v3" />
                <path d="M8 15h8" />
                <path d="M9 18h6" />
                <path d="M6 11a6 6 0 0 0 12 0" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Do'a</span>
          </button>

          {/* 6. Tahlil */}
          <button
            onClick={() => onNavigate('tahlil')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              {/* Tasbih beaded necklace SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="16.5" cy="7" r="1.5" />
                <circle cx="19" cy="11.5" r="1.5" />
                <circle cx="17.5" cy="16" r="1.5" />
                <circle cx="13.5" cy="19" r="1.5" />
                <circle cx="10.5" cy="19" r="1.5" />
                <circle cx="6.5" cy="16" r="1.5" />
                <circle cx="5" cy="11.5" r="1.5" />
                <circle cx="7.5" cy="7" r="1.5" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Tahlil</span>
          </button>

          {/* 7. Kalender Hijriah */}
          <button
            onClick={() => onNavigate('hijri-calendar')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Kalender Hijriah</span>
          </button>

          {/* 8. Lainnya */}
          <button
            onClick={() => onNavigate('worship')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl transition-all group hover:shadow-xs min-h-[90px]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#000000] text-center">Lainnya</span>
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SURAT TERAKHIR DIBACA CARD */}
      {/* ============================================================ */}
      <section aria-labelledby="last-read-heading">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#031B4A] via-[#022478] to-[#1352B9] text-white p-5 border border-[#1352B9]/50 shadow-sm">
          {/* Subtle Islamic Quran Pattern watermark */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <BookOpen className="w-48 h-48 text-white" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Ornate Quran Cover Thumbnail */}
              <div className="w-14 h-18 rounded-xl bg-[#031B4A] border-2 border-[#00A6FF]/60 flex flex-col items-center justify-center shadow-md p-1 shrink-0">
                <div className="w-full h-full border border-white/20 rounded-lg flex flex-col items-center justify-center p-1 text-center bg-[#022478]">
                  <span className="font-arabic text-sm text-[#00A6FF]">القرآن</span>
                  <span className="text-[8px] text-white/70 tracking-tighter mt-0.5">AL-QUR'AN</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#C2DFF3] uppercase tracking-wider block">
                  Surat Terakhir Dibaca
                </span>
                <h4 id="last-read-heading" className="text-lg font-bold text-white mt-0.5">
                  {lastRead ? lastRead.surahNameLatin : 'Al-Baqarah'}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#C2DFF3] mt-0.5">
                  <span className="font-arabic text-sm text-white/90">
                    {lastRead?.surahNameArabic || 'سورة البقرة'}
                  </span>
                  <span>•</span>
                  <span>Ayat {lastRead ? lastRead.ayahNumber : '286'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                onNavigate('reader', {
                  surah: lastRead ? lastRead.surahNumber : 2,
                  ayah: lastRead ? lastRead.ayahNumber : 286
                })
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A6FF] text-[#031B4A] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#C2DFF3] transition-all shadow-sm shrink-0"
            >
              <span>Lanjutkan Membaca</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. 2-COLUMN WIDGETS: PRAYER TIMES + HIJRI CALENDAR */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* ========================================== */}
        {/* WAKTU SALAT HARI INI (5 WAKTU + COUNTDOWN) */}
        {/* ========================================== */}
        <section
          aria-labelledby="prayer-times-widget-heading"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3
                id="prayer-times-widget-heading"
                className="text-sm sm:text-base font-bold text-[#000000]"
              >
                Waktu Salat Hari Ini
              </h3>
              <button
                onClick={() => onNavigate('prayer-times')}
                className="text-xs font-semibold text-[#1352B9] hover:underline flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3.5">
              {PRAYER_SCHEDULE.regionName}
            </p>

            {/* Prayer Times Row Pills */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {PRAYER_LIST.map((p) => {
                const isNext = countdownState.nextPrayer.key === p.key;
                return (
                  <div
                    key={p.key}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-center transition-all ${
                      isNext
                        ? 'bg-[#EBF5FF] border-[#00A6FF] ring-2 ring-[#00A6FF]/30 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <span className="text-sm mb-1">{p.icon}</span>
                    <span
                      className={`text-[11px] ${
                        isNext ? 'font-bold text-[#1352B9]' : 'font-medium text-slate-500'
                      }`}
                    >
                      {p.name}
                    </span>
                    <span
                      className={`text-xs mt-0.5 font-mono ${
                        isNext ? 'font-extrabold text-[#000000]' : 'font-bold text-slate-700'
                      }`}
                    >
                      {p.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Next Prayer Countdown Bar */}
          <div
            onClick={() => onNavigate('prayer-times')}
            className="mt-4 p-3.5 bg-[#F8FAFC] border border-slate-200 hover:border-[#00A6FF] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#031B4A] text-[#00A6FF] flex items-center justify-center shrink-0">
                {/* Mosque icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3a2 2 0 0 1 2 2c0 1.5-2 3-2 3s-2-1.5-2-3a2 2 0 0 1 2-2z" />
                  <path d="M4 21V11l4-3v13M20 21V11l-4-3v13M8 21V11a4 4 0 0 1 8 0v10" />
                </svg>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">
                  Menuju {countdownState.nextPrayer.name}
                  {countdownState.isNextDay ? ' (Besok)' : ''}
                </span>
                <span className="text-base font-extrabold font-mono text-[#000000] tracking-wider">
                  {countdownState.formattedCountdown}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1352B9] shrink-0" />
          </div>
        </section>

        {/* ========================================== */}
        {/* KALENDER HIJRIAH (WEEK STRIP & HOLIDAY)   */}
        {/* ========================================== */}
        <section
          aria-labelledby="hijri-calendar-widget-heading"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3
                id="hijri-calendar-widget-heading"
                className="text-sm sm:text-base font-bold text-[#000000]"
              >
                Kalender Hijriah
              </h3>
              <button
                onClick={() => onNavigate('hijri-calendar')}
                className="text-xs font-semibold text-[#1352B9] hover:underline flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {monthNameIndo} {today.getFullYear()}
            </p>

            {/* Weekly Strip */}
            <div className="grid grid-cols-7 gap-1 text-center py-1">
              {weekDays.map((wd, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-medium mb-1">{wd.label}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      wd.isToday
                        ? 'bg-[#00A6FF] text-[#031B4A] shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {wd.dateNum}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hijri Details & Islamic Holiday Cards */}
          <div className="mt-3.5 space-y-2">
            {/* Hijri Date Box */}
            <div
              onClick={() => onNavigate('hijri-calendar')}
              className="p-2.5 bg-slate-50 border border-slate-200 hover:border-[#1352B9] rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#1352B9] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#000000]">{hijriInfo.formatted}</h4>
                  <p className="text-[11px] text-slate-500">{formattedGregorian}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Islamic Holiday Notification */}
            <div
              onClick={() => onNavigate('hijri-calendar')}
              className="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <h5 className="text-[11px] font-bold text-emerald-900">
                    {hijriInfo.holiday ? 'Hari Besar Islam' : 'Hari Penting Islam'}
                  </h5>
                  <p className="text-[10px] text-emerald-700">
                    {hijriInfo.holiday || 'Tidak ada hari besar pada tanggal ini.'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600/70 shrink-0" />
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* 6. DO'A HARIAN & TAHLIL PREVIEW CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Do'a Harian */}
        <div
          onClick={() => onNavigate('duas')}
          className="p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl cursor-pointer group transition-all shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-[#000000]">Do'a Harian</h4>
            <span className="text-xs font-semibold text-[#1352B9] group-hover:underline flex items-center gap-0.5">
              Lihat Semua
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <path d="M12 18v3" />
                <path d="M8 15h8" />
                <path d="M9 18h6" />
                <path d="M6 11a6 6 0 0 0 12 0" />
              </svg>
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-[#000000] truncate">
                {featuredDua.title}
              </h5>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                "{featuredDua.translation}"
              </p>
            </div>
          </div>
        </div>

        {/* Tahlil */}
        <div
          onClick={() => onNavigate('tahlil')}
          className="p-4 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl cursor-pointer group transition-all shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-[#000000]">Tahlil</h4>
            <span className="text-xs font-semibold text-[#1352B9] group-hover:underline flex items-center gap-0.5">
              Lihat Semua
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="16.5" cy="7" r="1.5" />
                <circle cx="19" cy="11.5" r="1.5" />
                <circle cx="17.5" cy="16" r="1.5" />
                <circle cx="13.5" cy="19" r="1.5" />
                <circle cx="10.5" cy="19" r="1.5" />
                <circle cx="6.5" cy="16" r="1.5" />
                <circle cx="5" cy="11.5" r="1.5" />
                <circle cx="7.5" cy="7" r="1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-[#000000] truncate">
                Tahlil & Dzikir
              </h5>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Bacaan lengkap tahlil sesuai sunnah Rasulullah SAW.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. UNDUH APLIKASI VAL-QUR'AN CALLOUT BANNER */}
      {/* ============================================================ */}
      <section className="bg-[#EBF5FF] border border-[#C2DFF3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#00A6FF] text-[#031B4A] flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#000000]">
              Pasang Aplikasi <span className="text-[#1352B9]">{APP_CONFIG.appName}</span> di Perangkat Anda
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Tersedia untuk Android, iPhone/iPad, dan Desktop (Windows/Mac/Linux) dengan akses offline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isInstallable && (
            <button
              onClick={() => promptInstall()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#000000] text-white font-bold text-xs rounded-xl hover:bg-[#031B4A] transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-[#00A6FF]" />
              <span>Pasang (1-Klik)</span>
            </button>
          )}

          <button
            onClick={() => openInstallModal()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#00A6FF] text-[#031B4A] font-bold text-xs rounded-xl hover:bg-[#1352B9] hover:text-white transition-colors shrink-0 shadow-xs"
          >
            <span>Panduan Instalasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
