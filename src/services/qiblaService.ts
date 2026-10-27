/**
 * Qibla Calculation Service
 * Computes exact Great Circle Forward Azimuth (initial bearing) to Ka'bah:
 * Latitude: 21.422487, Longitude: 39.826206
 */

import { KAABA_COORDINATES } from './locationService';
import { QiblaCalculationResult } from '../types/worship';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export const qiblaService = {
  /**
   * Calculates geodesic initial bearing to Ka'bah from user coordinates.
   * Result is 0° - 360° clockwise from True North.
   */
  calculateQibla(latitude: number, longitude: number): QiblaCalculationResult {
    const phi1 = toRadians(latitude);
    const phi2 = toRadians(KAABA_COORDINATES.latitude);
    const deltaLambda = toRadians(KAABA_COORDINATES.longitude - longitude);

    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x =
      Math.cos(phi1) * Math.sin(phi2) -
      Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

    let bearing = toDegrees(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    // Haversine distance
    const R = 6371; // Earth radius in km
    const dPhi = phi2 - phi1;
    const a =
      Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);

    return {
      latitude,
      longitude,
      qiblaBearing: Math.round(bearing * 10) / 10,
      distanceKm
    };
  },

  /**
   * Request device orientation permission for iOS 13+ devices
   */
  async requestOrientationPermission(): Promise<boolean> {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === 'function'
    ) {
      try {
        const response = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        return response === 'granted';
      } catch (err) {
        console.warn('Orientation permission error:', err);
        return false;
      }
    }
    return true; // Already allowed or standard Android / desktop
  },

  /**
   * Computes device compass heading in degrees from North
   * Handles webkitCompassHeading (iOS true/magnetic heading) and alpha (standard)
   */
  extractCompassHeading(event: DeviceOrientationEvent): number | null {
    // iOS Safari provides webkitCompassHeading (0 to 360, clockwise from true or magnetic north)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyEvent = event as any;
    if (typeof anyEvent.webkitCompassHeading === 'number') {
      return anyEvent.webkitCompassHeading;
    }

    // Android standard: alpha is rotation around z-axis
    if (typeof event.alpha === 'number') {
      // On Android absolute orientation:
      // compass heading = (360 - alpha) % 360
      return (360 - event.alpha + 360) % 360;
    }

    return null;
  }
};
