import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/app.config';
import { platformService } from '../../services/platformService';
import {
  X,
  Smartphone,
  Apple,
  Monitor,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface InstallAppModalProps {
  onNavigateToDownloadPage?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  onNavigateToDownloadPage
}) => {
  const {
    isInstallModalOpen,
    closeInstallModal,
    initialInstallTab,
    isInstallable,
    isStandalone,
    promptInstall
  } = useApp();

  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop' | 'native'>('android');
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (isInstallModalOpen) {
      setActiveTab(initialInstallTab);
      setInstallSuccess(false);
    }
  }, [isInstallModalOpen, initialInstallTab]);

  if (!isInstallModalOpen) return null;

  const currentPlatformLabel = platformService.getPlatformLabel();
  const isChromium = platformService.isChromium();

  const handle1ClickInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        closeInstallModal();
      }, 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#031B4A] to-[#022478] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#031B4A] border border-[#00A6FF]/40 shrink-0">
              <img
                src="/assets/aistudio/Val-Qur_an_c94deda6.png"
                alt="val-qur'an logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 id="install-modal-title" className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Pasang {APP_CONFIG.appName}</span>
                <span className="text-[10px] bg-[#00A6FF] text-[#031B4A] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-[#C2DFF3]">Aplikasi multi-platform tanpa unduhan berat</p>
            </div>
          </div>

          <button
            onClick={closeInstallModal}
            aria-label="Tutup jendela pasang"
            className="p-2 text-[#C2DFF3] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Device Detection Pill */}
        <div className="bg-[#EBF5FF] px-4 py-2.5 border-b border-[#C2DFF3] flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-600 font-medium">
            Perangkat terdeteksi: <strong className="text-[#031B4A]">{currentPlatformLabel}</strong>
          </span>
          {isStandalone && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sudah Terpasang
            </span>
          )}
        </div>

        {/* Platform Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 min-w-[80px] py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'android'
                ? 'border-[#00A6FF] text-[#031B4A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 min-w-[80px] py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'ios'
                ? 'border-[#00A6FF] text-[#031B4A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 min-w-[80px] py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'desktop'
                ? 'border-[#00A6FF] text-[#031B4A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4 text-[#1352B9]" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setActiveTab('native')}
            className={`flex-1 min-w-[80px] py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'native'
                ? 'border-[#00A6FF] text-[#031B4A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>APK Native</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* TAB 1: ANDROID */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-emerald-900">
                  <strong className="block font-bold">Pengalaman Native di Android</strong>
                  Aplikasi akan terpasang di laci aplikasi (app drawer) dan home screen, berukuran sangat ringan (&lt; 2 MB), dan dapat digunakan secara offline.
                </div>
              </div>

              {isInstallable && (
                <button
                  onClick={handle1ClickInstall}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#000000] hover:bg-[#1352B9] text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#00A6FF]" />
                  <span>Pasang Sekarang (1-Sentuhan)</span>
                </button>
              )}

              <div className="space-y-2">
                <h4 className="font-bold text-[#000000] text-xs uppercase tracking-wider">
                  Panduan Manual (Jika Tombol Tidak Muncul):
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#031B4A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="block text-[#031B4A]">Buka Menu Browser</strong>
                      Ketuk ikon titik tiga (⋮) di pojok kanan atas browser Google Chrome atau browser Android Anda.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#031B4A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="block text-[#031B4A]">Pilih "Pasang Aplikasi"</strong>
                      Pilih opsi <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#031B4A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="block text-[#031B4A]">Selesai</strong>
                      Ikon val-qur'an akan siap diakses dari layar utama perangkat Anda secara mandiri!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: iOS (iPhone & iPad) */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <div className="text-slate-800">
                  <strong className="block font-bold">Catatan Pengguna iOS:</strong>
                  Apple mengharuskan proses instalasi PWA dilakukan melalui peramban <strong>Safari</strong>. Jika saat ini Anda membuka tautan di aplikasi lain, salin tautan dan buka di Safari.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#000000] text-xs uppercase tracking-wider">
                  3 Langkah Mudah di Safari iOS:
                </h4>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[#031B4A]">1. Ketuk Tombol "Bagikan" (Share)</strong>
                      Ketuk ikon kotak berpanah ke atas pada bilah alat bawah Safari di iPhone atau kanan atas di iPad.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF5FF] text-[#1352B9] flex items-center justify-center shrink-0">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[#031B4A]">2. "Tambahkan ke Layar Utama"</strong>
                      Gulir ke bawah pada menu lembar tindakan dan ketuk opsi <strong>"Add to Home Screen"</strong> (Tambahkan ke Layar Utama).
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[#031B4A]">3. Ketuk "Tambah" (Add)</strong>
                      Ketuk tombol <strong>Tambah</strong> di pojok kanan atas dialog. val-qur'an akan langsung muncul di Home Screen iOS Anda!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESKTOP (Windows, macOS, Linux) */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5">
                <Monitor className="w-4 h-4 text-[#1352B9] shrink-0 mt-0.5" />
                <div className="text-blue-900">
                  <strong className="block font-bold">Kenyamanan Tilawah di Desktop &amp; Laptop</strong>
                  Berjalan di jendela mandiri tanpa tab browser, dapat disematkan ke Taskbar (Windows) atau Dock (macOS), dan mendukung pintasan keyboard.
                </div>
              </div>

              {isInstallable && isChromium && (
                <button
                  onClick={handle1ClickInstall}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#000000] hover:bg-[#1352B9] text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#00A6FF]" />
                  <span>Pasang Aplikasi Desktop (1-Klik)</span>
                </button>
              )}

              <div className="space-y-2">
                <h4 className="font-bold text-[#000000] text-xs uppercase tracking-wider">
                  Cara Pasang di Browser Desktop (Chrome / Edge / Brave):
                </h4>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#031B4A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="block text-[#031B4A]">Lihat Ikon di Kolom URL (Omnibox)</strong>
                      Periksa sisi kanan bilah alamat URL browser Anda. Cari ikon <strong>Monitor dengan panah</strong> atau simbol <strong>(+)</strong>.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#031B4A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="block text-[#031B4A]">Atau Lewat Menu Browser</strong>
                      Klik menu browser titik tiga (⋮) $\rightarrow$ pilih <strong>"Simpan &amp; bagikan"</strong> $\rightarrow$ <strong>"Pasang halaman ini sebagai aplikasi"</strong>.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#031B4A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="block text-[#031B4A]">Sematkan ke Taskbar / Dock</strong>
                      Buka val-qur'an dari desktop dan sematkan ke Taskbar Windows atau macOS Dock untuk tilawah harian satu klik.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NATIVE APK / CAPACITOR */}
          {activeTab === 'native' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>Paket Native Android APK &amp; iOS</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Source code proyek val-qur'an telah dilengkapi dengan konfigurasi <strong>Capacitor 8</strong> (<code>capacitor.config.ts</code>). Anda dapat mengekspornya menjadi APK/AAB di Android Studio atau IPA di Xcode macOS.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Package Identifier:</span>
                  <span className="font-mono font-bold text-slate-800">com.valquran.app</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Versi Aplikasi:</span>
                  <span className="font-bold text-slate-800">1.1.0</span>
                </div>
              </div>

              {onNavigateToDownloadPage && (
                <button
                  onClick={() => {
                    closeInstallModal();
                    onNavigateToDownloadPage();
                  }}
                  className="w-full py-2.5 bg-[#031B4A] hover:bg-[#1352B9] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>Buka Halaman Panduan Build Lengkap</span>
                  <ExternalLink className="w-4 h-4 text-[#00A6FF]" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Gratis • Tanpa Iklan • Bebas Pelacak
          </p>
          <button
            onClick={closeInstallModal}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
