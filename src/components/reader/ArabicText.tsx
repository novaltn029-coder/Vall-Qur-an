import React from 'react';
import { useApp } from '../../context/AppContext';

interface ArabicTextProps {
  text: string;
  className?: string;
}

export const ArabicText: React.FC<ArabicTextProps> = ({ text, className = '' }) => {
  const { settings } = useApp();

  return (
    <div
      dir="rtl"
      lang="ar"
      className={`font-arabic text-[#000000] select-text break-words tracking-normal ${className}`}
      style={{
        fontSize: `${settings.arabicFontSize}px`,
        lineHeight: settings.arabicLineHeight
      }}
    >
      {text}
    </div>
  );
};
