import React from 'react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Memuat data Al-Qur'an...",
  subMessage = "Menghubungkan ke server equran.id"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-8">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-[#C2DFF3] opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#00A6FF] border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-base font-semibold text-[#031B4A]">{message}</h3>
      {subMessage && <p className="text-xs text-slate-500 mt-1">{subMessage}</p>}
    </div>
  );
};
