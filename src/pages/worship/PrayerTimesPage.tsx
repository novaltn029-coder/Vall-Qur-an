import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Settings,
  Calendar,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Play,
  Square,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { prayerTimesService } from '../../services/prayerTimesService';
import { locationService, CITY_PRESETS } from '../../services/locationService';
import { hijriCalendarService } from '../../services/hijriCalendarService';
import { notificationService } from '../../services/notificationService';
import { adhanAudioService, PlaybackState } from '../../services/adhanAudioService';
import { iqamahService } from '../../services/iqamahService';
import { PrayerTimeCard } from '../../components/worship/PrayerTimeCard';
import { LocationPermissionDialog } from '../../components/worship/LocationPermissionDialog';
import { NotificationPermissionDialog } from '../../components/worship/NotificationPermissionDialog';
import { PrayerName } from '../../types/worship';
import { PRAYER_SCHEDULE } from '../../config/prayerConfig';

interface PrayerTimesPageProps {
  onOpenAdhanSettings: () => void;
  onOpenHijriCalendar: () => void;
}

export const PrayerTimesPage: React.FC<PrayerTimesPageProps> = ({
  onOpenAdhanSettings,
  onOpenHijriCalendar
}) => {
  const [location, setLocation] = useState(() => locationService.getSavedLocation());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [adhanSettings, setAdhanSettings] = useState(() => prayerTimesService.getSettings());
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showNotifDialog, setShowNotifDialog] = useState(false);

  // Audio & Simulation state
  const [audioPlayback, setAudioPlayback] = useState<PlaybackState>(() => adhanAudioService.getState());
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(() => adhanAudioService.isAudioUnlocked());
  const [isSimulationMode, setIsSimulationMode] = useState(() => prayerTimesService.isSimulationMode());
  const [simulationCountdown, setSimulationCountdown] = useState<{ active: boolean; prayer: string; seconds: number } | null>(null);
  const [activeIqamahPrayer, setActiveIqamahPrayer] = useState<{ prayer: PrayerName; label: string; remainingSecs: number } | null>(null);

  // Subscribe to adhan audio events
  useEffect(() => {
    const unsubscribe = adhanAudioService.subscribe((state) => {
      setAudioPlayback(state);
      setIsAudioUnlocked(adhanAudioService.isAudioUnlocked());
    });
    return () => unsubscribe();
  }, []);

  // Live timer tick for countdown and prayer checking
  useEffect(() => {
    let lastMinute = -1;

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check prayer adhans on minute change
      if (now.getMinutes() !== lastMinute) {
        lastMinute = now.getMinutes();
        const currentTimes = prayerTimesService.calculatePrayerTimes(
          now,
          location.latitude,
          location.longitude,
          7, // WIB
          adhanSettings.calculationMethod,
          adhanSettings.asrJuristic,
          adhanSettings.imsakOffsetMinutes ?? 10
        );
        prayerTimesService.checkAndTriggerPrayerTimes(
          currentTimes,
          location.cityName || 'Kabupaten Serang',
          location.cityName || 'btn_srg_kab',
          now
        );
      }

      // Check active Iqamah countdowns
      const prayersToCheck: { name: PrayerName; label: string }[] = [
        { name: 'fajr', label: 'Subuh' },
        { name: 'dhuhr', label: 'Dzuhur' },
        { name: 'asr', label: 'Ashar' },
        { name: 'maghrib', label: 'Maghrib' },
        { name: 'isha', label: 'Isya' }
      ];

      let foundActiveIqamah = false;
      for (const p of prayersToCheck) {
        const rem = iqamahService.getRemainingSeconds(p.name, now);
        if (rem > 0) {
          setActiveIqamahPrayer({ prayer: p.name, label: p.label, remainingSecs: rem });
          foundActiveIqamah = true;
          break;
        }
      }
      if (!foundActiveIqamah) {
        setActiveIqamahPrayer(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [location, adhanSettings]);

  // Simulation countdown timer
  useEffect(() => {
    if (!simulationCountdown || !simulationCountdown.active) return;
    if (simulationCountdown.seconds <= 0) {
      setSimulationCountdown(null);
      return;
    }

    const t = setTimeout(() => {
      setSimulationCountdown((prev) => (prev ? { ...prev, seconds: prev.seconds - 1 } : null));
    }, 1000);

    return () => clearTimeout(t);
  }, [simulationCountdown]);

  const [useConfiguredSchedule, setUseConfiguredSchedule] = useState(false);

  const hijriInfo = hijriCalendarService.getHijriDate(selectedDate);
  const baseCalculatedTimes = prayerTimesService.calculatePrayerTimes(
    selectedDate,
    location.latitude,
    location.longitude,
    7, // WIB
    adhanSettings.calculationMethod,
    adhanSettings.asrJuristic,
    adhanSettings.imsakOffsetMinutes ?? 10
  );

  const prayerTimes = useConfiguredSchedule
    ? {
        imsak: PRAYER_SCHEDULE.imsak,
        fajr: PRAYER_SCHEDULE.times.subuh,
        sunrise: PRAYER_SCHEDULE.terbit,
        dhuhr: PRAYER_SCHEDULE.times.dzuhur,
        asr: PRAYER_SCHEDULE.times.ashar,
        maghrib: PRAYER_SCHEDULE.times.maghrib,
        isha: PRAYER_SCHEDULE.times.isya
      }
    : baseCalculatedTimes;

  const nextPrayer = prayerTimesService.getNextPrayer(prayerTimes, currentTime);

  const formatCountdown = (secs: number) => {
    if (secs <= 0) return 'Masuk Waktu Shalat';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleToggleReminder = (key: PrayerName) => {
    if (key === 'sunrise' || key === 'imsak') return;

    if (
      notificationService.isSupported() &&
      notificationService.getPermission() !== 'granted'
    ) {
      setShowNotifDialog(true);
      return;
    }

    const updated = prayerTimesService.saveSettings({
      [key]: !adhanSettings[key]
    });
    setAdhanSettings(updated);
  };

  const handleToggleSimulationMode = () => {
    const nextVal = !isSimulationMode;
    setIsSimulationMode(nextVal);
    prayerTimesService.setSimulationMode(nextVal);
  };

  const handleTriggerSimulation = async (prayerName: PrayerName, label: string) => {
    setSimulationCountdown({ active: true, prayer: label, seconds: 3 });
    await prayerTimesService.simulatePrayerAdhan(
      prayerName,
      3,
      location.cityName || 'Kabupaten Serang'
    );
  };

  const handleUnlockAudio = async () => {
    await adhanAudioService.unlockAudio();
    setIsAudioUnlocked(true);
  };

  const bantenShortcuts = CITY_PRESETS.filter((c) => c.province === 'Banten').slice(0, 5);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl lg:max-w-5xl mx-auto w-full">
      {/* Title & Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Jadwal Waktu Salat
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Perhitungan hisab astronomi Kementerian Agama RI wilayah Indonesia (WIB).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLocationDialog(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#031B4A] rounded-xl text-xs font-semibold transition-colors border border-slate-200"
          >
            <MapPin className="w-3.5 h-3.5 text-[#1352B9]" />
            <span className="truncate max-w-[140px] sm:max-w-none">{location.cityName || 'Pilih Kota'}</span>
          </button>

          <button
            onClick={onOpenAdhanSettings}
            aria-label="Pengaturan Adzan"
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors"
            title="Pengaturan Notifikasi & Suara Adzan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Banten City Switcher */}
      <div className="bg-white p-3 rounded-2xl border border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#1352B9]" /> Wilayah Banten (Prioritas)
          </span>
          <button
            onClick={() => setShowLocationDialog(true)}
            className="text-[11px] text-[#1352B9] font-bold hover:underline"
          >
            Pilihan Lainnya &rarr;
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {bantenShortcuts.map((city) => {
            const isSelected = location.cityName?.includes(city.name);
            return (
              <button
                key={city.id}
                onClick={() => {
                  const updated = locationService.selectPresetCity(city.id);
                  setLocation(updated);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                  isSelected
                    ? 'bg-[#000000] text-[#00A6FF] font-bold ring-1 ring-[#00A6FF]'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#031B4A]'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Jadwal Salat: Konfigurasi Terpusat vs Astronomis */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Sumber Jadwal Waktu Salat
          </span>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            {useConfiguredSchedule
              ? 'Jadwal Konfigurasi Tetap: Subuh 04:13 • Dzuhur 11:43 • Ashar 14:55 • Maghrib 17:51 • Isya 19:02 WIB'
              : `Jadwal Astronomis Kemenag RI berdasarkan koordinat ${location.cityName || 'lokasi terpilih'}`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setUseConfiguredSchedule(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              !useConfiguredSchedule
                ? 'bg-[#031B4A] text-[#00A6FF]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Astronomis
          </button>
          <button
            onClick={() => setUseConfiguredSchedule(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              useConfiguredSchedule
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Konfigurasi Tetap (WIB)
          </button>
        </div>
      </div>

      {/* Now Playing Active Adhan Banner */}
      {audioPlayback.status === 'playing' && (
        <div className="p-4 bg-[#000000] text-white rounded-2xl border border-[#00A6FF] flex items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00A6FF] text-[#031B4A] flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#00A6FF] uppercase tracking-wide">
                  Sedang Mengumandangkan Adzan
                </span>
                {audioPlayback.isFajrSpecial && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#1352B9] text-white font-semibold">
                    Lafadz Subuh
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white truncate">
                {audioPlayback.currentTitle || 'Panggilan Shalat'}
              </h4>
            </div>
          </div>

          <button
            onClick={() => adhanAudioService.stop()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Hentikan</span>
          </button>
        </div>
      )}

      {/* Active Iqamah Countdown Banner */}
      {activeIqamahPrayer && (
        <div className="p-4 bg-emerald-900/90 text-white rounded-2xl border border-emerald-500 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold text-xs shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                Hitung Mundur Waktu Iqamah ({activeIqamahPrayer.label})
              </span>
              <p className="text-xs text-emerald-100">
                Bersiap merapatkan saf berjamaah.
              </p>
            </div>
          </div>
          <span className="text-xl font-bold font-mono text-emerald-300">
            {formatCountdown(activeIqamahPrayer.remainingSecs)}
          </span>
        </div>
      )}

      {/* Audio Unlock Banner if browser restrictions might delay audio */}
      {!isAudioUnlocked && (
        <div className="p-3.5 bg-[#C2DFF3]/30 border border-[#1352B9]/30 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#031B4A]">
            <Info className="w-4 h-4 text-[#1352B9] shrink-0" />
            <span>Browser memerlukan izin interaksi agar suara adzan dapat berbunyi otomatis.</span>
          </div>
          <button
            onClick={handleUnlockAudio}
            className="px-3 py-1 bg-[#1352B9] hover:bg-[#022478] text-white text-xs font-bold rounded-lg transition-colors shrink-0"
          >
            Aktifkan Suara
          </button>
        </div>
      )}

      {/* Mode Simulasi Waktu Salat (Developer / QA Tool) */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00A6FF]" />
            <h3 className="text-xs sm:text-sm font-bold text-white">Mode Simulasi Waktu Salat (Uji Langsung)</h3>
          </div>
          <button
            onClick={handleToggleSimulationMode}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              isSimulationMode
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isSimulationMode ? 'Simulasi Aktif' : 'Aktifkan Simulasi'}
          </button>
        </div>

        {isSimulationMode && (
          <div className="space-y-3 pt-1 border-t border-slate-800 text-xs text-slate-300">
            <p className="text-[11px] text-slate-400">
              Uji trigger adzan seketika tanpa menunggu pergantian jam sebenarnya. Audio akan berbunyi dalam 3 detik.
            </p>

            {simulationCountdown && (
              <div className="p-2.5 bg-[#022478] text-[#00A6FF] rounded-xl font-medium flex items-center justify-between">
                <span>Memulai simulasi adzan {simulationCountdown.prayer}...</span>
                <span className="font-bold font-mono text-sm">{simulationCountdown.seconds} detik</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTriggerSimulation('fajr', 'Subuh')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-[#1352B9] text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-[#00A6FF]" /> Uji Adzan Subuh (Lafadz Khusus)
              </button>
              <button
                onClick={() => handleTriggerSimulation('dhuhr', 'Dzuhur')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-[#1352B9] text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-[#00A6FF]" /> Uji Adzan Dzuhur
              </button>
              <button
                onClick={() => handleTriggerSimulation('imsak', 'Imsak')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-[#1352B9] text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-[#00A6FF]" /> Uji Pengingat Imsak
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Date Navigation Strip */}
      <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
        <button
          onClick={() => {
            const prev = new Date(selectedDate);
            prev.setDate(prev.getDate() - 1);
            setSelectedDate(prev);
          }}
          aria-label="Hari sebelumnya"
          className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center cursor-pointer" onClick={onOpenHijriCalendar}>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#031B4A]">
            <Calendar className="w-3.5 h-3.5 text-[#1352B9]" />
            <span>
              {selectedDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <p className="text-[11px] text-[#00A6FF] font-semibold mt-0.5">
            {hijriInfo.formatted}
          </p>
        </div>

        <button
          onClick={() => {
            const next = new Date(selectedDate);
            next.setDate(next.getDate() + 1);
            setSelectedDate(next);
          }}
          aria-label="Hari berikutnya"
          className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Next Prayer Countdown Hero */}
      <div className="p-6 bg-[#031B4A] text-white rounded-3xl border border-[#022478] shadow-sm text-center relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#022478] text-[#00A6FF] border border-[#1352B9] mb-3">
          <Clock className="w-3.5 h-3.5" /> Menuju Shalat Berikutnya
        </span>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Waktu {nextPrayer.label} • {nextPrayer.timeString} WIB
        </h3>

        <div className="my-3">
          <span className="text-4xl sm:text-5xl font-bold font-mono tracking-wider text-[#00A6FF]">
            {formatCountdown(nextPrayer.remainingSeconds)}
          </span>
        </div>

        <p className="text-xs text-[#C2DFF3]">
          Mari bersiap wudhu dan menunaikan shalat di awal waktu.
        </p>
      </div>

      {/* Prayer Time Cards List */}
      <div className="space-y-3">
        {/* Imsak */}
        {prayerTimes.imsak && (
          <div className="relative">
            <PrayerTimeCard
              prayerKey="imsak"
              name={`Imsak (${adhanSettings.imsakOffsetMinutes ?? 10} mnt sblm Subuh)`}
              arabicName="الإمساك"
              timeString={prayerTimes.imsak}
              isPassed={prayerTimesService.getPrayerStatus(prayerTimes.imsak, currentTime, selectedDate) === 'passed'}
            />
            <span className="block text-[11px] text-slate-400 px-4 pt-1">
              Waktu kehati-hatian (ihtiyath) untuk menyudahi sahur. Batas wajib puasa dimulai tepat saat Subuh.
            </span>
          </div>
        )}

        {/* Subuh */}
        <PrayerTimeCard
          prayerKey="fajr"
          name="Subuh"
          arabicName="الفجر"
          timeString={prayerTimes.fajr}
          isNext={nextPrayer.name === 'fajr'}
          isCurrent={prayerTimesService.getPrayerStatus(prayerTimes.fajr, currentTime, selectedDate, prayerTimes.sunrise) === 'active'}
          isPassed={prayerTimesService.getPrayerStatus(prayerTimes.fajr, currentTime, selectedDate, prayerTimes.sunrise) === 'passed'}
          isNotificationActive={adhanSettings.fajr}
          onToggleNotification={handleToggleReminder}
        />

        {/* Terbit (Informasi astronomi, bukan waktu shalat) */}
        <div className="relative">
          <PrayerTimeCard
            prayerKey="sunrise"
            name="Terbit Matahari (Syuruq)"
            arabicName="الشروق"
            timeString={prayerTimes.sunrise}
            isPassed={prayerTimesService.getPrayerStatus(prayerTimes.sunrise, currentTime, selectedDate) === 'passed'}
          />
          <span className="block text-[11px] text-slate-400 px-4 pt-1">
            Informasi astronomis terbit piringan atas matahari (Bukan waktu shalat fardhu).
          </span>
        </div>

        {/* Dzuhur */}
        <PrayerTimeCard
          prayerKey="dhuhr"
          name="Dzuhur"
          arabicName="الظهر"
          timeString={prayerTimes.dhuhr}
          isNext={nextPrayer.name === 'dhuhr'}
          isCurrent={prayerTimesService.getPrayerStatus(prayerTimes.dhuhr, currentTime, selectedDate, prayerTimes.asr) === 'active'}
          isPassed={prayerTimesService.getPrayerStatus(prayerTimes.dhuhr, currentTime, selectedDate, prayerTimes.asr) === 'passed'}
          isNotificationActive={adhanSettings.dhuhr}
          onToggleNotification={handleToggleReminder}
        />

        {/* Ashar */}
        <PrayerTimeCard
          prayerKey="asr"
          name="Ashar"
          arabicName="العصر"
          timeString={prayerTimes.asr}
          isNext={nextPrayer.name === 'asr'}
          isCurrent={prayerTimesService.getPrayerStatus(prayerTimes.asr, currentTime, selectedDate, prayerTimes.maghrib) === 'active'}
          isPassed={prayerTimesService.getPrayerStatus(prayerTimes.asr, currentTime, selectedDate, prayerTimes.maghrib) === 'passed'}
          isNotificationActive={adhanSettings.asr}
          onToggleNotification={handleToggleReminder}
        />

        {/* Maghrib */}
        <PrayerTimeCard
          prayerKey="maghrib"
          name="Maghrib"
          arabicName="المغرب"
          timeString={prayerTimes.maghrib}
          isNext={nextPrayer.name === 'maghrib'}
          isCurrent={prayerTimesService.getPrayerStatus(prayerTimes.maghrib, currentTime, selectedDate, prayerTimes.isha) === 'active'}
          isPassed={prayerTimesService.getPrayerStatus(prayerTimes.maghrib, currentTime, selectedDate, prayerTimes.isha) === 'passed'}
          isNotificationActive={adhanSettings.maghrib}
          onToggleNotification={handleToggleReminder}
        />

        {/* Isya */}
        <PrayerTimeCard
          prayerKey="isha"
          name="Isya"
          arabicName="العشاء"
          timeString={prayerTimes.isha}
          isNext={nextPrayer.name === 'isha'}
          isCurrent={prayerTimesService.getPrayerStatus(prayerTimes.isha, currentTime, selectedDate) === 'active'}
          isPassed={prayerTimesService.getPrayerStatus(prayerTimes.isha, currentTime, selectedDate) === 'passed'}
          isNotificationActive={adhanSettings.isha}
          onToggleNotification={handleToggleReminder}
        />
      </div>

      {/* Attribution footer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1352B9]" />
          <span>
            Metode: <strong>{adhanSettings.calculationMethod} RI</strong> (Subuh 20°, Isya 18°, Ihtiyath +2 menit).
          </span>
        </div>
        <button
          onClick={onOpenAdhanSettings}
          className="text-[#1352B9] font-bold hover:underline"
        >
          Pengaturan Adzan &rarr;
        </button>
      </div>

      {/* Location Dialog */}
      <LocationPermissionDialog
        isOpen={showLocationDialog}
        onAllowGps={async () => {
          try {
            const coords = await locationService.getCurrentGpsLocation();
            setLocation(coords);
            setShowLocationDialog(false);
          } catch (e) {
            alert((e as Error).message);
          }
        }}
        onSelectCity={(cityId) => {
          const coords = locationService.selectPresetCity(cityId);
          setLocation(coords);
          setShowLocationDialog(false);
        }}
        onClose={() => setShowLocationDialog(false)}
      />

      {/* Notification Dialog */}
      <NotificationPermissionDialog
        isOpen={showNotifDialog}
        onAllow={async () => {
          await notificationService.requestPermission();
          setShowNotifDialog(false);
        }}
        onClose={() => setShowNotifDialog(false)}
      />
    </div>
  );
};
