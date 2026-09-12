import * as Location from 'expo-location';
import { ParkingLocation } from '../types/parking';

export class LocationService {
  private static watcher: Location.LocationSubscription | null = null;

  /**
   * בקשת הרשאות מיקום (חזית ורקע)
   */
  static async requestPermissions(): Promise<{ foreground: boolean; background: boolean }> {
    try {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      const fgGranted = fgStatus === 'granted';

      let bgGranted = false;
      if (fgGranted) {
        try {
          const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
          bgGranted = bgStatus === 'granted';
        } catch (e) {
          console.warn('Background permission request warning:', e);
        }
      }

      return { foreground: fgGranted, background: bgGranted };
    } catch (error) {
      console.warn('Location permission error:', error);
      return { foreground: false, background: false };
    }
  }

  /**
   * קבלת מיקום נוכחי מדויק עבור שמירת חניה
   */
  static async getCurrentLocation(): Promise<ParkingLocation | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      let address: string | undefined;
      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (reverse && reverse.length > 0) {
          const item = reverse[0];
          const parts = [item.street, item.streetNumber, item.city].filter(Boolean);
          if (parts.length > 0) {
            address = parts.join(' ');
          }
        }
      } catch (err) {
        console.warn('Reverse geocode error:', err);
      }

      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy ?? undefined,
        altitude: loc.coords.altitude ?? null,
        address: address || 'מיקום נוכחי',
        timestamp: loc.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * חישוב מרחק במטרים בין שתי נקודות (נוסחת Haversine)
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // רדיוס כדור הארץ במטרים
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // תוצאה במטרים
  }

  /**
   * חישוב כיוון אזימוט (Bearing במעלות 0-360) ממיקום נוכחי אל הרכב החונה
   * עבור מחט המצפן / רדאר הניווט הרגלי
   */
  static calculateBearing(currentLat: number, currentLon: number, targetLat: number, targetLon: number): number {
    const φ1 = (currentLat * Math.PI) / 180;
    const φ2 = (targetLat * Math.PI) / 180;
    const Δλ = ((targetLon - currentLon) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    const bearing = ((θ * 180) / Math.PI + 360) % 360;
    return Math.round(bearing);
  }

  /**
   * המרת מהירות מ-m/s לקמ"ש
   */
  static speedToKmH(speedMps: number | null | undefined): number {
    if (!speedMps || speedMps < 0) return 0;
    return speedMps * 3.6;
  }

  /**
   * התחלת מעקב אחרי תנועה לצורך זיהוי עזיבת חניה
   */
  static async startTracking(
    parkingLocation: ParkingLocation,
    speedThresholdKmH: number,
    distanceThresholdMeters: number,
    onDepartureDetected: (speedKmH: number, distanceMeters: number) => void,
    onPositionUpdate?: (distanceMeters: number, currentSpeedKmH: number, currentCoords: { latitude: number; longitude: number }) => void
  ): Promise<void> {
    await this.stopTracking();

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    this.watcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,     // בדיקה כל 3 שניות
        distanceInterval: 10,   // בדיקה כל 10 מטרים
      },
      (location) => {
        const currentSpeedKmH = this.speedToKmH(location.coords.speed);
        const distance = this.calculateDistance(
          parkingLocation.latitude,
          parkingLocation.longitude,
          location.coords.latitude,
          location.coords.longitude
        );

        if (onPositionUpdate) {
          onPositionUpdate(distance, currentSpeedKmH, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }

        // תנאי זיהוי עזיבת חניה: התרחקות מעל הסף וגם מהירות נסיעה מעל הסף
        if (distance >= distanceThresholdMeters && currentSpeedKmH >= speedThresholdKmH) {
          onDepartureDetected(currentSpeedKmH, distance);
        }
      }
    );
  }

  /**
   * עצירת מעקב המיקום
   */
  static async stopTracking(): Promise<void> {
    if (this.watcher) {
      this.watcher.remove();
      this.watcher = null;
    }
  }
}
