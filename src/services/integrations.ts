import { Linking, Platform, Alert } from 'react-native';

export class IntegrationsService {
  /**
   * ניסיון פתיחת סדרת כתובות URL עד שאחת מהן מצליחה
   */
  private static async tryOpenUrls(urls: string[]): Promise<boolean> {
    for (const url of urls) {
      try {
        await Linking.openURL(url);
        return true;
      } catch (err) {
        // המשך לכתובת הבאה
      }
    }
    return false;
  }

  /**
   * פתיחת פנגו (Pango) - מנסה לפתוח את האפליקציה המותקנת, ואם אינה מותקנת פותח בחנות
   */
  static async openPango(): Promise<void> {
    const urls = [
      'pango://',
      'android-app://com.pango.il',
      'market://details?id=com.pango.il',
      'https://play.google.com/store/apps/details?id=com.pango.il',
    ];

    const success = await this.tryOpenUrls(urls);
    if (!success) {
      Alert.alert('פנגו', 'לא ניתן לפתוח את פנגו. אנא ודא שהאפליקציה מותקנת במכשיר.');
    }
  }

  /**
   * פתיחת סלופארק (Cellopark)
   */
  static async openCellopark(): Promise<void> {
    const urls = [
      'cellopark://',
      'android-app://com.cellopark.android',
      'market://details?id=com.cellopark.android',
      'https://play.google.com/store/apps/details?id=com.cellopark.android',
    ];

    const success = await this.tryOpenUrls(urls);
    if (!success) {
      Alert.alert('סלופארק', 'לא ניתן לפתוח את סלופארק. אנא ודא שהאפליקציה מותקנת במכשיר.');
    }
  }

  /**
   * פתיחה או ניווט ישיר לרכב באמצעות Waze
   */
  static async navigateWithWaze(latitude?: number, longitude?: number): Promise<void> {
    let urls: string[] = [];

    if (latitude !== undefined && longitude !== undefined) {
      urls = [
        `waze://?ll=${latitude},${longitude}&navigate=yes`,
        `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
        'waze://',
        'market://details?id=com.waze',
      ];
    } else {
      urls = [
        'waze://',
        'android-app://com.waze',
        'https://waze.com',
        'market://details?id=com.waze',
      ];
    }

    const success = await this.tryOpenUrls(urls);
    if (!success) {
      Alert.alert('Waze', 'לא ניתן לפתוח את Waze. אנא ודא שהאפליקציה מותקנת.');
    }
  }

  /**
   * פתיחה או ניווט ישיר לרכב באמצעות Google Maps
   */
  static async navigateWithGoogleMaps(
    latitude?: number,
    longitude?: number,
    mode: 'walking' | 'driving' = 'walking'
  ): Promise<void> {
    let urls: string[] = [];

    if (latitude !== undefined && longitude !== undefined) {
      urls = [
        Platform.OS === 'android'
          ? `google.navigation:q=${latitude},${longitude}&mode=${mode === 'walking' ? 'w' : 'd'}`
          : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${mode}`,
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${mode}`,
        `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
      ];
    } else {
      urls = [
        'geo:0,0',
        'https://maps.google.com',
        'android-app://com.google.android.apps.maps',
      ];
    }

    const success = await this.tryOpenUrls(urls);
    if (!success) {
      Alert.alert('מפות Google', 'לא ניתן לפתוח את אפליקציית המפות.');
    }
  }

  /**
   * שיתוף מיקום הרכב החונה בוואטסאפ או באפליקציות שיתוף
   */
  static async shareParkingLocation(latitude: number, longitude: number, notes?: string): Promise<void> {
    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    let text = `הרכב שלי חונה כאן:\n${mapsLink}`;
    if (notes) {
      text += `\nפרטי חניה: ${notes}`;
    }

    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const success = await this.tryOpenUrls([whatsappUrl, `https://wa.me/?text=${encodeURIComponent(text)}`]);
    if (!success) {
      Alert.alert('שיתוף מיקום', text);
    }
  }
}
