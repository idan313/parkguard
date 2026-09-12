<div dir="rtl" style="direction: rtl; text-align: right;">

# ערכת הגשת האפליקציה ל-Google Play Store (Store Listing Kit)

קובץ זה מכיל את כל הטקסטים המדויקים, התשובות לשאלוני ה-`Play Console`, וההצהרות הנדרשות על ידי `Google Play` להעתקה והדבקה (Copy-Paste) מהירות.

---

## 1. פרטי האפליקציה בחנות (Main Store Listing)

### כותרת האפליקציה (App Name)
> **ParkGuard - תזכורת חניה חכמה**  
*(28 תווים מתוך 30 מקסימום)*

### תיאור קצר (Short Description)
> **תזכורת חניה חכמה: התראה קולית בעת עזיבת הרכב לעצירת פנגו וסלופארק בזמן**  
*(70 תווים מתוך 80 מקסימום)*

### תיאור מלא (Full Description)
<div dir="rtl" style="direction: rtl; text-align: right;">

כמה פעמים קרה לכם שחניתם בכחול-לבן או בחניון, הפעלתם פנגו או סלופארק, ואז חזרתם לרכב, נסעתם הביתה וגיליתם בערב ששילמתם עשרות או מאות שקלים סתם כי שכחתם לעצור את החניה?

**ParkGuard (תזכורת חניה חכמה)** נבנתה במיוחד כדי לפתור את הבעיה הזו ולחסוך לכם כסף ועוגמת נפש!

🚗 **זיהוי נסיעה ועזיבה אוטומטי (Hybrid Detection):**
האפליקציה מנטרת ברקע מהירות נסיעה והתרחקות ממקום החניה. ברגע שהתחלתם לנסוע ברכב, תקבלו מיד התראה קולית ברורה בעברית ורטט חזק: "שים לב: זוהתה נסיעה, אל תשכח לעצור את החניה בפנגו או בסלופארק!"

⚡ **קיצורי דרך ישירים בלחיצה אחת:**
אין צורך לחפש את האפליקציה במסך הבית - ישירות מתוך ההתראה ומסך הבית של ParkGuard תוכלו לפתוח בלחיצה אחת את Pango, Cellopark, Waze או Google Maps.

🏢 **מעקב חניונים תת-קרקעיים וקניונים:**
החניתם בקניון עזריאלי או בחניון ענק ללא קליטת GPS?
- בחירת קומה מהירה (מינוס 5 עד פלוס 5).
- סימון צבע מתחם ואזור (צהוב, כחול, אדום, ירוק ועוד).
- תיעוד מספר עמוד ושורה.
- צילום תמונה של מקום החניה ישירות לתוך האפליקציה.

🧭 **מצפן ניווט רגלי חזרה לרכב (Walking Radar):**
מחט מצפן גרפית ומד מרחק בזמן אמת שמכוונים אתכם בקו אווירי ובמפות ישירות אל הרכב שלכם.

⏱️ **תזכורת מדחן וכחול-לבן:**
החניתם באזור עם הגבלת זמן של שעתיים? הגדירו טיימר וקבלו התראה 15 דקות לפני שהזמן מסתיים.

🔒 **100% פרטיות ובטיחות מידע:**
כל המיקומים, התמונות וההיסטוריה נשמרים על המכשיר שלכם בלבד. שום מידע אינו מועבר לשרתים חיצוניים.

הורידו עכשיו את ParkGuard וחסכו מאות שקלים בדמי חניה מיותרים!

</div>

---

## 2. שאלון בטיחות מידע (Data Safety Questionnaire)

במסך ה-**Data safety** ב-`Google Play Console`:
- **Does your app collect or share any of the required user data types?** -> סמן **No** (האפליקציה מעבדת הכל מקומית ב-`device storage` ולא שולחת שום מידע לשרת חיצוני).
- **Location:** Is location collected? -> **No** (Processed ephemerally on-device only).

---

## 3. הצהרת מיקום ברקע (Background Location Declaration)

מכיוון שהאפליקציה משתמשת ב-`ACCESS_BACKGROUND_LOCATION` כדי להתריע בעת עזיבת הרכב:
- **Core feature purpose:**
  > "ParkGuard is a smart parking reminder application. The core feature is alerting the driver when their vehicle starts moving away from their parking spot (speed > 20 km/h and distance > 150m), prompting them to immediately stop active parking billing sessions in local apps (Pango / Cellopark) to prevent costly overcharges. Background location is essential because the driver's phone is usually in their pocket or pocket mount while driving, with the screen turned off."
- **Does the app meet the Prominent Disclosure requirements?** -> **Yes**.

---

## 4. קישור למדיניות פרטיות (Privacy Policy URL)

במסך **App content -> Privacy policy**:
> `https://raw.githubusercontent.com/idan313/parkguard/main/PRIVACY_POLICY.md`

---

## 5. נכסים גרפיים בחנות (Assets)

הקבצים הוכנו ונשמרו בתיקיית `store_assets`:
1. `store_assets/icon_512.png` - אייקון חנות רשמי במידות 512x512 פיקסלים.
2. `store_assets/feature_graphic_1024x500.png` - באנר חנות רשמי 1024x500 פיקסלים.
3. `store_assets/screenshot_1.jpg` - צילום מסך חי מתוך המכשיר.

</div>
