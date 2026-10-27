import React from 'react';
import { Home, BookOpen, History, LayoutGrid } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab, onNavigate }) => {
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
    {
      id: 'home',
      label: 'Beranda',
      icon: Home,
      isActive: currentTab === 'home'
    },
    {
      id: 'surahs',
      label: 'Surat',
      icon: BookOpen,
      isActive: currentTab === 'surahs' || currentTab === 'reader'
    },
    {
      id: 'worship',
      label: 'Ibadah',
      // Custom clean Mosque icon
      customIcon: (active: boolean) => (
        <svg
          className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M5 21V10l3-2.5V21M19 21V10l-3-2.5V21M9 21V11a3 3 0 016 0v10M12 3a2 2 0 012 2c0 1.5-2 3-2 3s-2-1.5-2-3a2 2 0 012-2z"
          />
        </svg>
      ),
      isActive: isWorshipActive
    },
    {
      id: 'history',
      label: 'Riwayat',
      icon: History,
      isActive: currentTab === 'history' || currentTab === 'saved'
    },
    {
      id: 'settings',
      label: 'Lainnya',
      icon: LayoutGrid,
      isActive: currentTab === 'settings' || currentTab === 'download'
    }
  ];

  return (
    <nav
      aria-label="Navigasi Utama Bawah"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(3,27,74,0.06)]"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] transition-colors ${
                item.isActive ? 'text-[#00A6FF]' : 'text-slate-400 hover:text-[#031B4A]'
              }`}
            >
              <div className="relative">
                {item.customIcon ? (
                  item.customIcon(item.isActive)
                ) : Icon ? (
                  <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                ) : null}
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00A6FF] rounded-full" />
                )}
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight ${
                  item.isActive ? 'font-bold text-[#031B4A]' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
