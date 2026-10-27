import React from 'react';
import { Bell, AlertCircle, X, Check } from 'lucide-react';

interface NotificationPermissionDialogProps {
  isOpen: boolean;
  onAllow: () => void;
  onClose: () => void;
}

export const NotificationPermissionDialog: React.FC<NotificationPermissionDialogProps> = ({
  isOpen,
  onAllow,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#031B4A] text-white flex items-center justify-between border-b border-[#022478]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00A6FF]/20 text-[#00A6FF] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Notifikasi Pengingat Adzan</h3>
              <p className="text-xs text-[#C2DFF3]">Izin notifikasi peramban web</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup dialog"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#022478] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-slate-600 leading-relaxed">
          <p>
            Aktifkan izin notifikasi agar peramban dapat mengingatkan Anda ketika masuk waktu shalat fardhu (Subuh, Zuhur, Asar, Magrib, dan Isya).
          </p>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Keterbatasan Notifikasi Browser:</span>
            </div>
            <p className="text-[11px] leading-normal">
              Notifikasi browser berbunyi optimal saat aplikasi terpasang (PWA) atau tab browser dibuka. Untuk memastikan tidak tertinggal waktu salat, jaga aplikasi tetap terpasang di layar utama Anda.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Nanti Saja
            </button>
            <button
              onClick={onAllow}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-[#031B4A] transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#00A6FF]" />
              <span>Izinkan Notifikasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
