/**
 * val-qur'an — Central Application Configuration
 * 
 * Pengembang dapat menyesuaikan konfigurasi aplikasi di file ini:
 * - appName: Nama aplikasi resmi
 * - tagline: Slogan aplikasi
 * - colors: 7 palet warna wajib (black, navy, deepBlue, blue, electricBlue, iceBlue, white)
 * - tokens: Pemetaan semantik untuk background, surface, teks, border, tombol, navigasi, dan focus ring
 * - apiBaseUrl: Endpoint API resmi equran.id v2
 * - qariList: 6 Qari resmi yang didukung oleh API v2
 */

export const APP_CONFIG = {
  appName: "val-qur'an",
  tagline: "Teman Tilawah dalam Genggaman.",
  primaryColor: "#000000",

  colors: {
    black: "#000000",
    navy: "#031B4A",
    deepBlue: "#022478",
    blue: "#1352B9",
    electricBlue: "#00A6FF",
    iceBlue: "#C2DFF3",
    white: "#FFFFFF"
  },

  tokens: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#F8FAFC",
    surfaceHighlight: "#C2DFF3",
    textPrimary: "#000000",
    textSecondary: "#031B4A",
    textMuted: "#64748B",
    border: "#E2E8F0",
    borderActive: "#1352B9",
    primaryButtonBg: "#000000",
    primaryButtonText: "#FFFFFF",
    secondaryButtonBg: "#1352B9",
    secondaryButtonText: "#FFFFFF",
    accentInteractive: "#00A6FF",
    focusRing: "#00A6FF",
    navBg: "#031B4A",
    navText: "#FFFFFF",
    navActive: "#00A6FF"
  },

  language: "id-ID",
  direction: "ltr",
  theme: "light",
  apiBaseUrl: "https://equran.id/api/v2",

  // 6 Qari resmi terverifikasi dari equran.id v2
  qariList: [
    { id: "01", name: "Abdullah Al-Juhany", slug: "Abdullah-Al-Juhany" },
    { id: "02", name: "Abdul Muhsin Al-Qasim", slug: "Abdul-Muhsin-Al-Qasim" },
    { id: "03", name: "Abdurrahman as-Sudais", slug: "Abdurrahman-as-Sudais" },
    { id: "04", name: "Ibrahim Al-Dossari", slug: "Ibrahim-Al-Dossari" },
    { id: "05", name: "Misyari Rasyid Al-Afasi", slug: "Misyari-Rasyid-Al-Afasi" },
    { id: "06", name: "Yasser Al-Dosari", slug: "Yasser-Al-Dosari" }
  ],

  // Pengaturan default bacaan
  readerDefaults: {
    arabicFontSize: 28, // px
    arabicLineHeight: 2.2,
    showTranslation: true,
    showTransliteration: false,
    autoScrollSpeed: 1, // multiplier 1x (0.5x, 1x, 1.5x, 2x, 3x)
    defaultQariId: "05", // Misyari Rasyid Al-Afasi
    dailyTargetAyat: 10
  },

  version: "1.0.0",
  sourceAttribution: "equran.id & Kementerian Agama RI (Kemenag)"
} as const;

export type AppConfig = typeof APP_CONFIG;
