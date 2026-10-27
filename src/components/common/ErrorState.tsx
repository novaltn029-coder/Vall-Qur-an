import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Data',
  message,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm my-6">
      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#031B4A] mb-2">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#000000] text-[#FFFFFF] rounded-xl hover:bg-[#031B4A] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6FF]"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Muat Ulang
        </button>
      )}
    </div>
  );
};
