import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Apple,
  Chrome,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Info,
  ChevronRight,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { platformService } from '../services/platformService';
import { installService, BUILD_INFO } from '../services/installService';
import { APP_CONFIG } from '../config/app.config';

export const InstallDownloadPage: React.FC = () => {
  const { isInstallable, promptInstall, showToast } = useApp();
  const [copiedCmdIndex, setCopiedCmdIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'pwa' | 'native'>('pwa');

  const currentPlatformLabel = platformService.getPlatformLabel();
  const isIOS = platformService.isIOS();
  const isStandalone = platformService.isStandalonePWA();
  const exportCommands = installService.getNativeExportCommands();

  const handleCopyCommand = async (cmd: string, index: number) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmdIndex(index);
      showToast('Perintah disalin ke clipboard.', 'success');
      setTimeout(() => setCopiedCmdIndex(null), 2000);
    } catch {
      showToast('Gagal menyalin perintah.', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
          Unduh &amp; Pasang val-qur'an
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Gunakan val-qur'an sebagai aplikasi mandiri di Android, iPhone/iPad, dan Desktop.
        </p>
      </div>

      {/* Current Platform Banner */}
      <div className="p-4 sm:p-5 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Perangkat Terdeteksi:</p>
            <h4 className="text-sm font-bold text-[#000000]">{currentPlatformLabel}</h4>
          </div>
        </div>

        {isStandalone ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Aplikasi Sedang Berjalan Standalone</span>
          </span>
        ) : isInstallable ? (
          <button
            onClick={promptInstall}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-[#1352B9] transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-[#00A6FF]" />
            <span>Pasang Sekarang (1-Klik)</span>
          </button>
        ) : null}
      </div>

      {/* Mode Tabs: PWA vs Native APK/Capacitor */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pwa')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'pwa'
              ? 'border-[#000000] text-[#000000]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Instalasi Cepat (PWA Mobile)</span>
        </button>

        <button
          onClick={() => setActiveTab('native')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'native'
              ? 'border-[#000000] text-[#000000]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Paket Native Android &amp; iOS (Capacitor)</span>
        </button>
      </div>

      {/* Tab A: PWA Installation Guidelines */}
      {activeTab === 'pwa' && (
        <div className="space-y-4">
          {/* Android PWA Guide */}
          <div className="p-5 sm:p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-2xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                <Chrome className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#000000]">Instalasi di Android (Chrome / Edge)</h3>
                <p className="text-xs text-slate-500">Hemat ruang memori, update otomatis, dan mendukung bacaan offline.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-1">1. Buka Menu Browser</strong>
                Ketuk ikon titik tiga (⋮) di pojok kanan atas browser Google Chrome atau browser bawaan Android.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-1">2. Pilih "Pasang Aplikasi"</strong>
                Pilih opsi <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-1">3. Siap Digunakan</strong>
                Ikon val-qur'an akan muncul di layar utama Android dan berjalan layar penuh tanpa bilah URL.
              </div>
            </div>

            {isInstallable && (
              <button
                onClick={promptInstall}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#000000] hover:bg-[#1352B9] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-[#00A6FF]" />
                <span>Tekan Disini untuk Pasang Aplikasi ke Android</span>
              </button>
            )}
          </div>

          {/* iOS Safari Guide */}
          <div className="p-5 sm:p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-2xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#000000]">Instalasi di iPhone &amp; iPad (Safari)</h3>
                <p className="text-xs text-slate-500">Apple WebKit Home Screen standalone experience tanpa App Store.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-1">1. Buka di Safari</strong>
                Buka tautan val-qur'an menggunakan peramban <strong>Safari</strong> di perangkat iOS Anda.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-1">2. Ketuk Tombol "Bagikan"</strong>
                Ketuk tombol <strong>Share / Bagikan</strong> (ikon kotak berpanah ke atas di bagian bawah layar).
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-[#031B4A] mb-1">3. Tambahkan ke Layar Utama</strong>
                Gulir ke bawah dan ketuk <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab B: Native APK / AAB & Capacitor Pipeline */}
      {activeTab === 'native' && (
        <div className="space-y-4">
          {/* Packaging Status Notice */}
          <div className="p-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1352B9]" />
                <h3 className="text-base font-bold text-[#031B4A]">Konfigurasi Paket Native Capacitor</h3>
              </div>
              <span className="px-2.5 py-1 bg-[#C2DFF3] text-[#031B4A] rounded-lg text-xs font-bold">
                v{BUILD_INFO.version}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Nama Aplikasi Mobile:</span>
                <strong className="text-slate-800 text-sm">{BUILD_INFO.appName}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Package ID / Bundle Identifier:</span>
                <strong className="text-slate-800 font-mono text-sm">{BUILD_INFO.androidPackageName}</strong>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Laporan Audit Lingkungan Build:</strong> Lingkungan container cloud saat ini tidak menyediakan Android SDK / Java JDK lokal untuk mengeksekusi kompilator APK secara langsung. Namun konfigurasi Capacitor (<code>capacitor.config.ts</code>) telah dipasang dan siap diekspor menjadi proyek native Android Studio &amp; Xcode.
              </div>
            </div>
          </div>

          {/* Export & Build Commands */}
          <div className="p-5 sm:p-6 bg-[#031B4A] text-white rounded-3xl border border-[#022478] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#022478]">
              <Terminal className="w-5 h-5 text-[#00A6FF]" />
              <h3 className="text-base font-bold text-white">
                Langkah Membuat APK / AAB Sendiri (Android Studio)
              </h3>
            </div>

            <p className="text-xs text-[#C2DFF3] leading-relaxed">
              Jalankan perintah berikut pada terminal komputer lokal Anda (yang memiliki Node.js dan Android Studio terpasang) untuk mengompilasi APK mandiri:
            </p>

            <div className="space-y-3">
              {exportCommands.map((item, idx) => (
                <div key={item.step} className="p-3.5 bg-[#022478]/80 rounded-2xl border border-[#1352B9] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#00A6FF]">
                      Langkah {item.step}: {item.title}
                    </span>
                    <button
                      onClick={() => handleCopyCommand(item.cmd, idx)}
                      className="p-1 hover:bg-[#031B4A] rounded-lg transition-colors text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                      title="Salin Perintah"
                    >
                      {copiedCmdIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-2.5 bg-[#031B4A] rounded-xl text-xs font-mono text-[#C2DFF3] overflow-x-auto select-all">
                    {item.cmd}
                  </pre>

                  <p className="text-[11px] text-slate-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
