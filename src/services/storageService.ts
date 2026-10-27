/**
 * Storage and Persistence Service
 * Stores Bookmarks, Personal Notes, Reading History, Tilawah Progress, and User Settings
 * using localStorage with safe JSON parsing and fallback error handling.
 */

import { BookmarkItem, NoteItem, ReadingHistory, TilawahProgress, AppSettings } from '../types/quran';
import { APP_CONFIG } from '../config/app.config';

const KEYS = {
  BOOKMARKS: 'val_quran_bookmarks_v1',
  NOTES: 'val_quran_notes_v1',
  HISTORY: 'val_quran_history_v1',
  PROGRESS: 'val_quran_progress_v1',
  SETTINGS: 'val_quran_settings_v1'
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  arabicFontSize: APP_CONFIG.readerDefaults.arabicFontSize,
  arabicLineHeight: APP_CONFIG.readerDefaults.arabicLineHeight,
  showTranslation: APP_CONFIG.readerDefaults.showTranslation,
  showTransliteration: APP_CONFIG.readerDefaults.showTransliteration,
  autoScrollSpeed: APP_CONFIG.readerDefaults.autoScrollSpeed,
  defaultQariId: APP_CONFIG.readerDefaults.defaultQariId,
  dailyTargetAyat: APP_CONFIG.readerDefaults.dailyTargetAyat
};

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const storageService = {
  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to read settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
    return updated;
  },

  resetSettings(): AppSettings {
    try {
      localStorage.removeItem(KEYS.SETTINGS);
    } catch (e) {
      console.warn('Failed to reset settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  // Bookmarks
  getBookmarks(): BookmarkItem[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKMARKS);
      if (data) {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('Failed to read bookmarks', e);
    }
    return [];
  },

  addBookmark(item: Omit<BookmarkItem, 'id' | 'createdAt'>): BookmarkItem {
    const bookmarks = this.getBookmarks();
    const id = `surah-${item.surahNumber}-ayah-${item.ayahNumber}`;

    // Prevent duplicates
    const existingIndex = bookmarks.findIndex((b) => b.id === id);
    if (existingIndex >= 0) {
      return bookmarks[existingIndex];
    }

    const newBookmark: BookmarkItem = {
      ...item,
      id,
      createdAt: Date.now()
    };

    bookmarks.unshift(newBookmark);
    try {
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmark', e);
    }
    return newBookmark;
  },

  removeBookmark(surahNumber: number, ayahNumber: number): void {
    const id = `surah-${surahNumber}-ayah-${ayahNumber}`;
    const bookmarks = this.getBookmarks().filter((b) => b.id !== id);
    try {
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to remove bookmark', e);
    }
  },

  isBookmarked(surahNumber: number, ayahNumber: number): boolean {
    const id = `surah-${surahNumber}-ayah-${ayahNumber}`;
    return this.getBookmarks().some((b) => b.id === id);
  },

  // Notes
  getNotes(): NoteItem[] {
    try {
      const data = localStorage.getItem(KEYS.NOTES);
      if (data) {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('Failed to read notes', e);
    }
    return [];
  },

  getNoteForAyah(surahNumber: number, ayahNumber: number): NoteItem | undefined {
    const notes = this.getNotes();
    return notes.find((n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber);
  },

  saveNote(surahNumber: number, surahNameLatin: string, ayahNumber: number, content: string): NoteItem {
    const notes = this.getNotes();
    const existingIndex = notes.findIndex(
      (n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber
    );

    const now = Date.now();
    let noteItem: NoteItem;

    if (existingIndex >= 0) {
      noteItem = {
        ...notes[existingIndex],
        content,
        updatedAt: now
      };
      notes[existingIndex] = noteItem;
    } else {
      noteItem = {
        id: `note-${surahNumber}-${ayahNumber}-${now}`,
        surahNumber,
        surahNameLatin,
        ayahNumber,
        content,
        createdAt: now,
        updatedAt: now
      };
      notes.unshift(noteItem);
    }

    try {
      localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to save note', e);
    }
    return noteItem;
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    try {
      localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to delete note', e);
    }
  },

  // Reading History (last read position & recents)
  getLastRead(): ReadingHistory | null {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      if (data) {
        const list = JSON.parse(data);
        if (Array.isArray(list) && list.length > 0) {
          return list[0];
        }
      }
    } catch (e) {
      console.warn('Failed to read history', e);
    }
    return null;
  },

  getReadingHistory(): ReadingHistory[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      if (data) {
        const list = JSON.parse(data);
        return Array.isArray(list) ? list : [];
      }
    } catch (e) {
      console.warn('Failed to read history list', e);
    }
    return [];
  },

  saveLastRead(history: Omit<ReadingHistory, 'timestamp'>): void {
    const currentList = this.getReadingHistory();
    // Filter out same surah to avoid duplicates
    const filtered = currentList.filter((item) => item.surahNumber !== history.surahNumber);
    const newEntry: ReadingHistory = {
      ...history,
      timestamp: Date.now()
    };
    filtered.unshift(newEntry);

    // Keep max 20 entries
    const trimmed = filtered.slice(0, 20);
    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to save reading history', e);
    }

    // Also mark reading progress for today
    this.recordAyahRead(history.surahNumber, history.ayahNumber);
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(KEYS.HISTORY);
    } catch (e) {
      console.warn('Failed to clear history', e);
    }
  },

  // Tilawah Progress
  getTilawahProgress(): TilawahProgress {
    const today = getTodayString();
    try {
      const data = localStorage.getItem(KEYS.PROGRESS);
      if (data) {
        const parsed = JSON.parse(data) as TilawahProgress;
        if (parsed.todayDate === today) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read progress', e);
    }
    return {
      todayDate: today,
      ayatReadToday: 0,
      completedAyatIds: []
    };
  },

  recordAyahRead(surahNumber: number, ayahNumber: number): TilawahProgress {
    const progress = this.getTilawahProgress();
    const ayahId = `${surahNumber}:${ayahNumber}`;
    if (!progress.completedAyatIds.includes(ayahId)) {
      progress.completedAyatIds.push(ayahId);
      progress.ayatReadToday = progress.completedAyatIds.length;
      try {
        localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
      } catch (e) {
        console.warn('Failed to record progress', e);
      }
    }
    return progress;
  }
};
