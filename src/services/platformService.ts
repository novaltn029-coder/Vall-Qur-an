/**
 * Platform Detection & Mobile Abstraction Service for val-qur'an
 * Detects runtime environment: PWA standalone, iOS Safari, Android, Capacitor Native, or Desktop.
 */

import { Capacitor } from '@capacitor/core';

export type PlatformType = 'capacitor-android' | 'capacitor-ios' | 'pwa-android' | 'pwa-ios' | 'browser-android' | 'browser-ios' | 'desktop-pwa' | 'desktop-browser';

export const platformService = {
  isCapacitor(): boolean {
    return Capacitor.isNativePlatform();
  },

  getCapacitorPlatform(): string {
    return Capacitor.getPlatform(); // 'android' | 'ios' | 'web'
  },

  isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  },

  isAndroid(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /android/.test(ua);
  },

  isStandalonePWA(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  },

  isDesktop(): boolean {
    return !this.isIOS() && !this.isAndroid();
  },

  getPlatformType(): PlatformType {
    if (this.isCapacitor()) {
      return this.getCapacitorPlatform() === 'ios' ? 'capacitor-ios' : 'capacitor-android';
    }

    if (this.isStandalonePWA()) {
      if (this.isIOS()) return 'pwa-ios';
      if (this.isAndroid()) return 'pwa-android';
      return 'desktop-pwa';
    }

    if (this.isIOS()) return 'browser-ios';
    if (this.isAndroid()) return 'browser-android';
    return 'desktop-browser';
  },

  getPlatformLabel(): string {
    const type = this.getPlatformType();
    switch (type) {
      case 'capacitor-android':
        return 'Android Native App (Capacitor)';
      case 'capacitor-ios':
        return 'iOS Native App (Capacitor)';
      case 'pwa-android':
        return 'Android PWA (Terpasang Standalone)';
      case 'pwa-ios':
        return 'iOS PWA (Home Screen Standalone)';
      case 'desktop-pwa':
        return 'Desktop PWA (Aplikasi Terpasang)';
      case 'browser-android':
        return 'Android Mobile Browser';
      case 'browser-ios':
        return 'iOS Safari Mobile Browser';
      default:
        return 'Desktop Web Browser';
    }
  }
};
