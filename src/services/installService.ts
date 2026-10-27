/**
 * Install & Mobile Packaging Service for val-qur'an
 * Provides verified platform install instructions, Capacitor native build configuration guide,
 * and PWA install lifecycle management.
 */

import { platformService, PlatformType } from './platformService';

export interface MobileBuildInfo {
  version: string;
  appId: string;
  appName: string;
  androidPackageName: string;
  iosBundleId: string;
  hasNativeSdkLocally: boolean;
  statusNote: string;
}

export const BUILD_INFO: MobileBuildInfo = {
  version: '1.1.0',
  appId: 'com.valquran.app',
  appName: "val-qur'an",
  androidPackageName: 'com.valquran.app',
  iosBundleId: 'com.valquran.app',
  hasNativeSdkLocally: false, // Verified via audit: Java & Android SDK are absent in web container
  statusNote: 'Source project Capacitor telah dikonfigurasi lengkap (capacitor.config.ts). Kode siap dibuild menjadi APK/AAB di Android Studio atau IPA di macOS Xcode.'
};

export const installService = {
  getBuildInfo(): MobileBuildInfo {
    return BUILD_INFO;
  },

  getNativeExportCommands() {
    return [
      {
        step: 1,
        title: 'Build Web Assets',
        cmd: 'npm run build',
        desc: 'Menghasilkan bundle statis produksi ke folder dist/'
      },
      {
        step: 2,
        title: 'Tambahkan Platform Android',
        cmd: 'npm install @capacitor/android && npx cap add android',
        desc: 'Membuat proyek Android Studio native lengkap dengan Gradle & AndroidManifest.xml'
      },
      {
        step: 3,
        title: 'Sinkronisasi Aset & Plugin',
        cmd: 'npx cap sync android',
        desc: 'Menyalin bundle dist/ dan plugin ke dalam folder android/'
      },
      {
        step: 4,
        title: 'Buka di Android Studio & Buat APK / AAB',
        cmd: 'npx cap open android',
        desc: 'Buka Android Studio, pilih menu Build > Build Bundle(s) / APK(s) > Build APK(s) atau Generate Signed Bundle/APK'
      },
      {
        step: 5,
        title: 'Khusus Platform iOS (di macOS)',
        cmd: 'npm install @capacitor/ios && npx cap add ios && npx cap open ios',
        desc: 'Membuka Xcode di macOS untuk penandatanganan sertifikat Apple dan pembuatan arsip IPA'
      }
    ];
  }
};
