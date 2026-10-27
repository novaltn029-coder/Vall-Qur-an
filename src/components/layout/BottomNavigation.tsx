import React from 'react';
import { Home, BookOpen, Compass, Search, Bookmark } from 'lucide-react';

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
    { id: 'home', label: 'Beranda', icon: Home, isActive: currentTab === 'home' },
    { id: 'surahs', label: 'Al-Qur\'an', icon: BookOpen, isActive: currentTab === 'surahs' || currentTab === 'reader' },
    { id: 'worship', label: 'Ibadah', icon: Compass, isActive: isWorshipActive },
    { id: 'search', label: 'Cari', icon: Search, isActive: currentTab === 'search' },
    { id: 'saved', label: 'Tersimpan', icon: Bookmark, isActive: currentTab === 'saved' || currentTab === 'history' }
  ];

  return (
    <nav
      aria-label="Navigasi Utama Bawah"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#031B4A] border-t border-[#022478] pb-[env(safe-area-inset-bottom)] shadow-lg"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] transition-colors ${
                item.isActive ? 'text-[#00A6FF]' : 'text-slate-400 hover:text-[#C2DFF3]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00A6FF] rounded-full" />
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium ${item.isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
