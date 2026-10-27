import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicSnippet: string;
  translationSnippet: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  surahNumber,
  surahNameLatin,
  surahNameArabic,
  ayahNumber,
  arabicSnippet,
  translationSnippet
}) => {
  const { isBookmarked, addBookmark, removeBookmark } = useApp();
  const bookmarked = isBookmarked(surahNumber, ayahNumber);

  const handleToggle = () => {
    if (bookmarked) {
      removeBookmark(surahNumber, ayahNumber);
    } else {
      addBookmark({
        surahNumber,
        surahNameLatin,
        surahNameArabic,
        ayahNumber,
        arabicSnippet,
        translationSnippet
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={bookmarked ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}
      className={`p-2 rounded-xl transition-colors ${
        bookmarked
          ? 'bg-[#C2DFF3] text-[#031B4A]'
          : 'text-slate-400 hover:text-[#031B4A] hover:bg-slate-100'
      }`}
    >
      <Bookmark
        className={`w-4 h-4 ${bookmarked ? 'fill-[#031B4A] text-[#031B4A]' : 'text-current'}`}
      />
    </button>
  );
};
