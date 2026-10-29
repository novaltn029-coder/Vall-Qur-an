import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  MapPin,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Navigation,
  Info
} from 'lucide-react';
import { qiblaService } from '../../services/qiblaService';
import { locationService, KAABA_COORDINATES } from '../../services/locationService';
import { LocationPermissionDialog } from '../../components/worship/LocationPermissionDialog';

export const QiblaPage: React.FC = () => {
  const [location, setLocation] = useState(() => locationService.getSavedLocation());
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorSupported, setSensorSupported] = useState<boolean>(true);
  const [permissionRequired, setPermissionRequired] = useState<boolean>(false);
  const [showLocationDialog, setShowLocationDialog] = useState<boolean>(false);

  const qiblaResult = qiblaService.calculateQibla(location.latitude, location.longitude);

  useEffect(() => {
    // Check if DeviceOrientationEvent exists
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      setSensorSupported(false);
      return;
    }

    // Check if permission is needed on iOS 13+
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setPermissionRequired(true);
    }

    let hasReceivedEvent = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      hasReceivedEvent = true;
      const heading = qiblaService.extractCompassHeading(e);
      if (heading !== null) {
        setDeviceHeading(Math.round(heading));
        setSensorSupported(true);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    // If after 3 seconds no orientation data arrived, sensor is likely unsupported or desktop
    const timer = setTimeout(() => {
      if (!hasReceivedEvent) {
        setSensorSupported(false);
      }
    }, 3000);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      clearTimeout(timer);
    };
  }, []);

  const handleRequestSensorPermission = async () => {
    const granted = await qiblaService.requestOrientationPermission();
    if (granted) {
      setPermissionRequired(false);
    } else {
      alert('Izin sensor orientasi tidak diberikan. Anda tetap dapat menggunakan derajat kiblat secara manual.');
    }
  };

  // Difference between Qibla bearing and device compass heading
  // If sensor is active, the needle rotates relative to device heading
  // If sensor is not active, the needle points to qibla bearing from 0° (North)
  const relativeAngle =
    deviceHeading !== null
      ? (qiblaResult.qiblaBearing - deviceHeading + 360) % 360
      : qiblaResult.qiblaBearing;

  const isAligned =
    deviceHeading !== null &&
    Math.abs(qiblaResult.qiblaBearing - deviceHeading) <= 3;

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl lg:max-w-4xl mx-auto w-full text-center">
      {/* Header Halaman Kompas: Gambar ke-3 (50px, hanya logo) */}
      <div className="flex justify-center">
        <img
          src="/assets/aistudio/Picsart_26-10-29_14-25-36-467_7949ac61.png"
          alt="Logo"
          className="h-[50px] w-[50px] object-contain drop-shadow-xs"
        />
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
          Kompas Arah Kiblat
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Perhitungan geodesik lingkaran besar menuju Ka'bah di Masjidil Haram, Makkah.
        </p>
      </div>

      {/* Location Bar */}
      <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 text-left min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#031B4A] text-[#00A6FF] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#000000] truncate">
              {location.cityName || 'Koordinat Manual'}
            </p>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}° ({location.source.toUpperCase()})
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLocationDialog(true)}
          className="px-3 py-1.5 bg-[#000000] text-white rounded-xl text-xs font-semibold hover:bg-[#1352B9] transition-colors shrink-0"
        >
          Ganti Lokasi
        </button>
      </div>

      {/* Sensor Permission Banner if iOS */}
      {permissionRequired && (
        <div className="p-4 bg-[#031B4A] text-white rounded-2xl border border-[#022478] text-left flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-[#00A6FF]">Izin Sensor Kompas Diperlukan</h4>
            <p className="text-[11px] text-[#C2DFF3]">
              Ketuk untuk mengaktifkan kompas real-time di perangkat iOS Safari Anda.
            </p>
          </div>
          <button
            onClick={handleRequestSensorPermission}
            className="px-3 py-1.5 bg-[#00A6FF] text-[#031B4A] font-bold text-xs rounded-xl hover:bg-white transition-colors shrink-0"
          >
            Aktifkan Sensor
          </button>
        </div>
      )}

      {/* Degrees & Distance Info Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Sudut Derajat Kiblat
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#000000]">
            {qiblaResult.qiblaBearing}°
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">dari Arah Utara</span>
        </div>

        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Jarak ke Ka'bah
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1352B9]">
            {qiblaResult.distanceKm.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Kilometer</span>
        </div>
      </div>

      {/* Compass Circular Dial */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-4 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#031B4A] bg-white shadow-xl flex items-center justify-center">
          {/* Compass Degree Tick marks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full flex justify-center py-2"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div
                className={`w-0.5 ${
                  i % 3 === 0 ? 'h-3 bg-[#000000]' : 'h-1.5 bg-slate-300'
                }`}
              />
            </div>
          ))}

          {/* Cardinal Directions */}
          <span className="absolute top-4 text-xs font-bold text-red-600 font-mono">U (0°)</span>
          <span className="absolute right-4 text-xs font-bold text-slate-500 font-mono">T (90°)</span>
          <span className="absolute bottom-4 text-xs font-bold text-slate-500 font-mono">S (180°)</span>
          <span className="absolute left-4 text-xs font-bold text-slate-500 font-mono">B (270°)</span>
        </div>

        {/* Needle Pointer */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `rotate(${relativeAngle}deg)` }}
        >
          {/* Ka'bah icon marker at target angle */}
          <div className="absolute top-7 flex flex-col items-center">
            <div className="px-2 py-0.5 bg-[#000000] text-[#00A6FF] rounded-md text-[10px] font-bold border border-[#00A6FF] shadow-xs mb-1">
              KA'BAH
            </div>
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-16 border-b-[#00A6FF]" />
          </div>

          {/* Center Pivot Medallion */}
          <div className="w-16 h-16 rounded-full bg-[#031B4A] border-4 border-[#00A6FF] text-white flex flex-col items-center justify-center shadow-lg z-10">
            <Compass className="w-6 h-6 text-[#00A6FF]" />
          </div>

          {/* Back needle */}
          <div className="absolute bottom-10 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-12 border-t-slate-300" />
        </div>
      </div>

      {/* Sensor Calibration & Status */}
      <div className="space-y-3 text-left">
        {deviceHeading !== null ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-emerald-900">
              <strong>Sensor Kompas Aktif:</strong> Heading perangkat saat ini:{' '}
              <span className="font-mono font-bold">{deviceHeading}°</span>.
              {isAligned && (
                <span className="ml-1 text-emerald-700 font-bold block">
                  Perangkat Anda telah sejajar menghadap kiblat!
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <Info className="w-4 h-4 text-[#1352B9] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Panduan Manual:</strong>{' '}
              Arah kiblat untuk lokasi Anda adalah <strong>{qiblaResult.qiblaBearing}°</strong> (sekitar arah Barat Laut). Arahkan perangkat Anda ke sudut derajat tersebut dengan bantuan patokan arah Utara.
            </div>
          </div>
        )}

        {/* Calibration instructions */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
          <span className="font-bold text-slate-700 block mb-0.5">Tips Akurasi Kompas:</span>
          Jauhkan gawai dari benda bermagnet, casing berbahan logam tebal, atau kabel listrik besar. Gerakkan perangkat membentuk pola angka delapan (∞) di udara untuk mengkalibrasi sensor giroskop jika arah terasa bergeser.
        </div>
      </div>

      {/* Location Dialog */}
      <LocationPermissionDialog
        isOpen={showLocationDialog}
        onAllowGps={async () => {
          try {
            const coords = await locationService.getCurrentGpsLocation();
            setLocation(coords);
            setShowLocationDialog(false);
          } catch (e) {
            alert((e as Error).message);
          }
        }}
        onSelectCity={(cityId) => {
          const coords = locationService.selectPresetCity(cityId);
          setLocation(coords);
          setShowLocationDialog(false);
        }}
        onClose={() => setShowLocationDialog(false)}
      />
    </div>
  );
};
