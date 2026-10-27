import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';
  const isError = toast.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-8 right-4 left-4 md:left-auto md:w-96 z-50 flex items-center justify-between p-3.5 bg-[#031B4A] text-[#FFFFFF] border border-[#022478] rounded-xl shadow-xl transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#00A6FF] shrink-0" />}
        {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-[#00A6FF] shrink-0" />}
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={clearToast}
        aria-label="Tutup notifikasi"
        className="p-1 hover:bg-[#022478] rounded-lg transition-colors text-slate-300 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
