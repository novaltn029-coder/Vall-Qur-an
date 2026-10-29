import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface HistoryPageProps {
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
  onGoToSurahs: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onNavigateToAyah,
  onGoToSurahs
}) => {
  const { readingHistory, clearHistory } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl lg:max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Riwayat Tilawah
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar surat dan posisi ayat terakhir yang Anda baca.
          </p>
        </div>

        {readingHistory.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors self-start sm:self-auto border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" /> Bersihkan Riwayat
          </button>
        )}
      </div>

      {readingHistory.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Belum Ada Riwayat Tilawah"
          description="Riwayat bacaan akan dicatat secara otomatis ketika Anda membaca ayat Al-Qur'an."
          actionText="Buka Daftar Surat"
          onAction={onGoToSurahs}
        />
      ) : (
        <div className="space-y-3">
          {readingHistory.map((item, index) => (
            <div
              key={`${item.surahNumber}-${item.timestamp}-${index}`}
              onClick={() => onNavigateToAyah(item.surahNumber, item.ayahNumber)}
              className="p-4 sm:p-5 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {item.surahNumber}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#000000] group-hover:text-[#1352B9] transition-colors truncate">
                      Surat {item.surahNameLatin}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#C2DFF3] text-[#031B4A]">
                      Ayat {item.ayahNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Terakhir dibaca:{' '}
                    {new Date(item.timestamp).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  dir="rtl"
                  lang="ar"
                  className="hidden sm:inline font-arabic text-xl font-bold text-[#031B4A]"
                >
                  {item.surahNameArabic}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1352B9] group-hover:text-[#000000]">
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Bersihkan Semua Riwayat?"
        message="Seluruh catatan riwayat posisi membaca terakhir akan dihapus dari perangkat ini."
        confirmLabel="Ya, Bersihkan"
        isDestructive={true}
        onConfirm={() => {
          clearHistory();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
