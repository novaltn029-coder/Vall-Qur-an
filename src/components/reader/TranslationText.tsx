import React from 'react';
import { useApp } from '../../context/AppContext';

interface TranslationTextProps {
  translation: string;
  transliteration?: string;
  highlightQuery?: string;
}

export const TranslationText: React.FC<TranslationTextProps> = ({
  translation,
  transliteration,
  highlightQuery
}) => {
  const { settings } = useApp();

  const renderHighlighted = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;
    const q = query.trim();
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-2 mt-3 select-text">
      {settings.showTransliteration && transliteration && (
        <p className="text-sm italic text-[#1352B9] leading-relaxed font-sans">
          {transliteration}
        </p>
      )}

      {settings.showTranslation && (
        <p className="text-sm md:text-base text-slate-800 leading-relaxed font-sans">
          {renderHighlighted(translation, highlightQuery)}
        </p>
      )}
    </div>
  );
};
