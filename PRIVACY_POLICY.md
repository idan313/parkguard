# Privacy Policy for ParkGuard (מדיניות פרטיות)

**Last Updated / תאריך עדכון אחרון:** September 12, 2026

Welcome to **ParkGuard - תזכורת חניה חכמה** ("we", "our", or "the App"). We are committed to protecting your privacy and ensuring you have a transparent, secure experience while using our application.

This Privacy Policy explains how our App handles location data, device permissions, and user privacy in compliance with Google Play Developer policies.

---

## 1. Summary of Key Principles (תקציר עקרונות המפתח)

- **100% On-Device Processing:** All your data (including GPS locations, parking history, garage photos, and notes) is stored and processed **exclusively on your personal device**.
- **No External Servers:** We do **NOT** operate remote tracking servers and do **NOT** transmit your personal data or location coordinates to any cloud database or third party.
- **No Tracking for Advertising:** We do not track you for marketing or advertising purposes.

---

## 2. Information and Permissions We Use

### A. Location Data (Foreground and Background)
- **Permissions Used:** `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`, and `FOREGROUND_SERVICE_LOCATION`.
- **Purpose:** 
  1. When you park your car or tap "חניתי כאן", the App saves your current coordinates on your device so you can easily navigate back.
  2. When you start driving away from your parking spot, the App monitors speed and distance in the background to send you an immediate voice and vibration alert reminding you to stop your parking session (in Pango or Cellopark), saving you money on unnecessary parking charges.
  3. Real-time directional guidance (Walking Radar) back to your parked vehicle.
- **Data Retention:** Location coordinates remain on your device's local encrypted storage (`AsyncStorage`). You can delete your location and parking history at any time through the in-app Settings.

### B. Bluetooth Permissions
- **Permissions Used:** `BLUETOOTH`, `BLUETOOTH_CONNECT`.
- **Purpose:** Detects automatic disconnect from your car's hands-free Bluetooth unit when parking, and reconnect when returning, to automate parking alerts without manual button presses. No Bluetooth audio or communications are recorded or transmitted.

### C. Camera and Media Storage
- **Permissions Used:** `CAMERA`, `READ_EXTERNAL_STORAGE`.
- **Purpose:** Allows you to take a photo of your parking spot (e.g., parking pillar, floor sign, or garage row) to help you locate your car in multi-level parking structures. Photos are saved solely on your local device.

### D. Audio & Speech
- **Permissions Used:** `RECORD_AUDIO` (if voice commands enabled), text-to-speech engine (`expo-speech`).
- **Purpose:** Delivers spoken Hebrew voice alerts when a vehicle departure is detected while driving, allowing hands-free safety.

---

## 3. Data Sharing and Third-Party Services

We do **NOT** sell, rent, trade, or transfer your personal or location data to any third party. 

When you tap external shortcut buttons (such as Pango, Cellopark, Waze, or Google Maps), you are redirected directly to those respective applications installed on your device or their official websites, subject to their own separate privacy policies.

---

## 4. User Control and Data Deletion

You retain full control over your data:
- You can end any parking session at any time with the "סיום חניה ואיפוס מעקב" button.
- You can delete your entire parking history from the Settings screen.
- Uninstalling the App immediately removes all stored data from your device.

---

## 5. Security

Because all data remains strictly on your local device storage, your data is protected by your device's operating system security controls, encryption, and biometric protections.

---

## 6. Contact Us

If you have any questions, suggestions, or concerns regarding this Privacy Policy or the App, please contact us at:

- **Developer:** Idan
- **GitHub Repository:** [https://github.com/idan313/parkguard](https://github.com/idan313/parkguard)
- **Support Email:** `parkguard.app@gmail.com`

---

*This privacy policy is publicly accessible at: `https://raw.githubusercontent.com/idan313/parkguard/main/PRIVACY_POLICY.md`*
