/**
 * val-qur'an — Main Application Root & Muslim Companion Hub
 * Integrated with AppProvider, AudioProvider, Hash-based deep link routing,
 * responsive mobile/desktop layouts, mini player, and PWA integration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AudioProvider } from './context/AudioContext';
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { MiniPlayer } from './components/audio/MiniPlayer';
import { ToastNotification } from './components/common/ToastNotification';
import { OfflineBanner } from './components/common/OfflineBanner';
import { InstallAppPrompt } from './components/common/InstallAppPrompt';
import { InstallAppModal } from './components/common/InstallAppModal';

import { HomePage } from './pages/HomePage';
import { SurahListPage } from './pages/SurahListPage';
import { ReaderPage } from './pages/ReaderPage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

// Muslim Companion Modules
import { WorshipHubPage } from './pages/worship/WorshipHubPage';
import { QiblaPage } from './pages/worship/QiblaPage';
import { PrayerTimesPage } from './pages/worship/PrayerTimesPage';
import { AdhanSettingsPage } from './pages/worship/AdhanSettingsPage';
import { DuaListPage } from './pages/worship/DuaListPage';
import { DuaReaderPage } from './pages/worship/DuaReaderPage';
import { TahlilPage } from './pages/worship/TahlilPage';
import { HijriCalendarPage } from './pages/worship/HijriCalendarPage';

// Mobile Install & Download Hub
import { InstallDownloadPage } from './pages/InstallDownloadPage';

function QuranAppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [readerSurah, setReaderSurah] = useState<number>(1);
  const [readerAyah, setReaderAyah] = useState<number>(1);
  const [selectedDuaId, setSelectedDuaId] = useState<string>('dua-makan-sebelum');

  // Parse hash URL for deep links, e.g. #surah/2 or #surah/2/255 or #qibla or #dua/dua-tidur-sebelum or #download
  const parseHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      return;
    }

    if (hash.startsWith('surah/')) {
      const parts = hash.split('/');
      const surahNum = parseInt(parts[1], 10);
      const ayahNum = parts[2] ? parseInt(parts[2], 10) : 1;
      if (!isNaN(surahNum) && surahNum >= 1 && surahNum <= 114) {
        setReaderSurah(surahNum);
        setReaderAyah(ayahNum);
        setCurrentTab('reader');
        return;
      }
    }

    if (hash.startsWith('dua/')) {
      const parts = hash.split('/');
      if (parts[1]) {
        setSelectedDuaId(parts[1]);
        setCurrentTab('dua-detail');
        return;
      }
    }

    const validTabs = [
      'home',
      'surahs',
      'search',
      'saved',
      'history',
      'settings',
      'worship',
      'qibla',
      'prayer-times',
      'adhan-settings',
      'duas',
      'dua-detail',
      'tahlil',
      'hijri-calendar',
      'download'
    ];

    if (validTabs.includes(hash)) {
      setCurrentTab(hash);
    }
  }, []);

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [parseHash]);

  // Navigate handler that updates hash
  const handleNavigate = (
    tab: string,
    params?: { surah?: number; ayah?: number; duaId?: string }
  ) => {
    if (tab === 'reader' && params?.surah) {
      setReaderSurah(params.surah);
      setReaderAyah(params.ayah || 1);
      setCurrentTab('reader');
      window.location.hash = params.ayah
        ? `surah/${params.surah}/${params.ayah}`
        : `surah/${params.surah}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'dua-detail' && params?.duaId) {
      setSelectedDuaId(params.duaId);
      setCurrentTab('dua-detail');
      window.location.hash = `dua/${params.duaId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back button determination for AppHeader
  const getBackConfig = () => {
    switch (currentTab) {
      case 'reader':
        return { showBack: true, onBack: () => handleNavigate('surahs') };
      case 'qibla':
      case 'prayer-times':
      case 'duas':
      case 'tahlil':
      case 'hijri-calendar':
        return { showBack: true, onBack: () => handleNavigate('worship') };
      case 'adhan-settings':
        return { showBack: true, onBack: () => handleNavigate('prayer-times') };
      case 'dua-detail':
        return { showBack: true, onBack: () => handleNavigate('duas') };
      case 'download':
      case 'history':
        return { showBack: true, onBack: () => handleNavigate('home') };
      default:
        return { showBack: false, onBack: undefined };
    }
  };

  const backConfig = getBackConfig();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col antialiased selection:bg-[#C2DFF3] selection:text-[#031B4A]">
      {/* Offline Status Alert */}
      <OfflineBanner />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-row">
        {/* Desktop Left Sidebar */}
        <DesktopSidebar currentTab={currentTab} onNavigate={handleNavigate} />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <AppHeader
            currentTab={currentTab}
            onNavigate={handleNavigate}
            showBack={backConfig.showBack}
            onBack={backConfig.onBack}
          />

          {/* Optional PWA Install Prompt Banner */}
          <InstallAppPrompt onOpenDownloadPage={() => handleNavigate('download')} />

          {/* Page Routing Views */}
          <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-6 lg:py-6 max-w-7xl w-full mx-auto">
            {/* Core Quran Views */}
            {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}

            {currentTab === 'surahs' && (
              <SurahListPage
                onSelectSurah={(surahNum) => handleNavigate('reader', { surah: surahNum, ayah: 1 })}
              />
            )}

            {currentTab === 'reader' && (
              <ReaderPage
                surahNumber={readerSurah}
                initialAyahNumber={readerAyah}
                onNavigateSurah={(sNum, aNum) => handleNavigate('reader', { surah: sNum, ayah: aNum || 1 })}
                onBack={() => handleNavigate('surahs')}
              />
            )}

            {currentTab === 'search' && (
              <SearchPage
                onSelectResult={(surahNum, ayahNum) =>
                  handleNavigate('reader', { surah: surahNum, ayah: ayahNum || 1 })
                }
              />
            )}

            {currentTab === 'saved' && (
              <BookmarksPage
                onNavigateToAyah={(surahNum, ayahNum) =>
                  handleNavigate('reader', { surah: surahNum, ayah: ayahNum })
                }
                onGoToSurahs={() => handleNavigate('surahs')}
              />
            )}

            {currentTab === 'history' && (
              <HistoryPage
                onNavigateToAyah={(surahNum, ayahNum) =>
                  handleNavigate('reader', { surah: surahNum, ayah: ayahNum })
                }
                onGoToSurahs={() => handleNavigate('surahs')}
              />
            )}

            {currentTab === 'settings' && <SettingsPage />}

            {/* Mobile / PWA / Native APK Download Hub */}
            {currentTab === 'download' && <InstallDownloadPage />}

            {/* Muslim Companion Views */}
            {currentTab === 'worship' && (
              <WorshipHubPage
                onNavigateSubpage={(subpageId, params) => handleNavigate(subpageId, params as any)}
              />
            )}

            {currentTab === 'qibla' && <QiblaPage />}

            {currentTab === 'prayer-times' && (
              <PrayerTimesPage
                onOpenAdhanSettings={() => handleNavigate('adhan-settings')}
                onOpenHijriCalendar={() => handleNavigate('hijri-calendar')}
              />
            )}

            {currentTab === 'adhan-settings' && (
              <AdhanSettingsPage onBack={() => handleNavigate('prayer-times')} />
            )}

            {currentTab === 'duas' && (
              <DuaListPage
                onSelectDua={(duaId) => handleNavigate('dua-detail', { duaId })}
              />
            )}

            {currentTab === 'dua-detail' && (
              <DuaReaderPage
                duaId={selectedDuaId}
                onBack={() => handleNavigate('duas')}
                onNavigateDua={(duaId) => handleNavigate('dua-detail', { duaId })}
              />
            )}

            {currentTab === 'tahlil' && <TahlilPage />}

            {currentTab === 'hijri-calendar' && (
              <HijriCalendarPage
                onOpenPrayerTimes={() => handleNavigate('prayer-times')}
              />
            )}
          </main>

          {/* Global Footer with the 3 logos */}
          <AppFooter />
        </div>
      </div>

      {/* Floating Audio Mini-Player (persists across all navigation) */}
      <MiniPlayer />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Multi-Platform PWA & Native Install Modal */}
      <InstallAppModal onNavigateToDownloadPage={() => handleNavigate('download')} />

      {/* Global Toast Notifications */}
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AudioProvider>
        <QuranAppContent />
      </AudioProvider>
    </AppProvider>
  );
}
