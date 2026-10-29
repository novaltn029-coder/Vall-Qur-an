import React, { useState, useEffect } from 'react';
import { quranApi } from '../services/quranApi';
import { searchService, SearchResultItem } from '../services/searchService';
import { SurahSummary } from '../types/quran';
import { SearchBar } from '../components/search/SearchBar';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Search, BookOpen, ArrowRight, Sparkles, Database } from 'lucide-react';

interface SearchPageProps {
  onSelectResult: (surahNumber: number, ayahNumber?: number) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedSurahsCount, setCachedSurahsCount] = useState<number>(0);

  // Load 114 surahs for catalog search
  useEffect(() => {
    quranApi
      .getAllSurahs()
      .then((data) => {
        setSurahs(data);
        setCachedSurahsCount(searchService.getCachedSurahsCount());
      })
      .catch((e) => console.warn('Could not load surahs for search', e));
  }, []);

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute search when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    async function runSearch() {
      setIsLoading(true);
      try {
        const res = await searchService.search(debouncedQuery, surahs, controller.signal);
        if (isMounted) {
          setResults(res);
        }
      } catch (e) {
        console.warn('Search error:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    runSearch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [debouncedQuery, surahs]);

  const quickQueries = [
    { label: 'Ayat Kursi (2:255)', q: '2:255' },
    { label: 'Surat Al-Kahfi', q: 'Al-Kahfi' },
    { label: 'Surat Yasin', q: 'Yasin' },
    { label: 'Surat Ar-Rahman', q: 'Ar-Rahman' },
    { label: 'Sabar & Sholat', q: 'sabar' },
    { label: 'Cahaya (Nur)', q: 'cahaya' }
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl lg:max-w-5xl mx-auto w-full">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
          Pencarian Global Al-Qur'an
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Cari nama surat, nomor surat, referensi ayat (seperti 2:255), atau kata dalam terjemahan.
        </p>
      </div>

      {/* Search Bar Input */}
      <SearchBar
        value={query}
        onChange={setQuery}
        onClear={() => setQuery('')}
        autoFocus={true}
      />

      {/* Transparent Index Coverage Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <Database className="w-4 h-4 text-[#1352B9]" />
          <span>
            Cakupan Pencarian: <strong>114 Katalog Surat</strong> &amp;{' '}
            <strong>{cachedSurahsCount} Surat di Cache Memori</strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Format referensi cepat: ketik misal <code className="bg-slate-200 px-1 py-0.5 rounded">2:255</code>
        </span>
      </div>

      {/* Quick Search Suggestions */}
      {!query && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00A6FF]" /> Contoh Pencarian Cepat:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQueries.map((item) => (
              <button
                key={item.label}
                onClick={() => setQuery(item.q)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#1352B9] text-xs font-medium text-slate-700 rounded-xl hover:bg-[#C2DFF3]/30 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <LoadingState
          message="Mencari ayat dan surat yang cocok..."
          subMessage="Menelusuri database Al-Qur'an dan terjemahan"
        />
      )}

      {/* Empty result */}
      {!isLoading && debouncedQuery.trim() && results.length === 0 && (
        <EmptyState
          icon={Search}
          title="Tidak Ada Hasil Ditemukan"
          description={`Tidak ada kecocokan untuk "${debouncedQuery}". Coba kata kunci lain atau gunakan format "NomorSurat:NomorAyat" (contoh: 2:255).`}
          actionText="Bersihkan Pencarian"
          onAction={() => setQuery('')}
        />
      )}

      {/* Results List */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Ditemukan {results.length} hasil untuk "{debouncedQuery}"</span>
          </div>

          <div className="space-y-3">
            {results.map((item, idx) => (
              <div
                key={`${item.type}-${item.surahNumber}-${item.ayahNumber || 0}-${idx}`}
                onClick={() => onSelectResult(item.surahNumber, item.ayahNumber)}
                className="p-5 bg-white border border-[#E2E8F0] hover:border-[#1352B9] rounded-2xl shadow-2xs hover:shadow-sm cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#031B4A] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {item.surahNumber}
                    </span>
                    <span className="text-sm font-bold text-[#000000] group-hover:text-[#1352B9]">
                      Surat {item.surahNameLatin}
                      {item.ayahNumber ? ` : Ayat ${item.ayahNumber}` : ''}
                    </span>
                  </div>

                  <span
                    dir="rtl"
                    lang="ar"
                    className="font-arabic text-xl font-bold text-[#031B4A]"
                  >
                    {item.surahNameArabic}
                  </span>
                </div>

                {/* Match reason badge */}
                <div className="mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C2DFF3] text-[#031B4A]">
                    {item.matchReason}
                  </span>
                </div>

                {/* Arabic snippet */}
                {item.arabicSnippet && (
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic text-lg text-slate-900 my-2 leading-relaxed"
                  >
                    {item.arabicSnippet}
                  </p>
                )}

                {/* Translation snippet */}
                {item.translationSnippet && (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans line-clamp-3">
                    {item.translationSnippet}
                  </p>
                )}

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <span className="text-xs font-bold text-[#1352B9] group-hover:text-[#000000] inline-flex items-center gap-1">
                    Buka Ayat Ini <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
