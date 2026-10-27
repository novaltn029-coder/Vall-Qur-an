import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  ChevronRight,
  Filter,
  X,
  Sparkles
} from 'lucide-react';
import { duaService } from '../../services/duaService';
import { DailyDua } from '../../types/worship';
import { EmptyState } from '../../components/common/EmptyState';

interface DuaListPageProps {
  onSelectDua: (duaId: string) => void;
}

export const DuaListPage: React.FC<DuaListPageProps> = ({ onSelectDua }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  const categories = useMemo(() => ['Semua', ...duaService.getCategories()], []);

  const filteredDuas = useMemo(() => {
    let list = duaService.searchDuas(searchQuery, selectedCategory);
    if (showBookmarksOnly) {
      list = list.filter((d) => d.isBookmarked);
    }
    return list;
  }, [searchQuery, selectedCategory, showBookmarksOnly]);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Kumpulan Do'a Harian Sahih
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Do'a pilihan bersumber dari Al-Qur'an dan Sunnah Rasulullah SAW dengan sanad terpercaya.
          </p>
        </div>

        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto border ${
            showBookmarksOnly
              ? 'bg-[#000000] text-white border-black'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
          <span>Bookmark Do'a</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari do'a (misal: makan, tidur, istighfar, keluar rumah)..."
          className="w-full pl-11 pr-10 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6FF] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Kategori:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setShowBookmarksOnly(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === cat && !showBookmarksOnly
                ? 'bg-[#031B4A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Duas List */}
      {filteredDuas.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Do'a Tidak Ditemukan"
          description={
            showBookmarksOnly
              ? 'Anda belum menandai do\'a sebagai bookmark. Ketuk ikon bookmark di halaman do\'a untuk menyimpannya.'
              : `Tidak ada do'a yang sesuai dengan kata kunci "${searchQuery}".`
          }
          actionText={showBookmarksOnly ? 'Tampilkan Semua Do\'a' : 'Bersihkan Filter'}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('Semua');
            setShowBookmarksOnly(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredDuas.map((dua) => (
            <div
              key={dua.id}
              onClick={() => onSelectDua(dua.id)}
              className="p-5 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl shadow-2xs hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#031B4A] border border-slate-200">
                    {dua.category}
                  </span>
                  {dua.isBookmarked && (
                    <Bookmark className="w-3.5 h-3.5 fill-[#1352B9] text-[#1352B9]" />
                  )}
                </div>

                <h3 className="text-base font-bold text-[#000000] group-hover:text-[#1352B9] transition-colors">
                  {dua.title}
                </h3>

                {/* Short Arabic Preview */}
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-lg text-slate-800 my-2 line-clamp-1"
                >
                  {dua.arabic}
                </p>

                {/* Short Translation Preview */}
                <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">
                  "{dua.translation}"
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[200px]">{dua.reference}</span>
                <span className="text-xs font-bold text-[#1352B9] group-hover:underline flex items-center gap-0.5">
                  Baca Do'a <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
