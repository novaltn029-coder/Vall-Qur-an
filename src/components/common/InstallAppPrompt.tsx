import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, X, Apple, Smartphone, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';
import { platformService } from '../../services/platformService';

interface InstallAppPromptProps {
  onOpenDownloadPage?: () => void;
}

export const InstallAppPrompt: React.FC<InstallAppPromptProps> = ({ onOpenDownloadPage }) => {
  const { isInstallable, promptInstall, openInstallModal } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const isIOS = platformService.isIOS();
  const isStandalone = platformService.isStandalonePWA();
  const isDesktop = platformService.isDesktop();

  // If already running standalone or dismissed, hide
  if (isStandalone || dismissed) return null;

  // If neither installable nor iOS nor desktop, hide banner
  if (!isInstallable && !isIOS) return null;

  return (
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
            {isIOS
              ? 'Akses cepat di layar utama iPhone / iPad tanpa App Store.'
              : isDesktop
              ? 'Jendela mandiri di Windows / Mac / Linux dengan akses offline.'
              : 'Akses cepat offline di layar utama Android.'}
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
            <span>Pasang (1-Klik)</span>
          </button>
        ) : (
          <button
            onClick={() => openInstallModal(isIOS ? 'ios' : isDesktop ? 'desktop' : 'android')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00A6FF] text-[#031B4A] text-xs font-bold rounded-xl hover:bg-white transition-colors"
          >
            {isIOS ? <Apple className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>Panduan Pasang</span>
          </button>
        )}

        <button
          onClick={() => openInstallModal()}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#C2DFF3] hover:text-white px-2 py-1.5 rounded-lg hover:bg-[#022478] transition-colors"
          title="Semua Pilihan Platform"
        >
          <span>Pilihan</span>
          <ArrowRight className="w-3 h-3" />
        </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Tutup pemberitahuan pasang"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
      </div>
    </div>
  );
};
