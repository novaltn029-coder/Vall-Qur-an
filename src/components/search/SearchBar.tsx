import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Cari surat, ayat (misal 2:255), atau terjemahan...',
  autoFocus = false
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-11 pr-10 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl text-sm font-medium text-[#000000] placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#00A6FF] focus:border-[#1352B9] transition-all"
      />

      {value && (
        <button
          onClick={onClear}
          aria-label="Hapus kata kunci pencarian"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#031B4A] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
