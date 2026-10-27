import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../config/app.config';
import {
  Settings,
  Type,
  Volume2,
  Award,
  RotateCcw,
  Info,
  Download,
  Check
} from 'lucide-react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings, isInstallable, promptInstall } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
          Pengaturan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Sesuaikan kenyamanan membaca, tipografi Arab, dan target ibadah harian.
        </p>
      </div>

      {/* PWA Install Banner if applicable */}
      {isInstallable && (
        <div className="p-5 bg-[#031B4A] text-white rounded-2xl border border-[#022478] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A6FF]/20 text-[#00A6FF] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Pasang Aplikasi val-qur'an</h3>
              <p className="text-xs text-[#C2DFF3] mt-0.5">
                Install sebagai Progressive Web App untuk akses cepat &amp; tilawah offline.
              </p>
            </div>
          </div>
          <button
            onClick={promptInstall}
            className="px-4 py-2 bg-[#00A6FF] text-[#031B4A] text-xs font-bold rounded-xl hover:bg-white transition-colors shrink-0"
          >
            Pasang Sekarang
          </button>
        </div>
      )}

      {/* Tipografi dan Tampilan */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Type className="w-5 h-5 text-[#1352B9]" />
          <h3 className="text-base font-bold text-[#031B4A]">Tipografi Teks Al-Qur'an</h3>
        </div>

        {/* Arabic Font Size */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Ukuran Huruf Arab</span>
            <span className="text-[#1352B9] bg-[#C2DFF3]/50 px-2 py-0.5 rounded text-xs">
              {settings.arabicFontSize} px
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={44}
            step={2}
            value={settings.arabicFontSize}
            onChange={(e) => updateSettings({ arabicFontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-[#00A6FF] h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Kecil (20px)</span>
            <span>Standar (28px)</span>
            <span>Besar (44px)</span>
          </div>
        </div>

        {/* Arabic Line Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Jarak Baris Ayat (Line Spacing)</span>
            <span className="text-[#1352B9] bg-[#C2DFF3]/50 px-2 py-0.5 rounded text-xs">
              {settings.arabicLineHeight}
            </span>
          </div>
          <input
            type="range"
            min={1.8}
            max={3.0}
            step={0.1}
            value={settings.arabicLineHeight}
            onChange={(e) => updateSettings({ arabicLineHeight: parseFloat(e.target.value) })}
            className="w-full accent-[#00A6FF] h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Live Preview of Typography */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-[11px] text-slate-400 font-semibold mb-2">Pratinjau Tipografi:</p>
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-[#000000] text-right"
            style={{
              fontSize: `${settings.arabicFontSize}px`,
              lineHeight: settings.arabicLineHeight
            }}
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          {/* Translation Toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-800">Tampilkan Terjemahan Indonesia</p>
              <p className="text-xs text-slate-400">Terjemahan resmi Kementerian Agama RI.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showTranslation}
              onChange={(e) => updateSettings({ showTranslation: e.target.checked })}
              className="w-5 h-5 accent-[#00A6FF] rounded cursor-pointer"
            />
          </label>

          {/* Transliteration Toggle */}
          <label className="flex items-center justify-between cursor-pointer pt-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">Tampilkan Transliterasi Latin</p>
              <p className="text-xs text-slate-400">Teks pelafalan latin di bawah ayat.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showTransliteration}
              onChange={(e) => updateSettings({ showTransliteration: e.target.checked })}
              className="w-5 h-5 accent-[#00A6FF] rounded cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* Audio Murottal Default Qari */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Volume2 className="w-5 h-5 text-[#1352B9]" />
          <h3 className="text-base font-bold text-[#031B4A]">Pilihan Qari Murottal</h3>
        </div>

        <p className="text-xs text-slate-500">
          Pilih suara syaikh/qari terverifikasi dari server equran.id untuk pemutaran tilawah:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {APP_CONFIG.qariList.map((qari) => {
            const isSelected = settings.defaultQariId === qari.id;
            return (
              <div
                key={qari.id}
                onClick={() => updateSettings({ defaultQariId: qari.id })}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#C2DFF3]/30 border-[#1352B9] text-[#031B4A]'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{qari.name}</p>
                  <p className="text-[10px] text-slate-400">Kode: {qari.id}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#1352B9] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Target Tilawah Harian */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Award className="w-5 h-5 text-[#1352B9]" />
          <h3 className="text-base font-bold text-[#031B4A]">Target Tilawah Harian</h3>
        </div>

        <p className="text-xs text-slate-500">
          Tentukan berapa ayat yang ingin Anda baca setiap hari untuk membangun konsistensi ibadah:
        </p>

        <div className="flex flex-wrap gap-2">
          {[5, 10, 20, 30, 50, 100].map((val) => (
            <button
              key={val}
              onClick={() => updateSettings({ dailyTargetAyat: val })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                settings.dailyTargetAyat === val
                  ? 'bg-[#000000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {val} Ayat / hari
            </button>
          ))}
        </div>
      </section>

      {/* Reset & App Info */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Info className="w-5 h-5 text-[#1352B9]" />
          <h3 className="text-base font-bold text-[#031B4A]">Tentang Aplikasi</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <p>
            <strong>Nama Aplikasi:</strong> {APP_CONFIG.appName}
          </p>
          <p>
            <strong>Tagline:</strong> {APP_CONFIG.tagline}
          </p>
          <p>
            <strong>Versi:</strong> {APP_CONFIG.version}
          </p>
          <p>
            <strong>Sumber Teks &amp; Audio:</strong> {APP_CONFIG.sourceAttribution}
          </p>
          <p>
            <strong>Palet Warna Tema:</strong> Black (#000000), Navy (#031B4A), Deep Blue (#022478), Blue (#1352B9), Electric Blue (#00A6FF), Ice Blue (#C2DFF3), White (#FFFFFF)
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Atur Ulang Pengaturan ke Default
          </button>
        </div>
      </section>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Pengaturan?"
        message="Ukuran font, line height, qari default, dan target harian akan dikembalikan ke konfigurasi awal."
        confirmLabel="Ya, Reset"
        isDestructive={true}
        onConfirm={() => {
          resetSettings();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
