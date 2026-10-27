import React, { useState } from 'react';
import { MapPin, Navigation, Building2, X } from 'lucide-react';
import { CITY_PRESETS } from '../../services/locationService';

interface LocationPermissionDialogProps {
  isOpen: boolean;
  onAllowGps: () => void;
  onSelectCity: (cityId: string) => void;
  onClose: () => void;
}

export const LocationPermissionDialog: React.FC<LocationPermissionDialogProps> = ({
  isOpen,
  onAllowGps,
  onSelectCity,
  onClose
}) => {
  const [selectedCityId, setSelectedCityId] = useState('jkt');

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
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Izin Akses Lokasi</h3>
              <p className="text-xs text-[#C2DFF3]">Untuk akurasi arah Kiblat &amp; jadwal salat</p>
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

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Aplikasi <strong>val-qur'an</strong> membutuhkan informasi koordinat Anda untuk menghitung:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
            <li>Derajat sudut kiblat akurat menuju Ka'bah (Makkah).</li>
            <li>Waktu shalat fardhu harian yang tepat sesuai garis bujur &amp; lintang Anda.</li>
          </ul>
          <p className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            Privasi Anda terjamin: Koordinat hanya diproses di browser Anda dan tidak pernah dikirim ke pihak luar.
          </p>

          <div className="pt-2">
            <button
              onClick={onAllowGps}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#000000] text-white font-bold rounded-xl hover:bg-[#031B4A] transition-colors shadow-xs"
            >
              <Navigation className="w-4 h-4 text-[#00A6FF]" />
              <span>Gunakan Lokasi GPS Otomatis</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-semibold">
              ATAU PILIH KOTA
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* City selector fallback */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#1352B9]" />
              Pilih Kota Indonesia / Makkah:
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A6FF]"
              >
                {CITY_PRESETS.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.province}) — {city.timezoneName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onSelectCity(selectedCityId)}
                className="px-4 py-2.5 bg-[#1352B9] text-white font-bold rounded-xl hover:bg-[#031B4A] transition-colors text-xs shrink-0"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
