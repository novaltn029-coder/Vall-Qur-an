/**
 * Tahlil Service for val-qur'an
 * Complete, structured authentic Tahlil reading sequence
 * based on standard Indonesian Kitab Majmu' Syarif.
 */

import { TahlilStep } from '../types/worship';

export const TAHLIL_SEQUENCE: TahlilStep[] = [
  {
    id: 1,
    title: '1. Pengantar Hadharah (Tawasul)',
    arabic: 'إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَآلِهِ وَأَزْوَاجِهِ وَذُرِّيَّاتِهِ وَأَهْلِ بَيْتِهِ الْكِرَامِ، شَيْءٌ لِلَّهِ لَهُمُ الْفَاتِحَةُ',
    transliteration: 'Ilā ḥaḍratin-nabiyyil-muṣṭafā Muḥammadin ṣallallāhu \'alaihi wa sallama wa ālihī wa azwājihī wa żurriyyātihī wa ahli baitihil-kirām, syai\'un lillāhi lahumul-Fātiḥah.',
    translation: 'Kepada yang mulia Nabi pilihan Muhammad SAW, segenap keluarga, istri-istri, keturunan, dan ahli baitnya yang mulia. Segala kepunyaan Allah, bagi mereka Al-Fatihah.',
    repeatCount: 1,
    notes: 'Membaca Surat Al-Fatihah'
  },
  {
    id: 2,
    title: '2. Surat Al-Fatihah',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration: 'Bismillāhir-raḥmānir-raḥīm. Al-ḥamdu lillāhi rabbil-\'ālamīn. Ar-raḥmānir-raḥīm. Māliki yaumid-dīn. Iyyāka na\'budu wa iyyāka nasta\'īn. Ihdinaṣ-ṣirāṭal-mustaqīm. Ṣirāṭallażīna an\'amta \'alaihim gairil-magḍūbi \'alaihim wa laḍ-ḍāllīn. Āmīn.',
    translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus, (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
    repeatCount: 1
  },
  {
    id: 3,
    title: '3. Surat Al-Ikhlas & Tahlil',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ\n\nلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
    transliteration: 'Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahū kufuwan aḥad. (3x)\n\nLā ilāha illallāhu wallāhu akbar wa lillāhil-ḥamd.',
    translation: 'Katakanlah: "Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia." (3x)\n\nTiada tuhan selain Allah, Allah Maha Besar dan bagi Allah segala puji.',
    repeatCount: 3,
    notes: 'Sunnah dibaca sebanyak 3 kali'
  },
  {
    id: 4,
    title: '4. Surat Al-Falaq & Tahlil',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ\n\nلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
    transliteration: 'Qul a\'ūżu birabbil-falaq. Min syarri mā khalaq. Wa min syarri gāsiqin iżā waqab. Wa min syarrin-naffāṡāti fil-\'uqad. Wa min syarri ḥāsidin iżā ḥasad.\n\nLā ilāha illallāhu wallāhu akbar wa lillāhil-ḥamd.',
    translation: 'Katakanlah: "Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki."\n\nTiada tuhan selain Allah, Allah Maha Besar dan bagi Allah segala puji.',
    repeatCount: 1
  },
  {
    id: 5,
    title: '5. Surat An-Nas & Tahlil',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ\n\nلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
    transliteration: 'Qul a\'ūżu birabbin-nās. Malikin-nās. Ilāhin-nās. Min syarril-waswāsil-khannās. Allażī yuwaswisu fī ṣudūrin-nās. Minal-jinnati wan-nās.\n\nLā ilāha illallāhu wallāhu akbar wa lillāhil-ḥamd.',
    translation: 'Katakanlah: "Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan manusia. Dari kejahatan (bisikan) setan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia."\n\nTiada tuhan selain Allah, Allah Maha Besar dan bagi Allah segala puji.',
    repeatCount: 1
  },
  {
    id: 6,
    title: '6. Awal Surat Al-Baqarah (Ayat 1-5)',
    arabic: 'الۤمۤ ۝ ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ ۝ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ ۝ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ۝ أُولَئِكَ عَلَى هُدًى مِنْ رَبِّهِمْ وَأُولَئِكَ هُمُ الْمُفْلِحُونَ',
    transliteration: 'Alif-lām-mīm. Żālikal-kitābu lā raiba fīh, hudal-lil-muttaqīn. Allażīna yu\'minūna bil-gaibi wa yuqīmūnaṣ-ṣalāta wa mimmā razaqnāhum yunfiqūn. Wallażīna yu\'minūna bimā unzila ilaika wa mā unzila min qablika wa bil-ākhirati hum yūqinūn. Ulā\'ika \'alā hudam-mir-rabbihim wa ulā\'ika humul-mufliḥūn.',
    translation: 'Alif Lam Mim. Kitab (Al-Qur\'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa, (yaitu) mereka yang beriman kepada yang ghaib, yang mendirikan shalat, dan menafkahkan sebahagian rezeki yang Kami anugerahkan kepada mereka. Dan mereka yang beriman kepada Kitab yang telah diturunkan kepadamu dan Kitab-kitab yang telah diturunkan sebelummu, serta mereka yakin akan adanya (kehidupan) akhirat. Mereka itulah yang tetap mendapat petunjuk dari Tuhan mereka, dan merekalah orang-orang yang beruntung.',
    repeatCount: 1
  },
  {
    id: 7,
    title: '7. Ayat Kursi (Al-Baqarah: 255)',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta\'khużuhū sinatuw-wa lā na\'ūm, lahū mā fis-samāwāti wa mā fil-arḍ, man żallażī yasyfa\'u \'indahū illā bi\'iżnih, ya\'lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭūna bisyai\'im-min \'ilmihī illā bimā syā\', wasi\'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya\'ūduhū ḥifẓuhumā, wa huwal-\'aliyyul-\'aẓīm.',
    translation: 'Allah, tidak ada tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus-menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa\'at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.',
    repeatCount: 1
  },
  {
    id: 8,
    title: '8. Akhir Surat Al-Baqarah (Ayat 284-286)',
    arabic: 'لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ وَإِنْ تُبْدُوا مَا فِي أَنْفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُمْ بِهِ اللَّهُ فَيَغْفِرُ لِمَنْ يَشَاءُ وَيُعَذِّبُ مَنْ يَشَاءُ وَاللَّهُ عَلَى كُلِّ شَيْءٍ قَدِيرٌ ۝ آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: 'Lillāhi mā fis-samāwāti wa mā fil-arḍ... Rabbanā lā tu\'ākhiżnā in nasīnā au akhṭa\'nā... Wa\'fu \'annā wagfir lanā warḥamnā anta maulānā fanṣurnā \'alal-qaumil-kāfirīn.',
    translation: 'Kepunyaan Allah-lah segala apa yang ada di langit dan apa yang ada di bumi... "Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami tersalah... Maafkanlah kami; ampunilah kami; dan rahmatilah kami. Engkaulah Penolong kami, maka tolonglah kami terhadap kaum yang kafir."',
    repeatCount: 1
  },
  {
    id: 9,
    title: '9. Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullāhal-\'aẓīm allazī lā ilāha illā huwal-ḥayyul-qayyūm wa atūbu ilaih.',
    translation: 'Aku memohon ampunan kepada Allah Yang Maha Agung, yang tiada tuhan selain Dia Yang Hidup kekal lagi terus-menerus mengurus (makhluk-Nya), dan aku bertaubat kepada-Nya.',
    repeatCount: 3,
    notes: 'Dibaca sebanyak 3 kali'
  },
  {
    id: 10,
    title: '10. Tahlil Utama',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illallāh.',
    translation: 'Tiada tuhan selain Allah.',
    repeatCount: 33,
    notes: 'Dapat dibaca 33 kali atau 100 kali dengan penuh kekhusyukan'
  },
  {
    id: 11,
    title: '11. Kalimat Thayyibah & Syahadat',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، كَلِمَةُ حَقٍّ عَلَيْهَا نَحْيَا وَعَلَيْهَا نَمُوتُ وَبِهَا نُبْعَثُ إِنْ شَاءَ اللَّهُ تَعَالَى مِنَ الْآمِنِينَ',
    transliteration: 'Lā ilāha illallāhu Muḥammadur-rasūlullāhi ṣallallāhu \'alaihi wa sallam, kalimatu ḥaqqin \'alaihā naḥyā wa \'alaihā namūtu wa bihā nub\'aṡu in syā\'allāhu ta\'ālā minal-āminīn.',
    translation: 'Tiada tuhan selain Allah, Muhammad adalah utusan Allah semoga shalawat dan salam tercurah kepadanya. Kalimat kebenaran yang di atasnya kami hidup, di atasnya kami mati, dan dengannya kami akan dibangkitkan insya Allah termasuk golongan orang-orang yang aman.',
    repeatCount: 1
  },
  {
    id: 12,
    title: '12. Shalawat Nabi',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ، اللَّهُمَّ صَلِّ عَلَيْهِ وَسَلِّمْ',
    transliteration: 'Allāhumma ṣalli \'alā sayyidinā Muḥammad, Allāhumma ṣalli \'alaihi wa sallim.',
    translation: 'Ya Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad. Ya Allah, limpahkanlah rahmat dan kesejahteraan kepadanya.',
    repeatCount: 3,
    notes: 'Dibaca sebanyak 3 kali'
  },
  {
    id: 13,
    title: '13. Tasbih & Tahmid',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subḥānallāhi wa biḥamdihī subḥānallāhil-\'aẓīm.',
    translation: 'Maha Suci Allah dengan memuji-Nya, Maha Suci Allah Yang Maha Agung.',
    repeatCount: 33,
    notes: 'Dua kalimat yang ringan di lisan namun berat di timbangan mizan'
  },
  {
    id: 14,
    title: '14. Do\'a Tahlil Penutup',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ. اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ. اللَّهُمَّ تَقَبَّلْ وَأَوْصِلْ ثَوَابَ مَا قَرَأْنَاهُ مِنَ الْقُرْآنِ الْعَظِيمِ، وَمَا هَلَّلْنَا، وَمَا سَبَّحْنَا، وَمَا اسْتَغْفَرْنَا، وَمَا صَلَّيْنَا عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، هَدِيَّةً وَاصِلَةً، وَرَحْمَةً نَازِلَةً، وَبَرَكَةً شَامِلَةً إِلَى حَضْرَةِ حَبِيبِنَا وَشَفِيعِنَا وَقُرَّةِ أَعْيُنِنَا سَيِّدِنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، ثُمَّ إِلَى أَرْوَاحِ جَمِيعِ إِخْوَانِهِ مِنَ الْأَنْبِيَاءِ وَالْمُرْسَلِينَ، وَالْأَوْلِيَاءِ وَالشُّهَدَاءِ وَالصَّالِحِينَ، وَخُصُوصًا إِلَى أَرْوَاحِ مَنْ جَمَعْنَا هَهُنَا بِسَبَبِهِ. اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَعَافِهِمْ وَاعْفُ عَنْهُمْ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.',
    transliteration: 'Al-ḥamdu lillāhi rabbil-\'ālamīn... Allāhumma taqabbal wa auṣil ṡawāba mā qara\'nāhu minal-Qur\'ānil-\'aẓīm... Allāhummagfir lahum warḥamhum wa \'āfihim wa\'fu \'anhum. Rabbanā ātinā fid-dunyā ḥasanah wa fil-ākhirati ḥasanah wa qinā \'ażāban-nār.',
    translation: 'Segala puji bagi Allah Tuhan semesta alam. Ya Allah, sampaikanlah dan terimalah pahala bacaan Al-Qur\'an, tahlil, tasbih, istighfar, dan shalawat kami sebagai hadiah dan limpahan rahmat kepada Nabi Muhammad SAW, para nabi, wali, syuhada, kaum shalihin, dan terkhusus arwah orang-orang beriman yang kami sebutkan. Ya Allah, ampunilah mereka, rahmatilah mereka, selamatkanlah mereka, dan maafkanlah kesalahan mereka. Ya Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat serta peliharalah kami dari siksa api neraka.',
    repeatCount: 1,
    notes: 'Do\'a penutup untuk memohon maghfirah dan keselamatan arwah kaum muslimin'
  }
];

export const tahlilService = {
  getSequence(): TahlilStep[] {
    return TAHLIL_SEQUENCE;
  },

  getStep(stepId: number): TahlilStep | undefined {
    return TAHLIL_SEQUENCE.find((s) => s.id === stepId);
  }
};
