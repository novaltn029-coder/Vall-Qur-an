/**
 * Hijri Calendar Service for val-qur'an
 * Converts Gregorian dates to Islamic (Hijri) dates using astronomical arithmetic
 * with support for manual rukyat correction adjustment (±1 / ±2 days),
 * monthly grid generation, and Islamic holidays (Hari Besar Islam).
 */

import { HijriDateInfo, IslamicHoliday } from '../types/worship';

export const HIJRI_MONTHS = [
  { id: 1, name: 'Muharram', arabic: 'مُحَرَّم' },
  { id: 2, name: 'Safar', arabic: 'صَفَر' },
  { id: 3, name: 'Rabi\'ul Awwal', arabic: 'رَبِيع الأَوَّل' },
  { id: 4, name: 'Rabi\'ul Akhir', arabic: 'رَبِيع الآخِر' },
  { id: 5, name: 'Jumadil Ula', arabic: 'جُمَادَى الأُولَى' },
  { id: 6, name: 'Jumadil Akhir', arabic: 'جُمَادَى الآخِرَة' },
  { id: 7, name: 'Rajab', arabic: 'رَجَب' },
  { id: 8, name: 'Sya\'ban', arabic: 'شَعْبَان' },
  { id: 9, name: 'Ramadan', arabic: 'رَمَضَان' },
  { id: 10, name: 'Syawwal', arabic: 'شَوَّال' },
  { id: 11, name: 'Dzulqa\'dah', arabic: 'ذُو القَعْدَة' },
  { id: 12, name: 'Dzulhijjah', arabic: 'ذُو الحِجَّة' }
];

export const ISLAMIC_HOLIDAYS: IslamicHoliday[] = [
  { hijriMonth: 1, hijriDay: 1, name: 'Tahun Baru Hijriah', description: '1 Muharram — Awal tahun baru dalam kalender Islam', isHolidayNational: true },
  { hijriMonth: 1, hijriDay: 9, name: 'Puasa Tasu\'a', description: 'Sunnah berpuasa sehari sebelum Asyura', isHolidayNational: false },
  { hijriMonth: 1, hijriDay: 10, name: 'Hari Asyura', description: 'Sunnah puasa Asyura pelebur dosa setahun yang lalu', isHolidayNational: false },
  { hijriMonth: 3, hijriDay: 12, name: 'Maulid Nabi Muhammad SAW', description: 'Kelahiran baginda Rasulullah SAW', isHolidayNational: true },
  { hijriMonth: 7, hijriDay: 27, name: 'Isra\' Mi\'raj', description: 'Perjalanan agung Rasulullah SAW dan perintah sholat 5 waktu', isHolidayNational: true },
  { hijriMonth: 8, hijriDay: 15, name: 'Malam Nisfu Sya\'ban', description: 'Malam penuh ampunan dan pengangkatan catatan amal', isHolidayNational: false },
  { hijriMonth: 9, hijriDay: 1, name: 'Awal Puasa Ramadan', description: 'Hari pertama ibadah puasa wajib bulan suci Ramadan', isHolidayNational: true },
  { hijriMonth: 9, hijriDay: 17, name: 'Nuzulul Qur\'an', description: 'Peringatan turunnya permulaan ayat Al-Qur\'an (Surat Al-\'Alaq)', isHolidayNational: false },
  { hijriMonth: 10, hijriDay: 1, name: 'Hari Raya Idul Fitri (Hari ke-1)', description: '1 Syawwal — Hari raya kemenangan setelah sebulan berpuasa', isHolidayNational: true },
  { hijriMonth: 10, hijriDay: 2, name: 'Hari Raya Idul Fitri (Hari ke-2)', description: '2 Syawwal — Perayaan Idul Fitri hari kedua', isHolidayNational: true },
  { hijriMonth: 12, hijriDay: 8, name: 'Hari Tarwiyah', description: 'Amalan jamaah haji menuju Mina', isHolidayNational: false },
  { hijriMonth: 12, hijriDay: 9, name: 'Hari Arafah & Puasa Arafah', description: 'Puncak wukuf di Arafah bagi haji & puasa sunnah penebus dosa 2 tahun', isHolidayNational: false },
  { hijriMonth: 12, hijriDay: 10, name: 'Hari Raya Idul Adha', description: '10 Dzulhijjah — Shalat Idul Adha & penyembelihan hewan kurban', isHolidayNational: true },
  { hijriMonth: 12, hijriDay: 11, name: 'Hari Tasyrik (Hari ke-1)', description: 'Dilarang berpuasa, dianjurkan memperbanyak takbir & tasyrik', isHolidayNational: false },
  { hijriMonth: 12, hijriDay: 12, name: 'Hari Tasyrik (Hari ke-2)', description: 'Hari tasyrik kedua', isHolidayNational: false },
  { hijriMonth: 12, hijriDay: 13, name: 'Hari Tasyrik (Hari ke-3)', description: 'Hari tasyrik ketiga penutup penyembelihan kurban', isHolidayNational: false }
];

const STORAGE_ADJUSTMENT_KEY = 'val_quran_hijri_adjustment_v1';

export const hijriCalendarService = {
  getAdjustmentDays(): number {
    try {
      const data = localStorage.getItem(STORAGE_ADJUSTMENT_KEY);
      if (data !== null) return parseInt(data, 10);
    } catch {
      // Ignore
    }
    return 0; // Default 0 day adjustment
  },

  setAdjustmentDays(days: number): void {
    try {
      localStorage.setItem(STORAGE_ADJUSTMENT_KEY, String(days));
    } catch {
      // Ignore
    }
  },

  /**
   * Gregorian to Hijri arithmetic conversion (Kuwaiti / Umm Al-Qura algorithm)
   */
  getHijriDate(gregorianDate: Date = new Date(), customAdjustment?: number): HijriDateInfo {
    const adj = customAdjustment !== undefined ? customAdjustment : this.getAdjustmentDays();

    // Adjusted date
    const d = new Date(gregorianDate.getTime() + adj * 86400000);

    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();

    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);

    if (y < 1583) b = 0;
    if (y === 1582) {
      if (m > 10) b = -10;
      if (m === 10) {
        b = 0;
        if (day > 4) b = -10;
      }
    }

    // Julian Day calculation
    let jd =
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      day +
      b -
      1524;

    b = 0;
    if (jd > 2299160) {
      a = Math.floor((jd - 1867216.25) / 36524.25);
      b = 1 + a - Math.floor(a / 4);
    }

    let bb = jd + b + 1524;
    let cc = Math.floor((bb - 122.1) / 365.25);
    let dd = Math.floor(365.25 * cc);
    let ee = Math.floor((bb - dd) / 30.6001);

    // Julian day to Hijri
    let epochAstro = 1948439.5;
    let epochCivic = 1948438.5;
    let shift = epochCivic;

    let z = jd - shift;
    let cyc = Math.floor(z / 10631);
    z -= cyc * 10631;
    let iy = Math.floor((z - 0.5) / 354.366);
    let hYear = 30 * cyc + iy;
    z -= Math.floor(iy * 354.366 + 0.5);
    let hMonth = Math.floor((z + 28.5) / 29.5);
    if (hMonth === 13) hMonth = 12;
    let hDay = Math.floor(z - Math.floor(29.5 * hMonth - 29) + 1);

    if (hDay > 30) {
      hDay = 30;
    }
    if (hDay <= 0) {
      hDay = 29;
    }

    const monthObj = HIJRI_MONTHS.find((hm) => hm.id === hMonth) || HIJRI_MONTHS[0];

    // Check holiday
    const holiday = ISLAMIC_HOLIDAYS.find(
      (h) => h.hijriMonth === hMonth && h.hijriDay === hDay
    );

    // Check Ayyamul Bidh (13, 14, 15 setiap bulan, kecuali 13 Dzulhijjah karena hari Tasyrik)
    const isAyyamulBidh =
      (hDay === 13 || hDay === 14 || hDay === 15) &&
      !(hMonth === 12 && hDay === 13) &&
      hMonth !== 9; // bukan di bulan Ramadan karena Ramadan sudah puasa wajib

    return {
      day: hDay,
      month: hMonth,
      monthName: monthObj.name,
      monthNameArabic: monthObj.arabic,
      year: hYear,
      formatted: `${hDay} ${monthObj.name} ${hYear} H`,
      gregorianDate,
      holiday: holiday?.name,
      isAyyamulBidh
    };
  },

  /**
   * Generates a monthly grid of calendar days for a specific Gregorian year & month
   */
  generateMonthGrid(year: number, monthIndex: number) {
    // First day of month
    const firstDay = new Date(year, monthIndex, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const days = [];

    // Fill preceding empty days from previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Fill days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const gDate = new Date(year, monthIndex, d);
      const hInfo = this.getHijriDate(gDate);
      days.push({
        gregorianDay: d,
        gregorianDate: gDate,
        hijriInfo: hInfo,
        isToday: this.isSameDay(gDate, new Date())
      });
    }

    return days;
  },

  isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
};
