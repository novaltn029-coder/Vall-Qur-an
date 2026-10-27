import React from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useApp();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="bg-[#031B4A] text-[#C2DFF3] text-xs py-2 px-4 flex items-center justify-center gap-2 border-b border-[#022478]"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#00A6FF]" />
      <span>
        Mode Offline: Menampilkan data Al-Qur'an dan riwayat yang tersimpan di perangkat Anda.
      </span>
    </div>
  );
};
