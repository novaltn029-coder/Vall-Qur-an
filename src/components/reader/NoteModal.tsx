import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FileEdit, Trash2, Save } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber: number;
  onClose: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  surahNumber,
  surahNameLatin,
  ayahNumber,
  onClose
}) => {
  const { getNoteForAyah, saveNote, deleteNote } = useApp();
  const existingNote = getNoteForAyah(surahNumber, ayahNumber);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (existingNote) {
      setContent(existingNote.content);
    } else {
      setContent('');
    }
  }, [existingNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!content.trim()) return;
    saveNote(surahNumber, surahNameLatin, ayahNumber, content.trim());
    onClose();
  };

  const handleDelete = () => {
    if (existingNote) {
      deleteNote(existingNote.id);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#031B4A] text-white flex items-center justify-between border-b border-[#022478]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00A6FF]/20 text-[#00A6FF] flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Catatan Pribadi</h3>
              <p className="text-xs text-[#C2DFF3]">
                QS. {surahNameLatin} : Ayat {ayahNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup dialog catatan"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#022478] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-4 space-y-3">
          <label htmlFor="note-content" className="block text-xs font-semibold text-slate-700">
            Tulis tadabbur, faedah, atau catatan pribadi untuk ayat ini:
          </label>
          <textarea
            id="note-content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis catatan Anda di sini..."
            className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6FF] resize-none"
          />
          <p className="text-[11px] text-slate-400">
            Catatan disimpan secara privat di perangkat Anda dan tidak dikirim ke server luar.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {existingNote && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              disabled={!content.trim()}
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-[#031B4A] transition-colors disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" /> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
