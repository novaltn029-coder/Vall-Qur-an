import React from 'react';
import { APP_CONFIG } from '../../config/app.config';

export const AppFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#E2E8F0] bg-[#F8FAFC] py-6 px-4 sm:px-6 lg:px-8 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
        {/* Logos in Footer: Gambar 1, 2, dan 3 (50px, logo only without name) */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
          <img
            src="/assets/aistudio/Picsart_26-10-29_14-24-45-911_87dd260a.png"
            alt="Logo"
            className="h-[50px] w-[50px] object-contain drop-shadow-xs transition-transform hover:scale-105"
          />
          <img
            src="/assets/aistudio/IMG-20261029-WA0002-removebg-preview_3d60d232.png"
            alt="Logo"
            className="h-[50px] w-[50px] object-contain drop-shadow-xs transition-transform hover:scale-105"
          />
          <img
            src="/assets/aistudio/Picsart_26-10-29_14-25-36-467_7949ac61.png"
            alt="Logo"
            className="h-[50px] w-[50px] object-contain drop-shadow-xs transition-transform hover:scale-105"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} {APP_CONFIG.appName} • {APP_CONFIG.tagline}</p>
        </div>
      </div>
    </footer>
  );
};
