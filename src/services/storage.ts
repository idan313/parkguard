import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParkingSession, AppSettings } from '../types/parking';

const STORAGE_KEYS = {
  ACTIVE_SESSION: '@parkguard_active_session',
  HISTORY: '@parkguard_history',
  SETTINGS: '@parkguard_settings',
};

export const DEFAULT_SETTINGS: AppSettings = {
  speedThresholdKmH: 20,
  distanceThresholdMeters: 150,
  voiceAlertsEnabled: true,
  vibrationAlertsEnabled: true,
  bluetoothAutoDetect: true,
  selectedBluetoothDevice: 'כל דיבורית רכב מזוהה',
  meterReminderEnabled: true,
  meterReminderNoticeMinutes: 15,
  preferredParkingApp: 'both',
};

export class StorageService {
  /**
   * שמירת חניה פעילה נוכחית
   */
  static async saveActiveSession(session: ParkingSession): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving active session:', error);
    }
  }

  /**
   * שליפת החניה הפעילה הנוכחית (אם ישנה)
   */
  static async getActiveSession(): Promise<ParkingSession | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return data ? (JSON.parse(data) as ParkingSession) : null;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  /**
   * סיום ומחיקת החניה הפעילה + הוספה ליומן היסטוריית החניות
   */
  static async clearActiveSession(addToHistory = true): Promise<void> {
    try {
      if (addToHistory) {
        const current = await this.getActiveSession();
        if (current) {
          const completedSession: ParkingSession = {
            ...current,
            endTime: Date.now(),
          };
          await this.addSessionToHistory(completedSession);
        }
      }
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (error) {
      console.error('Error clearing active session:', error);
    }
  }

  /**
   * הוספת חניה ליומן ההיסטוריה
   */
  static async addSessionToHistory(session: ParkingSession): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = [session, ...history].slice(0, 100); // שמירת 100 חניות אחרונות
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error adding session to history:', error);
    }
  }

  /**
   * שליפת כל יומן היסטוריית החניות
   */
  static async getHistory(): Promise<ParkingSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? (JSON.parse(data) as ParkingSession[]) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  /**
   * ניקוי יומן היסטוריית החניות
   */
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  /**
   * שמירת הגדרות אפליקציה
   */
  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * שליפת הגדרות אפליקציה
   */
  static async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  }
}
