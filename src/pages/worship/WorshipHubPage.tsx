import React, { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  BookOpen,
  ScrollText,
  Calendar,
  ChevronRight,
  MapPin,
  Sparkles,
  Volume2
} from 'lucide-react';
import { locationService } from '../../services/locationService';
import { prayerTimesService } from '../../services/prayerTimesService';
import { hijriCalendarService } from '../../services/hijriCalendarService';
import { qiblaService } from '../../services/qiblaService';
import { HijriDateHeader } from '../../components/worship/HijriDateHeader';
import { LocationPermissionDialog } from '../../components/worship/LocationPermissionDialog';

interface WorshipHubPageProps {
  onNavigateSubpage: (subpageId: string, params?: Record<string, unknown>) => void;
}

export const WorshipHubPage: React.FC<WorshipHubPageProps> = ({ onNavigateSubpage }) => {
  const [location, setLocation] = useState(() => locationService.getSavedLocation());
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const hijriInfo = hijriCalendarService.getHijriDate(currentTime);
  const prayerTimes = prayerTimesService.calculatePrayerTimes(
    currentTime,
    location.latitude,
    location.longitude,
    location.source === 'preset' ? 7 : 7 // will adapt or default WIB
  );
  const nextPrayer = prayerTimesService.getNextPrayer(prayerTimes, currentTime);
  const qiblaCalc = qiblaService.calculateQibla(location.latitude, location.longitude);

  // Live timer for next prayer countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    if (secs <= 0) return 'Masuk Waktu';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const modules = [
    {
      id: 'qibla',
      title: 'Arah Kiblat',
      subtitle: `${qiblaCalc.qiblaBearing}° dari Utara • ${qiblaCalc.distanceKm.toLocaleString('id-ID')} km ke Ka'bah`,
      icon: Compass,
      badge: 'Kompas Geodesik',
      color: 'bg-[#000000] text-[#00A6FF]'
    },
    {
      id: 'prayer-times',
      title: 'Waktu Salat & Adzan',
      subtitle: `${nextPrayer.label} dalam ${formatCountdown(nextPrayer.remainingSeconds)} (${nextPrayer.timeString})`,
      icon: Clock,
      badge: 'Jadwal Akurat',
      color: 'bg-[#031B4A] text-[#00A6FF]'
    },
    {
      id: 'duas',
      title: 'Do\'a Harian',
      subtitle: 'Kumpulan doa sahih harian lengkap teks Arab, latin, arti & rujukan hadits',
      icon: BookOpen,
      badge: 'Shahih & Hasan',
      color: 'bg-[#022478] text-[#C2DFF3]'
    },
    {
      id: 'tahlil',
      title: 'Bacaan Tahlil',
      subtitle: 'Susunan lengkap Majmu\' Syarif: Hadharah, surat pendek, tahlil & doa penutup',
      icon: ScrollText,
      badge: 'Dengan Counter',
      color: 'bg-[#1352B9] text-white'
    },
    {
      id: 'hijri-calendar',
      title: 'Kalender Hijriah',
      subtitle: `${hijriInfo.formatted} • Jadwal puasa sunnah & hari besar Islam`,
      icon: Calendar,
      badge: 'Penanggalan Islam',
      color: 'bg-[#031B4A] text-[#C2DFF3]'
    }
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto w-full">
      {/* Title & Location indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Pusat Ibadah &amp; Pendamping Muslim
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Fitur lengkap kiblat, jadwal salat, do'a harian, tahlil, dan penanggalan Hijriah.
          </p>
        </div>

        <button
          onClick={() => setShowLocationDialog(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#031B4A] rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors border border-slate-200"
        >
          <MapPin className="w-3.5 h-3.5 text-[#1352B9]" />
          <span>{location.cityName || 'Pilih Lokasi'}</span>
        </button>
      </div>

      {/* Hijri Date Banner */}
      <HijriDateHeader hijriInfo={hijriInfo} />

      {/* Next Prayer Countdown Spotlight Card */}
      <div
        onClick={() => onNavigateSubpage('prayer-times')}
        className="p-5 sm:p-6 bg-[#FFFFFF] border-2 border-[#1352B9] rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center font-bold text-lg shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-[#C2DFF3] text-[#031B4A] rounded-md">
                  Shalat Berikutnya
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {nextPrayer.timeString}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#000000] mt-1 group-hover:text-[#1352B9] transition-colors">
                Waktu {nextPrayer.label}
              </h3>
              <p className="text-xs text-slate-500">
                Menuju {nextPrayer.label} dalam:{' '}
                <strong className="text-[#031B4A] font-mono text-sm">
                  {formatCountdown(nextPrayer.remainingSeconds)}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-[#1352B9] group-hover:underline">
              Jadwal Lengkap &amp; Adzan
            </span>
            <ChevronRight className="w-4 h-4 text-[#1352B9]" />
          </div>
        </div>
      </div>

      {/* Grid of Companion Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => onNavigateSubpage(m.id)}
              className="p-5 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`w-11 h-11 rounded-2xl ${m.color} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {m.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#000000] group-hover:text-[#1352B9] transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {m.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1352B9]">
                <span>Buka Fitur</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Location Modal */}
      <LocationPermissionDialog
        isOpen={showLocationDialog}
        onAllowGps={async () => {
          try {
            const coords = await locationService.getCurrentGpsLocation();
            setLocation(coords);
            setShowLocationDialog(false);
          } catch (err) {
            alert((err as Error).message);
          }
        }}
        onSelectCity={(cityId) => {
          const coords = locationService.selectPresetCity(cityId);
          setLocation(coords);
          setShowLocationDialog(false);
        }}
        onClose={() => setShowLocationDialog(false)}
      />
    </div>
  );
};
