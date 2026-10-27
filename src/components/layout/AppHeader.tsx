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

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  onNavigate,
  titleOverride,
  subtitleOverride,
  showBack,
  onBack
}) => {
  const { isStandalone, openInstallModal } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#031B4A] text-[#FFFFFF] border-b border-[#022478] shadow-xs pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding or Back navigation */}
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="p-2.5 -ml-2 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center text-[#C2DFF3] hover:text-[#FFFFFF] hover:bg-[#022478] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#00A6FF]/40 shadow-xs bg-[#022478]">
              <img
                src="/assets/aistudio/Val-Qur_an_c94deda6.png"
                alt="Logo val-qur'an"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-[#FFFFFF] group-hover:text-[#00A6FF] transition-colors leading-tight">
                  {titleOverride || APP_CONFIG.appName}
                </h1>
              </div>
              <p className="text-xs text-[#C2DFF3] font-normal leading-none mt-0.5">
                {subtitleOverride || APP_CONFIG.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right actions: Install App, Search, Bell Notification, and Settings */}
        <div className="flex items-center gap-1 sm:gap-2">
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
            {/* Active Notification indicator dot */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#00A6FF] ring-2 ring-[#031B4A]" />
          </button>

          <button
            onClick={() => onNavigate('settings')}
            aria-label="Pengaturan Aplikasi"
            className={`p-2.5 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
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
