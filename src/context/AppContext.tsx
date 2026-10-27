/**
 * Core Application Context for val-qur'an
 * Manages settings, bookmarks, notes, reading history, tilawah progress,
 * offline status, PWA install prompt, and toasts.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  BookmarkItem,
  NoteItem,
  ReadingHistory,
  TilawahProgress
} from '../types/quran';
import { storageService, DEFAULT_SETTINGS } from '../services/storageService';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextValue {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  bookmarks: BookmarkItem[];
  addBookmark: (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  removeBookmark: (surahNumber: number, ayahNumber: number) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  notes: NoteItem[];
  saveNote: (surahNumber: number, surahNameLatin: string, ayahNumber: number, content: string) => void;
  deleteNote: (id: string) => void;
  getNoteForAyah: (surahNumber: number, ayahNumber: number) => NoteItem | undefined;
  lastRead: ReadingHistory | null;
  saveLastRead: (history: Omit<ReadingHistory, 'timestamp'>) => void;
  readingHistory: ReadingHistory[];
  clearHistory: () => void;
  tilawahProgress: TilawahProgress;
  recordAyahRead: (surahNumber: number, ayahNumber: number) => void;
  isOnline: boolean;
  isInstallable: boolean;
  promptInstall: () => Promise<boolean>;
  toast: ToastMessage | null;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => storageService.getBookmarks());
  const [notes, setNotes] = useState<NoteItem[]>(() => storageService.getNotes());
  const [lastRead, setLastRead] = useState<ReadingHistory | null>(() => storageService.getLastRead());
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>(() => storageService.getReadingHistory());
  const [tilawahProgress, setTilawahProgress] = useState<TilawahProgress>(() => storageService.getTilawahProgress());

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Monitor online / offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Koneksi internet terhubung kembali.', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Anda sedang offline. Membuka mode tilawah tersimpan.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker if supported
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('val-qur\'an Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('SW registration skipped or failed:', err);
        });
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 3500);
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updated = storageService.saveSettings(newSettings);
    setSettings(updated);
  }, []);

  const resetSettings = useCallback(() => {
    const res = storageService.resetSettings();
    setSettings(res);
    showToast('Pengaturan telah diatur ulang ke default.', 'info');
  }, [showToast]);

  const addBookmark = useCallback((item: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
    const saved = storageService.addBookmark(item);
    setBookmarks(storageService.getBookmarks());
    showToast(`Ayat ${item.ayahNumber} surat ${item.surahNameLatin} ditambahkan ke bookmark.`, 'success');
  }, [showToast]);

  const removeBookmark = useCallback((surahNumber: number, ayahNumber: number) => {
    storageService.removeBookmark(surahNumber, ayahNumber);
    setBookmarks(storageService.getBookmarks());
    showToast(`Bookmark ayat ${ayahNumber} dihapus.`, 'info');
  }, [showToast]);

  const isBookmarked = useCallback((surahNumber: number, ayahNumber: number) => {
    const id = `surah-${surahNumber}-ayah-${ayahNumber}`;
    return bookmarks.some((b) => b.id === id);
  }, [bookmarks]);

  const saveNote = useCallback((surahNumber: number, surahNameLatin: string, ayahNumber: number, content: string) => {
    storageService.saveNote(surahNumber, surahNameLatin, ayahNumber, content);
    setNotes(storageService.getNotes());
    showToast(`Catatan ayat ${ayahNumber} berhasil disimpan.`, 'success');
  }, [showToast]);

  const deleteNote = useCallback((id: string) => {
    storageService.deleteNote(id);
    setNotes(storageService.getNotes());
    showToast('Catatan berhasil dihapus.', 'info');
  }, [showToast]);

  const getNoteForAyah = useCallback((surahNumber: number, ayahNumber: number) => {
    return notes.find((n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber);
  }, [notes]);

  const saveLastRead = useCallback((history: Omit<ReadingHistory, 'timestamp'>) => {
    storageService.saveLastRead(history);
    setLastRead({ ...history, timestamp: Date.now() });
    setReadingHistory(storageService.getReadingHistory());
    setTilawahProgress(storageService.getTilawahProgress());
  }, []);

  const clearHistory = useCallback(() => {
    storageService.clearHistory();
    setLastRead(null);
    setReadingHistory([]);
    showToast('Riwayat tilawah telah dibersihkan.', 'info');
  }, [showToast]);

  const recordAyahRead = useCallback((surahNumber: number, ayahNumber: number) => {
    const prog = storageService.recordAyahRead(surahNumber, ayahNumber);
    setTilawahProgress({ ...prog });
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!installPromptEvent) return false;
    try {
      installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPromptEvent(null);
        showToast('Terima kasih telah menginstal val-qur\'an!', 'success');
        return true;
      }
    } catch (e) {
      console.warn('Install prompt error', e);
    }
    return false;
  }, [installPromptEvent, showToast]);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        notes,
        saveNote,
        deleteNote,
        getNoteForAyah,
        lastRead,
        saveLastRead,
        readingHistory,
        clearHistory,
        tilawahProgress,
        recordAyahRead,
        isOnline,
        isInstallable,
        promptInstall,
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
