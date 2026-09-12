import { ParkingSession, GarageDetails } from '../types/parking';
import { VoiceService } from './voice';
import { NotificationService } from './notifications';

export class SimulatorService {
  /**
   * יצירת חניה מדומה (למשל בחניון קניון עזריאלי קומה -3)
   */
  static generateSimulatedSession(): ParkingSession {
    const azrieliLocation = {
      latitude: 32.0740,
      longitude: 34.7915,
      address: 'חניון עזריאלי, מנחם בגין 132, תל אביב',
      timestamp: Date.now() - 45 * 60 * 1000, // חנה לפני 45 דקות
    };

    const garage: GarageDetails = {
      floor: '-3',
      colorZone: 'כחול',
      pillarRow: 'עמוד 42 שורה ב׳',
      notes: 'ליד המעלית הראשית למשרדים',
    };

    return {
      id: 'sim_' + Date.now(),
      startTime: azrieliLocation.timestamp,
      location: azrieliLocation,
      garage,
      meterReminderMinutes: 120, // שעתיים
      alertSent: false,
    };
  }

  /**
   * הדמיית עזיבת חניה ונסיעה ברכב (מהירות 28 קמ"ש, מרחק 230 מטר)
   */
  static async triggerSimulatedDeparture(
    onTrigger: (speedKmH: number, distanceMeters: number) => void
  ): Promise<void> {
    const simulatedSpeed = 28;
    const simulatedDistance = 230;

    // 1. הפעלת רטט חזק והודעה קולית בעברית
    await VoiceService.alertParkingDeparture();

    // 2. שיגור התראת פוש מקומית עם צליל
    await NotificationService.sendDepartureNotification(simulatedSpeed, simulatedDistance);

    // 3. עדכון ה-UI
    onTrigger(simulatedSpeed, simulatedDistance);
  }

  /**
   * הדמיית התחברות לדיבורית בלוטות' ברכב
   */
  static async triggerSimulatedBluetoothConnect(
    onTrigger: (deviceName: string) => void
  ): Promise<void> {
    const deviceName = 'Mazda Connect BT';
    await VoiceService.alertParkingDeparture();
    await NotificationService.sendDepartureNotification(25, 180);
    onTrigger(deviceName);
  }

  /**
   * הדמיית התראת מדחן
   */
  static async triggerSimulatedMeterAlert(): Promise<void> {
    await VoiceService.alertMeterExpiring(15);
    await NotificationService.scheduleMeterReminder(1); // בדיקה מיידית
  }
}
