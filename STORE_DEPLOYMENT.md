# מדריך העלאה והפצה לחנות: ParkGuard ב-Google Play Store

מדריך זה מפרט שלב-אחר-שלב כיצד לבנות את קובץ ה-`AAB` (Android App Bundle) של האפליקציה ולהעלות אותה לחנות של `Google Play`.

---

## 1. בדיקת האפליקציה במכשיר טלפון פיזי

לפני הבנייה לחנות, מומלץ להריץ את האפליקציה במכשירך באמצעות `Expo Go`:

```bash
npx expo start
```
סרוק את ה-`QR Code` שיופיע בטרמינל באמצעות אפליקציית **Expo Go** במכשיר האנדרואיד שלך.

---

## 2. התקנת כלי הבנייה בענן של Expo (`EAS CLI`)

בניית קובץ `AAB` לחנות אינה דורשת התקנת `Android Studio` או `Java` על המחשב, הודות לשרתי הבנייה המאובטחים של `Expo` (`EAS Build`):

1. התקן את כלי ה-`CLI` של `EAS`:
```bash
npm install -g eas-cli
```

2. התחבר לחשבון ה-`Expo` שלך (ניתן לפתוח חשבון חינמי ב-[expo.dev](https://expo.dev)):
```bash
eas login
```

3. קשר את הפרויקט לחשבון:
```bash
eas project:init
```

---

## 3. הפקת קובצי התקנה (APK ו-AAB)

### אפשרות א': הפקת קובץ `APK` לבדיקה ישירה במכשיר
אם תרצה להתקין את קובץ האפליקציה ישירות על מכשיר אנדרואיד (ללא חנות):
```bash
eas build --platform android --profile preview
```
בסיום הבנייה תקבל קישור להורדת קובץ `APK` ישירות למכשיר.

### אפשרות ב': הפקת קובץ `AAB` מוכן להעלאה ל-`Google Play Store`
```bash
eas build --platform android --profile production
```
בסיום התהליך יופק קובץ `bundle.aab` חתום במפתח דיגיטלי, מוכן להעלאה לקונסולת המפתחים.

---

## 4. העלאה לקונסולת המפתחים (`Google Play Console`)

1. היכנס אל [Google Play Console](https://play.google.com/console).
2. לחץ על **Create app**:
   - **App name**: `ParkGuard - תזכורת חניה חכמה`
   - **Default language**: `Hebrew (he-IL)`
   - **App or game**: `App`
   - **Free or paid**: `Free`
3. נווט אל **Production** או **Internal testing** -> **Create new release**.
4. העלה את קובץ ה-`AAB` שהורדת מ-`EAS Build`.

---

## 5. מילוי הצהרת פרטיות ומיקום ברקע (`Location in Background Declaration`)

מכיוון שהאפליקציה משתמשת בהרשאת מיקום רקע (`ACCESS_BACKGROUND_LOCATION`) כדי לזהות עזיבת חניה ברכב, `Google Play` דורשת פירוט ברור בטופס ה-App Content:

### שאלון בטיחות מידע (Data Safety):
- **האם נתוני מיקום נאספים?** לא (כל הנתונים נשארים מקומית על גבי המכשיר ואינם מועברים לשרת מפתחים).
- **האם מידע משותף עם צד שלישי?** לא.

### הצהרת מיקום ברקע (Background Location Prominent Disclosure):
- **Core feature**: יש לציין כי מטרת האפליקציה המרכזית היא מניעת תשלום מיותר של מאות שקלים בדמי חניה באמצעות התראה קולית ברגע שהנהג מתחיל בנסיעה ומתרחק מהחניה.
- **טקסט מוצע ל-Google Reviewers:**
  > "ParkGuard monitors the user's vehicle departure using background speed and distance tracking, alerting the driver immediately to stop their active parking session in Pango or Cellopark and prevent unnecessary overcharging. All location data is processed strictly on-device."

---

## 6. תיאור שיווקי מוצע לחנות (Store Listing)

### כותרת קצרה:
> ParkGuard - תזכורת חניה חכמה לעצירת פנגו וסלופארק

### תיאור מלא:
> כמה פעמים שכחתם לעצור את החניה בפנגו או בסלופארק ושילמתם עשרות שקלים על יום שלם?
> 
> **ParkGuard (תזכורת חניה חכמה)** פותרת את הבעיה הזו לתמיד!
> 
> תכונות מרכזיות:
> 🚗 **זיהוי נסיעה אוטומטי:** האפליקציה מזהה מתי התחלתם לנסוע במהירות רכב והתרחקתם מהחניה, ומזניקה התראה קולית והודעה מיידית.
> 📱 **קיצורי דרך מהירים:** כפתור ישיר לעצירת פנגו או סלופארק בלחיצה אחת.
> 🏢 **חבילת חניונים תת-קרקעיים:** שמירת תמונה של מקום החניה, קומה (למשל מינוס 3), צבע מתחם, ומספר עמוד/שורה.
> 🧭 **מצפן ניווט רגלי חזרה לרכב:** חיצי כיוון ומטרים מדויקים שיעזרו לכם למצוא את הרכב בקלות.
> ⏳ **תזכורת מדחן / כחול-לבן:** טיימר חכם המתריע 15 דקות לפני תום זמן החניה המותר.
> 🔒 **100% פרטיות:** כל הנתונים נשמרים על המכשיר שלכם בלבד.
