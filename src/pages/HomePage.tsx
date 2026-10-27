import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../config/app.config';
import {
  BookOpen,
  Search,
  Bookmark,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Award,
  Compass,
  Calendar,
  Smartphone,
  Download
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, params?: { surah?: number; ayah?: number }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { lastRead, tilawahProgress, bookmarks, settings } = useApp();

  const target = settings.dailyTargetAyat || 10;
  const progressPercent = Math.min(100, Math.round((tilawahProgress.ayatReadToday / target) * 100));

  // Determine respectful Islamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Assalamu\'alaikum, Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Assalamu\'alaikum, Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Assalamu\'alaikum, Selamat Sore';
    return 'Assalamu\'alaikum, Selamat Malam';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Hero / Greeting Card */}
      <section className="bg-[#031B4A] text-white p-6 sm:p-8 rounded-3xl border border-[#022478] shadow-sm relative overflow-hidden">
        {/* Subtle geometric background motif */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#022478] text-[#00A6FF] border border-[#1352B9] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {APP_CONFIG.appName}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {getGreeting()}
          </h2>
          <p className="text-xs sm:text-sm text-[#C2DFF3] mt-1 max-w-lg">
            {APP_CONFIG.tagline} Luangkan sejenak waktu untuk membaca, merenungkan, dan mentadabburi kalamullah.
          </p>

          {/* Quick Action in Hero */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('surahs')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#000000] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#1352B9] transition-colors focus:ring-2 focus:ring-[#00A6FF]"
            >
              <BookOpen className="w-4 h-4 text-[#00A6FF]" />
              Buka 114 Surat
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#022478] text-[#C2DFF3] font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#1352B9] hover:text-white transition-colors"
            >
              <Search className="w-4 h-4 text-[#00A6FF]" />
              Cari Ayat atau Surat
            </button>
          </div>
        </div>
      </section>

      {/* Lanjutkan Membaca (Continue Reading) Card */}
      <section aria-labelledby="resume-heading">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 id="resume-heading" className="text-base font-bold text-[#031B4A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1352B9]" />
            Lanjutkan Membaca
          </h3>
          {lastRead && (
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-[#1352B9] hover:underline"
            >
              Lihat Riwayat
            </button>
          )}
        </div>

        {lastRead ? (
          <div className="p-5 sm:p-6 bg-[#FFFFFF] border-2 border-[#1352B9] rounded-2xl shadow-xs hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#031B4A] text-[#00A6FF] font-bold text-lg flex items-center justify-center shrink-0">
                  {lastRead.surahNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#C2DFF3] text-[#031B4A] rounded-md">
                      Terakhir Dibaca
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(lastRead.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#000000] mt-1">
                    Surat {lastRead.surahNameLatin} : Ayat {lastRead.ayahNumber}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Lanjutkan tadabbur langsung di ayat ke-{lastRead.ayahNumber}.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  onNavigate('reader', { surah: lastRead.surahNumber, ayah: lastRead.ayahNumber })
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#000000] text-white font-bold text-sm rounded-xl hover:bg-[#031B4A] transition-colors focus:ring-2 focus:ring-[#00A6FF] shrink-0"
              >
                <span>Lanjutkan Tilawah</span>
                <ArrowRight className="w-4 h-4 text-[#00A6FF]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl text-center space-y-3">
            <p className="text-sm text-slate-600 font-medium">
              Belum ada riwayat tilawah. Mulai tilawah pertama Anda hari ini!
            </p>
            <button
              onClick={() => onNavigate('reader', { surah: 1, ayah: 1 })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#000000] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#031B4A] transition-colors"
            >
              <span>Mulai dari Al-Fatihah (Surat 1)</span>
              <ArrowRight className="w-4 h-4 text-[#00A6FF]" />
            </button>
          </div>
        )}
      </section>

      {/* Target & Progres Tilawah Harian */}
      <section className="bg-[#FFFFFF] p-5 sm:p-6 rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1352B9]" />
            <h3 className="text-base font-bold text-[#031B4A]">Target Tilawah Harian</h3>
          </div>
          <span className="text-xs font-bold text-[#1352B9] bg-[#C2DFF3]/50 px-2.5 py-1 rounded-lg">
            {progressPercent}% Tercapai
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[#1352B9] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Dibaca hari ini: <strong className="text-[#031B4A]">{tilawahProgress.ayatReadToday}</strong> ayat
          </span>
          <span>
            Target: <strong className="text-[#031B4A]">{target}</strong> ayat / hari
          </span>
        </div>
      </section>

      {/* Akses Cepat (Quick Access Grid) */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-[#031B4A]">Menu Ibadah &amp; Pendamping Muslim</h3>
          <button
            onClick={() => onNavigate('worship')}
            className="text-xs font-semibold text-[#1352B9] hover:underline"
          >
            Pusat Ibadah
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('surahs')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">114 Surat</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Mushaf Al-Qur'an</p>
          </button>

          <button
            onClick={() => onNavigate('prayer-times')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">Waktu Salat</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Jadwal &amp; Adzan</p>
          </button>

          <button
            onClick={() => onNavigate('qibla')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">Arah Kiblat</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Kompas Ka'bah</p>
          </button>

          <button
            onClick={() => onNavigate('duas')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">Do'a Harian</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Do'a Sahih Hadits</p>
          </button>

          <button
            onClick={() => onNavigate('tahlil')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">Bacaan Tahlil</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Susunan Majmu' Syarif</p>
          </button>

          <button
            onClick={() => onNavigate('hijri-calendar')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">Kalender Hijriah</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Hari Besar Islam</p>
          </button>

          <button
            onClick={() => onNavigate('search')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">Pencarian</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Cari ayat & makna</p>
          </button>

          <button
            onClick={() => onNavigate('saved')}
            className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl text-left transition-all group hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Bookmark className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#000000]">Tersimpan</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{bookmarks.length} bookmark</p>
          </button>
        </div>
      </section>

      {/* Bookmark Terbaru (Recent Bookmarks) */}
      {bookmarks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-bold text-[#031B4A] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#1352B9]" />
              Bookmark Terbaru
            </h3>
            <button
              onClick={() => onNavigate('saved')}
              className="text-xs font-semibold text-[#1352B9] hover:underline"
            >
              Lihat Semua ({bookmarks.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {bookmarks.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  onNavigate('reader', { surah: item.surahNumber, ayah: item.ayahNumber })
                }
                className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#000000] group-hover:text-[#1352B9]">
                      QS. {item.surahNameLatin} : Ayat {item.ayahNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-1">
                    {item.translationSnippet}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1352B9] shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mobile App & PWA Installation Callout */}
      <section className="bg-gradient-to-r from-[#031B4A] to-[#022478] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#1352B9] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#00A6FF]/20 border border-[#00A6FF]/40 text-[#00A6FF] flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">Pasang di Android, iPhone & Desktop</h3>
              <span className="text-[10px] bg-[#00A6FF] text-[#031B4A] font-bold px-1.5 py-0.5 rounded">PWA & APK</span>
            </div>
            <p className="text-xs text-[#C2DFF3] mt-0.5">
              Gunakan val-qur'an secara offline dengan sensasi aplikasi native tanpa browser url bar.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('download')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A6FF] text-[#031B4A] font-bold text-xs rounded-xl hover:bg-[#C2DFF3] transition-colors shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Panduan Unduh & Pasang</span>
        </button>
      </section>

      {/* Surat Pilihan Populer / Sering Dibaca */}
      <section>
        <h3 className="text-base font-bold text-[#031B4A] mb-3 px-1">Surat Pilihan</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {[
            { nomor: 18, nama: 'Al-Kahfi', arti: 'Gua', ayat: 110 },
            { nomor: 36, nama: 'Yasin', arti: 'Ya Sin', ayat: 83 },
            { nomor: 56, nama: 'Al-Waqi\'ah', arti: 'Hari Kiamat', ayat: 96 },
            { nomor: 67, nama: 'Al-Mulk', arti: 'Kerajaan', ayat: 30 }
          ].map((s) => (
            <button
              key={s.nomor}
              onClick={() => onNavigate('reader', { surah: s.nomor, ayah: 1 })}
              className="p-3 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1352B9] rounded-xl text-left transition-colors"
            >
              <div className="font-bold text-[#000000]">{s.nama}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Surat {s.nomor} • {s.ayat} Ayat
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
