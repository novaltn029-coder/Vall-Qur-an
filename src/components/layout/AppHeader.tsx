import React from 'react';
import { APP_CONFIG } from '../../config/app.config';
import { useApp } from '../../context/AppContext';
import { Settings, Bell, Search, ArrowLeft, Download } from 'lucide-react';

interface AppHeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  titleOverride?: string;
  subtitleOverride?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const getTabInfo = (tab: string): { title: string; subtitle: string } => {
  switch (tab) {
    case 'home':
      return { title: APP_CONFIG.appName, subtitle: APP_CONFIG.tagline };
    case 'surahs':
      return { title: 'Daftar 114 Surat', subtitle: 'Mushaf Al-Qur\'an Digital' };
    case 'reader':
      return { title: 'Bacaan Surat & Tilawah', subtitle: 'Teks Arab, Terjemahan & Murottal' };
    case 'worship':
      return { title: 'Ibadah & Doa', subtitle: 'Panduan Ibadah Harian Muslim' };
    case 'qibla':
      return { title: 'Kompas Arah Kiblat', subtitle: 'Arah Presisi Ka\'bah Makkah' };
    case 'prayer-times':
      return { title: 'Jadwal Waktu Salat', subtitle: 'Waktu Salat 5 Waktu & Imsak' };
    case 'adhan-settings':
      return { title: 'Pengaturan Adzan', subtitle: 'Suara Adzan & Notifikasi Salat' };
    case 'duas':
      return { title: 'Kumpulan Doa & Zikir', subtitle: 'Doa Harian Sesuai Sunnah' };
    case 'dua-detail':
      return { title: 'Bacaan Doa Pilihan', subtitle: 'Teks, Latin & Terjemahan' };
    case 'tahlil':
      return { title: 'Tahlil & Zikir Lengkap', subtitle: 'Susunan Bacaan & Doa Arwah' };
    case 'hijri-calendar':
      return { title: 'Kalender Hijriah Indonesia', subtitle: 'Penanggalan Islam & Hari Penting' };
    case 'search':
      return { title: 'Pencarian Global', subtitle: 'Cari Surat, Ayat & Terjemahan' };
    case 'saved':
      return { title: 'Bookmark & Catatan', subtitle: 'Ayat Tersimpan & Catatan Tilawah' };
    case 'history':
      return { title: 'Riwayat Bacaan', subtitle: 'Jejak Ayat Terakhir Dibaca' };
    case 'settings':
      return { title: 'Pengaturan Aplikasi', subtitle: 'Preferensi Tampilan & Murottal' };
    case 'download':
      return { title: 'Unduh & Pasang Aplikasi', subtitle: 'PWA, Android APK, iOS & Desktop' };
    default:
      return { title: APP_CONFIG.appName, subtitle: APP_CONFIG.tagline };
  }
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  onNavigate,
  titleOverride,
  subtitleOverride,
  showBack,
  onBack
}) => {
  const { isStandalone, openInstallModal } = useApp();
  const pageInfo = getTabInfo(currentTab);

  return (
    <header className="sticky top-0 z-30 bg-[#031B4A] text-[#FFFFFF] border-b border-[#022478] shadow-xs pt-[env(safe-area-inset-top)] w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding or Page Context navigation */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="p-2.5 -ml-1.5 sm:-ml-2 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center text-[#C2DFF3] hover:text-[#FFFFFF] hover:bg-[#022478] transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          {/* MOBILE VIEW:
              - ONLY on 'home': Display the logo icon + brand text.
              - On ANY OTHER page/menu: Do NOT display logo icon or brand text, show clean page title!
          */}
          <div className="md:hidden flex items-center min-w-0">
            {currentTab === 'home' ? (
              <div
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-[#00A6FF]/40 shadow-xs bg-[#022478]">
                  <img
                    src="/assets/aistudio/Val-Qur_an_c94deda6.png"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold tracking-tight text-[#FFFFFF] leading-tight truncate">
                    {APP_CONFIG.appName}
                  </h1>
                  <p className="text-[11px] text-[#C2DFF3] font-normal leading-none mt-0.5 truncate">
                    {APP_CONFIG.tagline}
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-w-0 py-0.5">
                <h1 className="text-base font-bold tracking-tight text-[#FFFFFF] leading-tight truncate">
                  {titleOverride || pageInfo.title}
                </h1>
                <p className="text-[11px] text-[#C2DFF3] font-normal leading-none mt-0.5 truncate">
                  {subtitleOverride || pageInfo.subtitle}
                </p>
              </div>
            )}
          </div>

          {/* DESKTOP VIEW:
              Sidebar already contains the brand logo and tagline.
              Remove redundant brand duplication on desktop mode and show contextual page breadcrumb.
          */}
          <div className="hidden md:flex flex-col min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-[#FFFFFF] leading-tight truncate">
              {titleOverride || (currentTab === 'home' ? 'Beranda Utama' : pageInfo.title)}
            </h1>
            <p className="text-xs text-[#C2DFF3] font-normal leading-none mt-0.5 truncate">
              {subtitleOverride || (currentTab === 'home' ? 'Teman Tilawah dalam Genggaman' : pageInfo.subtitle)}
            </p>
          </div>
        </div>

        {/* Right actions: Install App, Search, Bell Notification, and Settings (Desktop only) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {!isStandalone && (
            <button
              onClick={() => openInstallModal()}
              aria-label="Pasang Aplikasi val-qur'an"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#00A6FF] text-[#031B4A] hover:bg-white font-bold text-xs transition-colors shadow-xs"
              title="Pasang Aplikasi ke Android, iOS, atau Desktop"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Pasang App</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('search')}
            aria-label="Cari Surat atau Ayat"
            className={`p-2.5 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
              currentTab === 'search'
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-[#C2DFF3] hover:bg-[#022478] hover:text-white'
            }`}
            title="Cari Surat atau Ayat"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('adhan-settings')}
            aria-label="Pengingat Salat & Notifikasi Adzan"
            className={`relative p-2.5 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
              currentTab === 'adhan-settings'
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-[#C2DFF3] hover:bg-[#022478] hover:text-white'
            }`}
            title="Pengingat Salat & Adzan"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#00A6FF] ring-2 ring-[#031B4A]" />
          </button>

          {/* Settings button: HIDDEN on mobile view ("untuk tampilan mobile, hapus icon pengaturan dibagian atas") */}
          <button
            onClick={() => onNavigate('settings')}
            aria-label="Pengaturan Aplikasi"
            className={`hidden md:flex p-2.5 rounded-xl min-w-[44px] min-h-[44px] items-center justify-center transition-colors ${
              currentTab === 'settings'
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-[#C2DFF3] hover:bg-[#022478] hover:text-white'
            }`}
            title="Pengaturan"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
