import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// הגדרת טיפול בהתראות כשהאפליקציה פתוחה
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static isInitialized = false;

  /**
   * אתחול הגדרות התראות ויצירת ערוץ Android ייעודי
   */
  static async init(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('parkguard_alerts', {
          name: 'התראות עצירת חניה דחופות',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 200, 500],
          lightColor: '#EF4444',
          sound: 'default',
          enableLights: true,
          enableVibrate: true,
        });

        await Notifications.setNotificationChannelAsync('parkguard_reminders', {
          name: 'תזכורות מדחן וכחול-לבן',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
        });
      }

      this.isInitialized = finalStatus === 'granted';
      return this.isInitialized;
    } catch (error) {
      console.warn('Notifications init warning:', error);
      return false;
    }
  }

  /**
   * שיגור התראה מיידית על עזיבת חניה
   */
  static async sendDepartureNotification(speedKmH: number, distanceMeters: number): Promise<string> {
    await this.init();

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚗 שים לב: זוהתה נסיעה ברכב!',
        body: `התרחקת ${Math.round(distanceMeters)} מ' במהירות ${Math.round(speedKmH)} קמ"ש. אל תשכח לעצור את החניה בפנגו או סלופארק!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { type: 'departure_alert' },
      },
      trigger: null, // שיגור מיידי
    });
  }

  /**
   * תזמון התראת מדחן (למשל 15 דקות לפני תום הזמן)
   */
  static async scheduleMeterReminder(minutesFromNow: number): Promise<string> {
    await this.init();

    const triggerSeconds = Math.max(1, minutesFromNow * 60);

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏳ תזכורת מדחן / כחול-לבן',
        body: `זמן החניה שלך עומד להסתיים בקרוב (בעוד ${minutesFromNow} דקות)!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'meter_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: triggerSeconds,
      },
    });
  }

  /**
   * ביטול כל ההתראות המתוזמנות
   */
  static async cancelAllScheduledNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn('Error cancelling notifications:', error);
    }
  }
}
