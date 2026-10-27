import React from 'react';
import { APP_CONFIG } from '../../config/app.config';
import { useApp } from '../../context/AppContext';
import { Home, BookOpen, Compass, Search, Bookmark, Settings, Award, Download } from 'lucide-react';

interface DesktopSidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentTab, onNavigate }) => {
  const { tilawahProgress, settings } = useApp();

  const isWorshipActive = [
    'worship',
    'qibla',
    'prayer-times',
    'adhan-settings',
    'duas',
    'dua-detail',
    'tahlil',
    'hijri-calendar'
  ].includes(currentTab);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home, isActive: currentTab === 'home' },
    { id: 'surahs', label: '114 Surat Al-Qur\'an', icon: BookOpen, isActive: currentTab === 'surahs' || currentTab === 'reader' },
    { id: 'worship', label: 'Ibadah & Pendamping', icon: Compass, isActive: isWorshipActive },
    { id: 'search', label: 'Pencarian Global', icon: Search, isActive: currentTab === 'search' },
    { id: 'saved', label: 'Bookmark & Catatan', icon: Bookmark, isActive: currentTab === 'saved' || currentTab === 'history' },
    { id: 'download', label: 'Unduh & Pasang App', icon: Download, isActive: currentTab === 'download' },
    { id: 'settings', label: 'Pengaturan', icon: Settings, isActive: currentTab === 'settings' }
  ];

  const target = settings.dailyTargetAyat || 10;
  const progressPercent = Math.min(100, Math.round((tilawahProgress.ayatReadToday / target) * 100));

  return (
    <aside
      aria-label="Sidebar Navigasi Desktop"
      className="hidden md:flex flex-col w-64 lg:w-72 bg-[#031B4A] text-white border-r border-[#022478] shrink-0 min-h-screen sticky top-0"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-[#022478]">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-[#00A6FF]/40 shadow-sm">
            <img
              src="/assets/aistudio/Val-Qur_an_c94deda6.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#FFFFFF] group-hover:text-[#00A6FF] transition-colors">
              {APP_CONFIG.appName}
            </h1>
            <p className="text-xs text-[#C2DFF3] mt-0.5">{APP_CONFIG.tagline}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                item.isActive
                  ? 'bg-[#000000] text-[#00A6FF] border border-[#1352B9] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#022478]'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? 'text-[#00A6FF]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#00A6FF]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Daily Progress Widget */}
      <div className="p-4 mx-4 mb-6 bg-[#022478]/80 rounded-2xl border border-[#1352B9]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00A6FF]" />
            <span className="text-xs font-bold text-[#FFFFFF]">Target Tilawah Hari Ini</span>
          </div>
          <span className="text-xs font-semibold text-[#C2DFF3]">
            {tilawahProgress.ayatReadToday} / {target}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#031B4A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00A6FF] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-[#C2DFF3] mt-2 leading-tight">
          {progressPercent >= 100
            ? 'Alhamdulillah, target harian tercapai!'
            : `${target - tilawahProgress.ayatReadToday} ayat lagi untuk target hari ini.`}
        </p>
      </div>
    </aside>
  );
};
