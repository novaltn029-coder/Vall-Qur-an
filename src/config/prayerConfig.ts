/**
 * Centralized Prayer Schedule Configuration for val-qur'an
 * Single source of truth for the designated 5 daily prayer times in Asia/Jakarta (WIB).
 */

export interface PrayerItemConfig {
  key: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  name: string;
  arabicName: string;
  time: string; // HH:mm
  icon: string;
  label: string;
}

export const PRAYER_SCHEDULE = {
  timezone: 'Asia/Jakarta',
  label: 'WIB',
  regionName: 'Jakarta & Sekitarnya (WIB)',
  times: {
    subuh: '04:13',
    dzuhur: '11:43',
    ashar: '14:55',
    maghrib: '17:51',
    isya: '19:02'
  },
  terbit: '05:35', // Optional sunrise reference
  imsak: '04:03'   // Optional Imsak reference (10 mins before Subuh)
};

export const PRAYER_LIST: PrayerItemConfig[] = [
  {
    key: 'subuh',
    name: 'Subuh',
    arabicName: 'الفَجْر',
    time: PRAYER_SCHEDULE.times.subuh,
    icon: '🌅',
    label: '04:13 WIB'
  },
  {
    key: 'dzuhur',
    name: 'Dzuhur',
    arabicName: 'الظُّهْر',
    time: PRAYER_SCHEDULE.times.dzuhur,
    icon: '☀️',
    label: '11:43 WIB'
  },
  {
    key: 'ashar',
    name: 'Ashar',
    arabicName: 'العَصْر',
    time: PRAYER_SCHEDULE.times.ashar,
    icon: '🌤️',
    label: '14:55 WIB'
  },
  {
    key: 'maghrib',
    name: 'Maghrib',
    arabicName: 'المَغْرِب',
    time: PRAYER_SCHEDULE.times.maghrib,
    icon: '🌇',
    label: '17:51 WIB'
  },
  {
    key: 'isya',
    name: 'Isya',
    arabicName: 'العِشَاء',
    time: PRAYER_SCHEDULE.times.isya,
    icon: '🌙',
    label: '19:02 WIB'
  }
];

export interface PrayerCountdownState {
  currentPrayer: PrayerItemConfig | null;
  nextPrayer: PrayerItemConfig;
  remainingSeconds: number;
  formattedCountdown: string; // HH:mm:ss
  isNextDay: boolean;
  jakartaTimeString: string;
}

/**
 * Gets current date & time components in Asia/Jakarta timezone
 */
export function getJakartaCurrentDateParts(): {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const now = new Date();
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: PRAYER_SCHEDULE.timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const parts = dtf.formatToParts(now);
  const findPart = (type: string) => {
    const val = parts.find((p) => p.type === type)?.value;
    return val ? parseInt(val, 10) : 0;
  };

  const hourRaw = findPart('hour');
  // en-US 24-hr can return 24 for midnight in some older engines, normalize to 0
  const hour = hourRaw === 24 ? 0 : hourRaw;

  return {
    year: findPart('year'),
    month: findPart('month'),
    day: findPart('day'),
    hour,
    minute: findPart('minute'),
    second: findPart('second')
  };
}

/**
 * Parse "HH:mm" into minutes from start of day
 */
function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
  return h * 60 + m;
}

/**
 * Calculate dynamic next prayer and countdown in Asia/Jakarta timezone
 */
export function calculateNextPrayerCountdown(): PrayerCountdownState {
  const jakarta = getJakartaCurrentDateParts();
  const currentTotalMinutes = jakarta.hour * 60 + jakarta.minute;
  const currentTotalSeconds = currentTotalMinutes * 60 + jakarta.second;

  const prayersWithMinutes = PRAYER_LIST.map((p) => ({
    ...p,
    totalMinutes: parseTimeToMinutes(p.time),
    totalSeconds: parseTimeToMinutes(p.time) * 60
  }));

  let currentPrayer: PrayerItemConfig | null = null;
  let nextPrayer: PrayerItemConfig = prayersWithMinutes[0];
  let targetTotalSeconds = prayersWithMinutes[0].totalSeconds;
  let isNextDay = false;

  // Determine current active and next prayer
  if (currentTotalSeconds < prayersWithMinutes[0].totalSeconds) {
    // Before Subuh: next is Subuh today
    currentPrayer = null;
    nextPrayer = prayersWithMinutes[0];
    targetTotalSeconds = prayersWithMinutes[0].totalSeconds;
  } else if (currentTotalSeconds < prayersWithMinutes[1].totalSeconds) {
    // Between Subuh and Dzuhur
    currentPrayer = prayersWithMinutes[0];
    nextPrayer = prayersWithMinutes[1];
    targetTotalSeconds = prayersWithMinutes[1].totalSeconds;
  } else if (currentTotalSeconds < prayersWithMinutes[2].totalSeconds) {
    // Between Dzuhur and Ashar
    currentPrayer = prayersWithMinutes[1];
    nextPrayer = prayersWithMinutes[2];
    targetTotalSeconds = prayersWithMinutes[2].totalSeconds;
  } else if (currentTotalSeconds < prayersWithMinutes[3].totalSeconds) {
    // Between Ashar and Maghrib
    currentPrayer = prayersWithMinutes[2];
    nextPrayer = prayersWithMinutes[3];
    targetTotalSeconds = prayersWithMinutes[3].totalSeconds;
  } else if (currentTotalSeconds < prayersWithMinutes[4].totalSeconds) {
    // Between Maghrib and Isya
    currentPrayer = prayersWithMinutes[3];
    nextPrayer = prayersWithMinutes[4];
    targetTotalSeconds = prayersWithMinutes[4].totalSeconds;
  } else {
    // After Isya: Next is Subuh tomorrow!
    currentPrayer = prayersWithMinutes[4];
    nextPrayer = prayersWithMinutes[0];
    targetTotalSeconds = 24 * 3600 + prayersWithMinutes[0].totalSeconds;
    isNextDay = true;
  }

  const remainingSeconds = Math.max(0, targetTotalSeconds - currentTotalSeconds);
  const hrs = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedCountdown = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;

  const jakartaTimeString = `${pad(jakarta.hour)}:${pad(jakarta.minute)}:${pad(jakarta.second)} WIB`;

  return {
    currentPrayer,
    nextPrayer,
    remainingSeconds,
    formattedCountdown,
    isNextDay,
    jakartaTimeString
  };
}
