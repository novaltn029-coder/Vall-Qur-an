import React from 'react';
import { APP_CONFIG } from '../../config/app.config';
import { Settings, Search, BookOpen, Download } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-30 bg-[#031B4A] text-[#FFFFFF] border-b border-[#022478] shadow-xs pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding or Back navigation */}
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="p-2 -ml-2 rounded-xl text-[#C2DFF3] hover:text-[#FFFFFF] hover:bg-[#022478] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : null}

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#00A6FF]/40 shadow-xs">
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
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-semibold bg-[#022478] text-[#C2DFF3] rounded border border-[#1352B9]">
                  Digital
                </span>
              </div>
              <p className="text-xs text-[#C2DFF3] font-normal leading-none mt-0.5">
                {subtitleOverride || APP_CONFIG.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('search')}
            aria-label="Cari Surat atau Ayat"
            className={`p-2.5 rounded-xl transition-colors ${
              currentTab === 'search'
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-[#C2DFF3] hover:bg-[#022478] hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('download')}
            aria-label="Unduh & Pasang Aplikasi"
            className={`p-2.5 rounded-xl transition-colors ${
              currentTab === 'download'
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-[#C2DFF3] hover:bg-[#022478] hover:text-white'
            }`}
            title="Unduh & Pasang Aplikasi"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('surahs')}
            aria-label="Daftar Surat"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'surahs'
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-[#C2DFF3] hover:bg-[#022478] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>114 Surat</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            aria-label="Pengaturan"
            className={`p-2.5 rounded-xl transition-colors ${
              currentTab === 'settings'
                ? 'bg-[#00A6FF] text-[#031B4A]'
                : 'text-[#C2DFF3] hover:bg-[#022478] hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
