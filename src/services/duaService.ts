/**
 * Daily Dua (Do'a Harian) Service for val-qur'an
 * Contains verified, authentic supplications with Arabic, Latin transliteration,
 * Indonesian translation, and Sahih hadith/Quran references.
 */

import { DailyDua } from '../types/worship';

export const AUTHENTIC_DUAS: DailyDua[] = [
  {
    id: 'dua-makan-sebelum',
    title: 'Do\'a Sebelum Makan',
    category: 'Makan & Minum',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillāh.',
    translation: 'Dengan menyebut nama Allah.',
    reference: 'HR. Abu Dawud no. 3767 & At-Tirmidzi no. 1858 (Shahih)',
    benefits: 'Menjaga keberkahan makanan dan mencegah setan ikut serta menyantap makanan.'
  },
  {
    id: 'dua-makan-sesudah',
    title: 'Do\'a Sesudah Makan',
    category: 'Makan & Minum',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Al-ḥamdu lillāhillażī aṭ\'amanī hāżā wa razaqanīhi min gairi ḥaulin minnī wa lā quwwah.',
    translation: 'Segala puji bagi Allah yang telah memberiku makanan ini dan menganugerahkannya kepadaku tanpa daya dan kekuatan dariku.',
    reference: 'HR. Abu Dawud no. 4023 & At-Tirmidzi no. 3458 (Hasan)',
    benefits: 'Diampuni dosa-dosanya yang telah lalu.'
  },
  {
    id: 'dua-tidur-sebelum',
    title: 'Do\'a Sebelum Tidur',
    category: 'Tidur & Bangun',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allāhumma amūtu wa aḥyā.',
    translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    reference: 'HR. Bukhari no. 6312 & Muslim no. 2711',
    benefits: 'Menyerahkan jiwa raga dalam perlindungan Allah selama terlelap.'
  },
  {
    id: 'dua-tidur-bangun',
    title: 'Do\'a Bangun Tidur',
    category: 'Tidur & Bangun',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Al-ḥamdu lillāhillażī aḥyānā ba\'da mā amātanā wa ilaihin-nusyūr.',
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan hanya kepada-Nya kami dibangkitkan.',
    reference: 'HR. Bukhari no. 6314 & Muslim no. 2711',
    benefits: 'Bentuk syukur atas nikmat ruh yang dikembalikan untuk beribadah di hari baru.'
  },
  {
    id: 'dua-rumah-keluar',
    title: 'Do\'a Keluar Rumah',
    category: 'Rumah & Perjalanan',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillāhi tawakkaltu \'alallāh, lā ḥaula wa lā quwwata illā billāh.',
    translation: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.',
    reference: 'HR. Abu Dawud no. 5095 & At-Tirmidzi no. 3426 (Shahih)',
    benefits: 'Diberi petunjuk, dicukupi kebutuhan, dan dilindungi dari godaan setan selama di luar.'
  },
  {
    id: 'dua-rumah-masuk',
    title: 'Do\'a Masuk Rumah',
    category: 'Rumah & Perjalanan',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillāhi walajnā, wa bismillāhi kharajnā, wa \'alā rabbinā tawakkalnā.',
    translation: 'Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar, dan kepada Tuhan kami, kami bertawakal.',
    reference: 'HR. Abu Dawud no. 5096 (Hasan)',
    benefits: 'Menghadirkan salam dan kedamaian dalam rumah tangga.'
  },
  {
    id: 'dua-masjid-masuk',
    title: 'Do\'a Masuk Masjid',
    category: 'Masjid & Ibadah',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allāhummaftaḥ lī abwāba raḥmatik.',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    reference: 'HR. Muslim no. 713',
    benefits: 'Didahulukan kaki kanan untuk melangkah menuju kebaikan dan naungan rahmat ilahi.'
  },
  {
    id: 'dua-masjid-keluar',
    title: 'Do\'a Keluar Masjid',
    category: 'Masjid & Ibadah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allāhumma innī as\'aluka min faḍlik.',
    translation: 'Ya Allah, sesungguhnya aku memohon keutamaan dan karunia dari-Mu.',
    reference: 'HR. Muslim no. 713',
    benefits: 'Memohon berkah rezeki halal saat kembali berikhtiar di muka bumi.'
  },
  {
    id: 'dua-kendaraan',
    title: 'Do\'a Naik Kendaraan / Bepergian',
    category: 'Rumah & Perjalanan',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subḥānallażī sakhkhara lanā hāżā wa mā kunnā lahū muqrinīn, wa innā ilā rabbinā lamunqalibūn.',
    translation: 'Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kepada Tuhan kamilah kami akan kembali.',
    reference: 'QS. Az-Zukhruf: 13-14 & HR. Muslim no. 1342',
    benefits: 'Perlindungan dari bahaya kecelakaan dan kelancaran selama perjalanan.'
  },
  {
    id: 'dua-orang-tua',
    title: 'Do\'a untuk Kedua Orang Tua',
    category: 'Keluarga & Diri',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbigfir lī wa liwālidayya warḥamhumā kamā rabbayānī ṣagīrā.',
    translation: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, serta sayangilah keduanya sebagaimana mereka telah mendidikku di waktu kecil.',
    reference: 'QS. Al-Isra\': 24 & Ibrahim: 41',
    benefits: 'Kewajiban bakti anak shaleh yang pahalanya senantiasa mengalir kepada orang tua.'
  },
  {
    id: 'dua-ilmu',
    title: 'Do\'a Memohon Tambahan Ilmu yang Bermanfaat',
    category: 'Ilmu & Rezeki',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: 'Allāhumma innī as\'aluka \'ilman nāfi\'ā, wa rizqan ṭayyibā, wa \'amalan mutaqabbalā.',
    translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang halal dan baik, serta amal perbuatan yang diterima.',
    reference: 'HR. Ibnu Majah no. 925 & Ahmad no. 26521 (Shahih)',
    benefits: 'Dibaca Rasulullah SAW setelah shalat Subuh untuk kelapangan hidup.'
  },
  {
    id: 'dua-sayyidul-istighfar',
    title: 'Sayyidul Istighfar (Penghulu Istighfar)',
    category: 'Ampunan & Taubat',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā \'abduka, wa anā \'alā \'ahdika wa wa\'dika mastaṭa\'tu, a\'ūżu bika min syarri mā ṣana\'tu, abū\'u laka bini\'matika \'alayya, wa abū\'u biżanbī fagfir lī fa-innahū lā yagfiruż-żunūba illā anta.',
    translation: 'Ya Allah, Engkaulah Tuhanku, tiada tuhan selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku senantiasa menepati janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan apa yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku. Karena sesungguhnya tiada yang mengampuni dosa melainkan Engkau.',
    reference: 'HR. Bukhari no. 6306',
    benefits: 'Barang siapa membacanya dengan yakin di waktu petang lalu meninggal, ia termasuk penghuni surga; demikian pula di waktu pagi.'
  },
  {
    id: 'dua-perlindungan-marabahaya',
    title: 'Do\'a Perlindungan dari Marabahaya & Keburukan',
    category: 'Perlindungan',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillāhillażī lā yaḍurru ma\'asmihī syai\'un fil-arḍi wa lā fis-samā\'i wa huwas-samī\'ul-\'alīm.',
    translation: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat mendatangkan mudarat, dan Dia Maha Mendengar lagi Maha Mengetahui.',
    reference: 'HR. Abu Dawud no. 5088 & At-Tirmidzi no. 3388 (Shahih)',
    benefits: 'Dibaca 3 kali pagi dan petang, dijauhkan dari segala petaka mendadak dan bahaya.'
  },
  {
    id: 'dua-pagi-ashbahna',
    title: 'Dzikir Pagi Hari',
    category: 'Pagi & Petang',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā syarīka lah.',
    translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah. Segala puji bagi Allah, tiada tuhan yang berhak disembah selain Allah semata, tiada sekutu bagi-Nya.',
    reference: 'HR. Muslim no. 2723',
    benefits: 'Mengawali hari dengan tauhid dan penyerahan kedaulatan mutlak kepada Allah SWT.'
  },
  {
    id: 'dua-petang-amsayna',
    title: 'Dzikir Petang Hari',
    category: 'Pagi & Petang',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā syarīka lah.',
    translation: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah. Segala puji bagi Allah, tiada tuhan yang berhak disembah selain Allah semata, tiada sekutu bagi-Nya.',
    reference: 'HR. Muslim no. 2723',
    benefits: 'Menutup aktivitas siang dengan dzikir ketenangan jiwa.'
  },
  {
    id: 'dua-sakit-menjenguk',
    title: 'Do\'a Menjenguk Orang Sakit',
    category: 'Kesehatan & Doa',
    arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
    transliteration: 'As\'alullāhal-\'aẓīma rabbal-\'arsyil-\'aẓīmi an yasyfiyak.',
    translation: 'Aku memohon kepada Allah Yang Maha Agung, Tuhan Pemilik \'Arsy yang agung, agar Dia menyembuhkanmu.',
    reference: 'HR. Abu Dawud no. 3106 & At-Tirmidzi no. 2083 (Shahih)',
    benefits: 'Dibaca sebanyak 7 kali di hadapan orang sakit, melahirkan harapan kesembuhan bi-idznillah.'
  },
  {
    id: 'dua-wudhu-sesudah',
    title: 'Do\'a Sesudah Berwudhu',
    category: 'Masjid & Ibadah',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliteration: 'Asyhadu allā ilāha illallāhu waḥdahū lā syarīka lah, wa asyhadu anna Muḥammadan \'abduhū wa rasūluh, Allāhummaj\'alnī minat-tawwābīna waj\'alnī minal-mutaṭahhirīn.',
    translation: 'Aku bersaksi bahwa tiada tuhan selain Allah semata yang tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang menyucikan diri.',
    reference: 'HR. Muslim no. 234 & At-Tirmidzi no. 55',
    benefits: 'Dibukakan delapan pintu surga dan boleh masuk dari pintu mana saja yang dikehendaki.'
  }
];

const STORAGE_BOOKMARKS_KEY = 'val_quran_dua_bookmarks_v1';

export const duaService = {
  getAllDuas(): DailyDua[] {
    const bookmarkedIds = this.getBookmarkedDuaIds();
    return AUTHENTIC_DUAS.map((d) => ({
      ...d,
      isBookmarked: bookmarkedIds.includes(d.id)
    }));
  },

  getCategories(): string[] {
    const cats = new Set<string>();
    AUTHENTIC_DUAS.forEach((d) => cats.add(d.category));
    return Array.from(cats);
  },

  getDuaById(id: string): DailyDua | undefined {
    const found = AUTHENTIC_DUAS.find((d) => d.id === id);
    if (!found) return undefined;
    return {
      ...found,
      isBookmarked: this.isDuaBookmarked(id)
    };
  },

  searchDuas(query: string, category?: string): DailyDua[] {
    let list = this.getAllDuas();

    if (category && category !== 'Semua') {
      list = list.filter((d) => d.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.translation.toLowerCase().includes(q) ||
          d.transliteration.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getBookmarkedDuaIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return [];
  },

  toggleBookmarkDua(id: string): boolean {
    const current = this.getBookmarkedDuaIds();
    const exists = current.includes(id);
    let updated: string[];

    if (exists) {
      updated = current.filter((item) => item !== id);
    } else {
      updated = [id, ...current];
    }

    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return !exists;
  },

  isDuaBookmarked(id: string): boolean {
    return this.getBookmarkedDuaIds().includes(id);
  }
};
