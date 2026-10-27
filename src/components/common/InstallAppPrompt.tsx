import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, X, Apple, Smartphone, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';
import { platformService } from '../../services/platformService';

interface InstallAppPromptProps {
  onOpenDownloadPage?: () => void;
}

export const InstallAppPrompt: React.FC<InstallAppPromptProps> = ({ onOpenDownloadPage }) => {
  const { isInstallable, promptInstall } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const isIOS = platformService.isIOS();
  const isStandalone = platformService.isStandalonePWA();

  // If already running standalone or dismissed, hide
  if (isStandalone || dismissed) return null;

  // If neither installable nor iOS, hide banner
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <div className="bg-[#031B4A] text-[#FFFFFF] p-3 sm:p-3.5 mx-3 sm:mx-4 my-2.5 rounded-2xl border border-[#022478] shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/assets/aistudio/Val-Qur_an_c94deda6.png"
            alt={APP_CONFIG.appName}
            className="w-10 h-10 rounded-xl shrink-0 object-contain shadow-xs border border-[#00A6FF]/30"
          />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF] truncate">
              Pasang Aplikasi {APP_CONFIG.appName}
            </p>
            <p className="text-[11px] text-[#C2DFF3] truncate">
              Akses cepat offline di layar utama {isIOS ? 'iPhone / iPad' : 'Android'}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isInstallable ? (
            <button
              onClick={promptInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00A6FF] text-[#031B4A] text-xs font-bold rounded-xl hover:bg-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
          ) : isIOS ? (
            <button
              onClick={() => setShowIOSModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00A6FF] text-[#031B4A] text-xs font-bold rounded-xl hover:bg-white transition-colors"
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
          ) : null}

          {onOpenDownloadPage && (
            <button
              onClick={onOpenDownloadPage}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#C2DFF3] hover:text-white px-2 py-1.5 rounded-lg hover:bg-[#022478] transition-colors"
            >
              <span>Opsi</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            aria-label="Tutup pemberitahuan pasang"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-[#FFFFFF] w-full max-w-sm rounded-3xl border border-[#E2E8F0] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-bold text-[#000000]">Pasang di iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-black rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Safari di iOS tidak menyediakan tombol instalasi otomatis langsung. Ikuti 2 langkah mudah berikut:
            </p>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-0.5">1. Ketuk Tombol Share (Bagikan)</strong>
                Ketuk ikon kotak berpanah ke atas (Share) pada bilah alat bawah Safari.
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-0.5">2. Tambahkan ke Layar Utama</strong>
                Gulir ke bawah dan ketuk <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-[#031B4A] transition-colors"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
