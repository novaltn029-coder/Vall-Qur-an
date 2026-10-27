import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface OfflineDataNoticeProps {
  sourceDescription: string;
  isOfflineMode?: boolean;
}

export const OfflineDataNotice: React.FC<OfflineDataNoticeProps> = ({
  sourceDescription,
  isOfflineMode = false
}) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
      <ShieldCheck className="w-4 h-4 text-[#1352B9] shrink-0" />
      <span className="leading-snug">
        Sumber &amp; Atribusi: <strong className="text-slate-700">{sourceDescription}</strong>
        {isOfflineMode && ' (Tersedia offline langsung di perangkat tanpa kuota).'}
      </span>
    </div>
  );
};
