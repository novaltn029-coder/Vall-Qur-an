/**
 * Notification and Adhan Sound Service for val-qur'an
 * Integrates Web Notifications API and Web Audio API synthesized harmonic chimes.
 */

export const notificationService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      return await Notification.requestPermission();
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return 'denied';
    }
  },

  sendNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        silent: false,
        ...options
      });
      return true;
    } catch (e) {
      console.warn('Notification trigger error:', e);
      return false;
    }
  },

  /**
   * Synthesize harmonic Adhan chime tone via Web Audio API
   * Guaranteed to work offline and across all modern browsers without missing external mp3 assets.
   */
  playAdhanChime(volume = 0.8, type: 'adhan_makkah' | 'chime_peaceful' | 'beep_soft' = 'adhan_makkah'): void {
    if (typeof window === 'undefined') return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gainNode.connect(ctx.destination);

      if (type === 'beep_soft') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.connect(gainNode);
        osc.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.stop(ctx.currentTime + 1.2);
        return;
      }

      // Harmonic Islamic Adhan sequence (Maqam Bayati melody notes: D4, F4, G4, A4, Bb4, A4, G4, F4, E4, D4)
      const notes =
        type === 'adhan_makkah'
          ? [
              { f: 293.66, dur: 0.6, delay: 0 },    // D4
              { f: 349.23, dur: 0.7, delay: 0.6 },  // F4
              { f: 392.00, dur: 0.9, delay: 1.3 },  // G4
              { f: 440.00, dur: 1.2, delay: 2.2 },  // A4
              { f: 392.00, dur: 0.8, delay: 3.4 },  // G4
              { f: 349.23, dur: 1.2, delay: 4.2 },  // F4
              { f: 293.66, dur: 1.8, delay: 5.4 }   // D4 (Resolving)
            ]
          : [
              { f: 523.25, dur: 0.8, delay: 0 },    // C5 Peaceful Bell
              { f: 659.25, dur: 0.8, delay: 0.6 },  // E5
              { f: 783.99, dur: 1.2, delay: 1.2 }   // G5
            ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = type === 'adhan_makkah' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.delay);

        noteGain.gain.setValueAtTime(0.01, ctx.currentTime + n.delay);
        noteGain.gain.exponentialRampToValueAtTime(volume * 0.35, ctx.currentTime + n.delay + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.delay + n.dur);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        osc.start(ctx.currentTime + n.delay);
        osc.stop(ctx.currentTime + n.delay + n.dur);
      });
    } catch (e) {
      console.warn('Web Audio adhan chime failed to initialize:', e);
    }
  }
};
