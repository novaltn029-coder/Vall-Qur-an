import React, { useState, useEffect, useMemo } from 'react';
import { quranApi } from '../services/quranApi';
import { SurahSummary } from '../types/quran';
import { SurahCard } from '../components/reader/SurahCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';
import { Search, BookOpen, Filter, X } from 'lucide-react';

interface SurahListPageProps {
  onSelectSurah: (surahNumber: number) => void;
}

type FilterType = 'all' | 'Mekah' | 'Madinah';

export const SurahListPage: React.FC<SurahListPageProps> = ({ onSelectSurah }) => {
  const { lastRead } = useApp();
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadSurahs() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await quranApi.getAllSurahs(controller.signal);
        if (isMounted) {
          setSurahs(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Gagal memuat daftar 114 surat.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSurahs();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const filteredSurahs = useMemo(() => {
    let list = surahs;

    if (filterType !== 'all') {
      list = list.filter((s) => s.tempatTurun.toLowerCase() === filterType.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.namaLatin.toLowerCase().includes(q) ||
          s.arti.toLowerCase().includes(q) ||
          s.nama.includes(searchQuery.trim()) ||
          s.nomor.toString() === q
      );
    }

    return list;
  }, [surahs, filterType, searchQuery]);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Daftar 114 Surat
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mushaf Al-Qur'an lengkap dengan teks Arab, terjemahan, dan audio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#C2DFF3]/50 text-[#031B4A] rounded-xl text-xs font-bold border border-[#C2DFF3]">
            {filteredSurahs.length} Surat Ditampilkan
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama surat (latin/arab), arti, atau nomor..."
            className="w-full pl-11 pr-10 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl text-sm font-medium text-[#000000] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A6FF] focus:border-[#1352B9] transition-all"
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

        {/* Filter chips: Semua, Makkiyah, Madaniyah */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              filterType === 'all'
                ? 'bg-[#000000] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua Surat (114)
          </button>

          <button
            onClick={() => setFilterType('Mekah')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              filterType === 'Mekah'
                ? 'bg-[#031B4A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Makkiyah (86)
          </button>

          <button
            onClick={() => setFilterType('Madinah')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              filterType === 'Madinah'
                ? 'bg-[#1352B9] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Madaniyah (28)
          </button>
        </div>
      </div>

      {/* Content states */}
      {isLoading && (
        <LoadingState
          message="Memuat daftar 114 surat Al-Qur'an..."
          subMessage="Menghubungkan ke API equran.id v2"
        />
      )}

      {error && (
        <ErrorState
          title="Tidak Dapat Memuat Surat"
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            quranApi
              .getAllSurahs()
              .then(setSurahs)
              .catch((e) => setError(e.message))
              .finally(() => setIsLoading(false));
          }}
        />
      )}

      {!isLoading && !error && filteredSurahs.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Surat Tidak Ditemukan"
          description={`Tidak ada surat yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lain atau bersihkan pencarian.`}
          actionText="Tampilkan Semua Surat"
          onAction={() => {
            setSearchQuery('');
            setFilterType('all');
          }}
        />
      )}

      {/* Grid of Surahs */}
      {!isLoading && !error && filteredSurahs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.nomor}
              surah={surah}
              onSelect={onSelectSurah}
              isLastRead={lastRead?.surahNumber === surah.nomor}
            />
          ))}
        </div>
      )}
    </div>
  );
};
