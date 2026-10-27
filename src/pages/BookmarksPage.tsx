import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, FileEdit, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { NoteModal } from '../components/reader/NoteModal';

interface BookmarksPageProps {
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
  onGoToSurahs: () => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  onNavigateToAyah,
  onGoToSurahs
}) => {
  const { bookmarks, removeBookmark, notes, deleteNote } = useApp();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');

  // Deletion modal states
  const [deleteBookmarkTarget, setDeleteBookmarkTarget] = useState<{
    surahNumber: number;
    ayahNumber: number;
  } | null>(null);

  const [deleteNoteTarget, setDeleteNoteTarget] = useState<string | null>(null);

  // Edit note modal
  const [editingNote, setEditingNote] = useState<{
    surahNumber: number;
    surahNameLatin: string;
    ayahNumber: number;
  } | null>(null);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
          Tersimpan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Koleksi bookmark ayat pilihan dan catatan tadabbur pribadi Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'bookmarks'
              ? 'border-[#000000] text-[#000000]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmark ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'notes'
              ? 'border-[#000000] text-[#000000]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Catatan Pribadi ({notes.length})</span>
        </button>
      </div>

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="Belum Ada Bookmark"
              description="Tandai ayat-ayat yang berkesan saat membaca Al-Qur'an dengan menekan tombol ikon bookmark di setiap ayat."
              actionText="Mulai Baca Al-Qur'an"
              onAction={onGoToSurahs}
            />
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-5 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#031B4A] text-white text-xs font-bold flex items-center justify-center">
                        {b.surahNumber}
                      </span>
                      <h3 className="text-sm font-bold text-[#000000]">
                        QS. {b.surahNameLatin} : Ayat {b.ayahNumber}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setDeleteBookmarkTarget({
                            surahNumber: b.surahNumber,
                            ayahNumber: b.ayahNumber
                          })
                        }
                        aria-label="Hapus bookmark ini"
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic preview */}
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic text-xl text-slate-900 py-1"
                  >
                    {b.arabicSnippet}
                  </p>

                  {/* Translation preview */}
                  <p className="text-xs sm:text-sm text-slate-600 font-sans line-clamp-2">
                    "{b.translationSnippet}"
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigateToAyah(b.surahNumber, b.ayahNumber)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-[#1352B9] transition-colors"
                    >
                      <span>Buka Ayat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <EmptyState
              icon={FileEdit}
              title="Belum Ada Catatan Pribadi"
              description="Anda dapat menuliskan tadabbur, faidah ayat, atau doa pribadi saat membaca ayat di halaman pembaca."
              actionText="Jelajahi Surat"
              onAction={onGoToSurahs}
            />
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl shadow-2xs transition-all space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-[#000000]">
                        QS. {note.surahNameLatin} : Ayat {note.ayahNumber}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Diperbarui: {new Date(note.updatedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setEditingNote({
                            surahNumber: note.surahNumber,
                            surahNameLatin: note.surahNameLatin,
                            ayahNumber: note.ayahNumber
                          })
                        }
                        aria-label="Edit catatan ini"
                        className="p-1.5 text-slate-500 hover:text-[#1352B9] rounded-lg transition-colors"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteNoteTarget(note.id)}
                        aria-label="Hapus catatan ini"
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigateToAyah(note.surahNumber, note.ayahNumber)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1352B9] hover:text-[#000000] transition-colors"
                    >
                      <span>Lihat Ayat Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirm Dialog for deleting bookmark */}
      <ConfirmDialog
        isOpen={deleteBookmarkTarget !== null}
        title="Hapus Bookmark?"
        message="Ayat ini akan dihapus dari daftar bookmark tersimpan Anda."
        confirmLabel="Hapus"
        isDestructive={true}
        onConfirm={() => {
          if (deleteBookmarkTarget) {
            removeBookmark(
              deleteBookmarkTarget.surahNumber,
              deleteBookmarkTarget.ayahNumber
            );
            setDeleteBookmarkTarget(null);
          }
        }}
        onCancel={() => setDeleteBookmarkTarget(null)}
      />

      {/* Confirm Dialog for deleting note */}
      <ConfirmDialog
        isOpen={deleteNoteTarget !== null}
        title="Hapus Catatan Pribadi?"
        message="Catatan tadabbur ayat ini akan dihapus secara permanen dari perangkat Anda."
        confirmLabel="Hapus"
        isDestructive={true}
        onConfirm={() => {
          if (deleteNoteTarget) {
            deleteNote(deleteNoteTarget);
            setDeleteNoteTarget(null);
          }
        }}
        onCancel={() => setDeleteNoteTarget(null)}
      />

      {/* Note Edit Modal */}
      {editingNote && (
        <NoteModal
          isOpen={true}
          surahNumber={editingNote.surahNumber}
          surahNameLatin={editingNote.surahNameLatin}
          ayahNumber={editingNote.ayahNumber}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
};
