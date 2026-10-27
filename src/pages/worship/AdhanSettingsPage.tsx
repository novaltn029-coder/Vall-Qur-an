import React, { useState, useEffect } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Sliders,
  Play,
  Square,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { prayerTimesService } from '../../services/prayerTimesService';
import { notificationService } from '../../services/notificationService';
import { adhanAudioService, PlaybackState } from '../../services/adhanAudioService';
import { imsakReminderService, THEOLOGICAL_IMSAK_NOTE } from '../../services/imsakReminderService';
import { iqamahService, THEOLOGICAL_IQAMAH_NOTE } from '../../services/iqamahService';
import { AdhanReminderSettings } from '../../types/worship';

interface AdhanSettingsPageProps {
  onBack: () => void;
}

export const AdhanSettingsPage: React.FC<AdhanSettingsPageProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AdhanReminderSettings>(() =>
    prayerTimesService.getSettings()
  );
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  );
  const [audioPlayback, setAudioPlayback] = useState<PlaybackState>(() =>
    adhanAudioService.getState()
  );

  useEffect(() => {
    const unsub = adhanAudioService.subscribe((st) => setAudioPlayback(st));
    return () => unsub();
  }, []);

  const handleUpdate = (updated: Partial<AdhanReminderSettings>) => {
    const res = prayerTimesService.saveSettings(updated);
    setSettings(res);
  };

  const handleTestSound = (type: 'fajr' | 'dhuhr' | 'imsak' | 'iqamah') => {
    if (audioPlayback.status === 'playing') {
      adhanAudioService.stop();
      return;
    }

    if (type === 'fajr') {
      adhanAudioService.playAdhan('adhan_doha_fajr', true, { isPreview: true, previewMaxSeconds: 15 });
    } else if (type === 'dhuhr') {
      adhanAudioService.playAdhan('adhan_doha_dhuhr', false, { isPreview: true, previewMaxSeconds: 15 });
    } else if (type === 'imsak') {
      imsakReminderService.playImsakChime(settings.volume);
    } else if (type === 'iqamah') {
      iqamahService.playIqamahChime(settings.volume);
    }
  };

  const handleRequestPermission = async () => {
    const perm = await notificationService.requestPermission();
    setPermissionStatus(perm);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      {/* Top back & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Kembali"
          className="p-2 -ml-2 rounded-xl text-[#031B4A] hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Pengaturan Adzan &amp; Notifikasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Atur pengingat shalat fardhu, adzan Subuh, imsak, iqamah, dan audio suara.
          </p>
        </div>
      </div>

      {/* Browser Notification Status */}
      <section className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#1352B9]" />
            <div>
              <h3 className="text-sm font-bold text-[#000000]">Status Izin Notifikasi Browser / PWA</h3>
              <p className="text-xs text-slate-500">
                Status saat ini:{' '}
                <strong
                  className={
                    permissionStatus === 'granted'
                      ? 'text-emerald-600'
                      : permissionStatus === 'denied'
                      ? 'text-red-600'
                      : 'text-amber-600'
                  }
                >
                  {permissionStatus === 'granted'
                    ? 'Diizinkan (Aktif)'
                    : permissionStatus === 'denied'
                    ? 'Ditolak Browser'
                    : 'Belum Dikonfirmasi'}
                </strong>
              </p>
            </div>
          </div>

          {permissionStatus !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="px-3.5 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-[#1352B9] transition-colors shrink-0"
            >
              Minta Izin
            </button>
          )}
        </div>
      </section>

      {/* Master Volume & Live Testing */}
      <section className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#1352B9]" />
            <h3 className="text-sm font-bold text-[#000000]">Volume &amp; Pengujian Audio</h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#1352B9]">
            {Math.round(settings.volume * 100)}%
          </span>
        </div>

        <div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              handleUpdate({ volume: val });
              adhanAudioService.setVolume(val);
            }}
            className="w-full accent-[#1352B9] cursor-pointer"
          />
        </div>

        {/* Test Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => handleTestSound('fajr')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              audioPlayback.status === 'playing' && audioPlayback.isFajrSpecial
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#031B4A]'
            }`}
          >
            {audioPlayback.status === 'playing' && audioPlayback.isFajrSpecial ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" /> Stop Adzan
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#1352B9]" /> Uji Subuh
              </>
            )}
          </button>

          <button
            onClick={() => handleTestSound('dhuhr')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              audioPlayback.status === 'playing' && !audioPlayback.isFajrSpecial
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#031B4A]'
            }`}
          >
            {audioPlayback.status === 'playing' && !audioPlayback.isFajrSpecial ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" /> Stop Adzan
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#1352B9]" /> Uji Fardhu
              </>
            )}
          </button>

          <button
            onClick={() => handleTestSound('imsak')}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#031B4A] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-[#1352B9]" /> Uji Imsak
          </button>

          <button
            onClick={() => handleTestSound('iqamah')}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#031B4A] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-[#1352B9]" /> Uji Iqamah
          </button>
        </div>
      </section>

      {/* Special Subuh Adhan Configuration */}
      <section className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#000000]">Adzan Khusus Subuh (Tatswib)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menyertakan lafadz <em>&ldquo;Ash-shalatu khairum minan naum&rdquo;</em> (Shalat itu lebih baik daripada tidur).
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.fajrSpecialAdhan ?? true}
            onChange={(e) => handleUpdate({ fajrSpecialAdhan: e.target.checked })}
            className="w-5 h-5 accent-[#1352B9] rounded cursor-pointer mt-1"
          />
        </div>
      </section>

      {/* Imsak Reminder Settings */}
      <section className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#000000]">Pengingat Waktu Imsak (Ihtiyath)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Peringatan sebelum Subuh untuk menyudahi sahur dengan tenang.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.imsakReminderEnabled ?? true}
            onChange={(e) => handleUpdate({ imsakReminderEnabled: e.target.checked })}
            className="w-5 h-5 accent-[#1352B9] rounded cursor-pointer mt-1"
          />
        </div>

        {settings.imsakReminderEnabled && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Jeda sebelum waktu Subuh:</span>
              <span className="font-bold text-[#1352B9] font-mono">
                {settings.imsakOffsetMinutes ?? 10} Menit
              </span>
            </div>
            <div className="flex gap-2">
              {[5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleUpdate({ imsakOffsetMinutes: mins })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    (settings.imsakOffsetMinutes ?? 10) === mins
                      ? 'bg-[#000000] text-[#00A6FF] border-[#000000]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mins} Menit
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>{THEOLOGICAL_IMSAK_NOTE}</span>
        </div>
      </section>

      {/* Iqamah Reminder Settings */}
      <section className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#000000]">Pengingat Waktu Iqamah</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hitung mundur dan nada isyarat bersiap merapatkan saf setelah adzan berkumandang.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.iqamahReminderEnabled ?? true}
            onChange={(e) => handleUpdate({ iqamahReminderEnabled: e.target.checked })}
            className="w-5 h-5 accent-[#1352B9] rounded cursor-pointer mt-1"
          />
        </div>

        {settings.iqamahReminderEnabled && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Estimasi jeda iqamah:</span>
              <span className="font-bold text-[#1352B9] font-mono">
                {settings.iqamahDelayMinutes ?? 10} Menit
              </span>
            </div>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleUpdate({ iqamahDelayMinutes: mins })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    (settings.iqamahDelayMinutes ?? 10) === mins
                      ? 'bg-[#000000] text-[#00A6FF] border-[#000000]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mins} Menit
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
          <span>{THEOLOGICAL_IQAMAH_NOTE}</span>
        </div>
      </section>

      {/* Per-Prayer Reminder Toggles */}
      <section className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
        <h3 className="text-sm font-bold text-[#000000]">Pilihan Pengingat Shalat 5 Waktu</h3>
        <p className="text-xs text-slate-500">
          Pilih waktu shalat mana saja yang ingin mengaktifkan suara adzan &amp; notifikasi.
        </p>

        <div className="space-y-2 pt-2">
          {[
            { key: 'fajr', label: 'Subuh' },
            { key: 'dhuhr', label: 'Dzuhur' },
            { key: 'asr', label: 'Ashar' },
            { key: 'maghrib', label: 'Maghrib' },
            { key: 'isha', label: 'Isya' }
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <span className="text-xs font-bold text-[#031B4A]">Shalat {label}</span>
              <input
                type="checkbox"
                checked={settings[key as keyof AdhanReminderSettings] as boolean}
                onChange={(e) =>
                  handleUpdate({
                    [key]: e.target.checked
                  })
                }
                className="w-4 h-4 accent-[#1352B9] rounded cursor-pointer"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Calculation Method */}
      <section className="bg-white p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
        <h3 className="text-sm font-bold text-[#000000]">Metode Perhitungan Hisab Astronomis</h3>
        <p className="text-xs text-slate-500">
          Standar Kementerian Agama Republik Indonesia (Kemenag) menggunakan sudut Subuh 20° dan Isya 18° dengan pengaman ihtiyath +2 menit.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {[
            { id: 'KEMENAG', label: 'Kemenag RI (Resmi Indonesia)', desc: 'Subuh 20°, Isya 18°, +2m ihtiyath' },
            { id: 'MWL', label: 'Muslim World League', desc: 'Subuh 18°, Isya 17°' },
            { id: 'EGYPT', label: 'Egyptian Authority', desc: 'Subuh 19.5°, Isya 17.5°' },
            { id: 'MAKKAH', label: 'Umm Al-Qura (Makkah)', desc: 'Subuh 18.5°, Isya 90 menit pasca Maghrib' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleUpdate({ calculationMethod: m.id as any })}
              className={`p-3 rounded-xl text-left border transition-all ${
                settings.calculationMethod === m.id
                  ? 'bg-[#C2DFF3]/30 border-[#1352B9] ring-1 ring-[#1352B9]'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#031B4A]">{m.label}</span>
                {settings.calculationMethod === m.id && (
                  <Check className="w-3.5 h-3.5 text-[#1352B9]" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
