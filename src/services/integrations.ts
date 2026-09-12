import { Linking, Platform, Alert } from 'react-native';

export class IntegrationsService {
  /**
   * פתיחת פנגו (Pango)
   */
  static async openPango(): Promise<void> {
    const schemeUrl = 'pango://';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.pango.il';

    try {
      const supported = await Linking.canOpenURL(schemeUrl);
      if (supported) {
        await Linking.openURL(schemeUrl);
      } else {
        await Linking.openURL(playStoreUrl);
      }
    } catch {
      await Linking.openURL(playStoreUrl);
    }
  }

  /**
   * פתיחת סלופארק (Cellopark)
   */
  static async openCellopark(): Promise<void> {
    const schemeUrl = 'cellopark://';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.cellopark.android';

    try {
      const supported = await Linking.canOpenURL(schemeUrl);
      if (supported) {
        await Linking.openURL(schemeUrl);
      } else {
        await Linking.openURL(playStoreUrl);
      }
    } catch {
      await Linking.openURL(playStoreUrl);
    }
  }

  /**
   * ניווט ישיר לרכב באמצעות Waze
   */
  static async navigateWithWaze(latitude: number, longitude: number): Promise<void> {
    const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
    const fallbackWeb = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

    try {
      const supported = await Linking.canOpenURL(wazeUrl);
      if (supported) {
        await Linking.openURL(wazeUrl);
      } else {
        await Linking.openURL(fallbackWeb);
      }
    } catch {
      await Linking.openURL(fallbackWeb);
    }
  }

  /**
   * ניווט ישיר לרכב באמצעות Google Maps (כולל אפשרות ניווט רגלי חזרה לרכב)
   */
  static async navigateWithGoogleMaps(latitude: number, longitude: number, mode: 'walking' | 'driving' = 'walking'): Promise<void> {
    const url = Platform.select({
      android: `google.navigation:q=${latitude},${longitude}&mode=${mode === 'walking' ? 'w' : 'd'}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${mode}`,
    });

    try {
      await Linking.openURL(url);
    } catch {
      await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${mode}`);
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
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
      }
    } catch {
      Alert.alert('שיתוף מיקום', text);
    }
  }
}
