import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class VoiceService {
  /**
   * השמעת הודעה קולית בעברית
   */
  static async speak(text: string): Promise<void> {
    try {
      // בדיקה אם המנוע כבר מדבר ועצירתו
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      await Speech.speak(text, {
        language: 'he-IL',
        pitch: 1.0,
        rate: 0.95, // קצב דיבור ברור ונוח לנהגים
      });
    } catch (error) {
      console.warn('VoiceService speech error:', error);
    }
  }

  /**
   * השמעת התראת עזיבת חניה ונסיעה ברכב
   */
  static async alertParkingDeparture(): Promise<void> {
    await this.triggerUrgentHaptic();
    await this.speak('שים לב: זוהתה נסיעה! אל תשכח לעצור את החניה בפנגו או בסלופארק.');
  }

  /**
   * השמעת אישור תחילת חניה
   */
  static async announceParkingStarted(): Promise<void> {
    await this.triggerSuccessHaptic();
    await this.speak('מיקום הרכב נשמר בהצלחה. מעקב עזיבה הופעל.');
  }

  /**
   * השמעת התראת תום זמן מדחן (כחול-לבן)
   */
  static async alertMeterExpiring(minutesLeft: number): Promise<void> {
    await this.triggerWarningHaptic();
    await this.speak(`תשומת לבך: נותרו ${minutesLeft} דקות לסיום זמן החניה במדחן.`);
  }

  /**
   * רטט התראה חזק ודחוף
   */
  static async triggerUrgentHaptic(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        // רטט נוסף להדגשה
        setTimeout(async () => {
          try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          } catch {}
        }, 300);
      }
    } catch (error) {
      console.warn('Haptics error:', error);
    }
  }

  /**
   * רטט הצלחה
   */
  static async triggerSuccessHaptic(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {}
  }

  /**
   * רטט אזהרה
   */
  static async triggerWarningHaptic(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {}
  }
}
