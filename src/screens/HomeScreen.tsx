import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ParkingSession, ParkingLocation, GarageDetails, DepartureAlertState, AppSettings } from '../types/parking';
import { StorageService } from '../services/storage';
import { LocationService } from '../services/location';
import { VoiceService } from '../services/voice';
import { NotificationService } from '../services/notifications';
import { ActiveParkingCard } from '../components/ActiveParkingCard';
import { CompassRadar } from '../components/CompassRadar';
import { QuickActionsBar } from '../components/QuickActionsBar';
import { GarageDetailsModal } from '../components/GarageDetailsModal';
import { MeterReminderModal } from '../components/MeterReminderModal';
import { DepartureAlertModal } from '../components/DepartureAlertModal';
import { SimulatorModal } from '../components/SimulatorModal';

interface Props {
  onNavigateToSettings: () => void;
}

export const HomeScreen: React.FC<Props> = ({ onNavigateToSettings }) => {
  const [session, setSession] = useState<ParkingSession | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // מרחק ומהירות חיים עבור הרדאר וזיהוי העזיבה
  const [liveDistance, setLiveDistance] = useState<number | null>(null);
  const [liveSpeed, setLiveSpeed] = useState<number>(0);
  const [bearingDegrees, setBearingDegrees] = useState<number>(0);

  // מודלים
  const [showGarageModal, setShowGarageModal] = useState(false);
  const [showMeterModal, setShowMeterModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [alertState, setAlertState] = useState<DepartureAlertState | null>(null);

  const sessionRef = useRef(session);
  sessionRef.current = session;

  // טעינה ראשונית
  useEffect(() => {
    loadData();
    NotificationService.init();

    return () => {
      LocationService.stopTracking();
    };
  }, []);

  // ניהול מעקב מיקום כשיש חניה פעילה
  useEffect(() => {
    if (session) {
      startLocationMonitoring(session);
    } else {
      LocationService.stopTracking();
      setLiveDistance(null);
      setLiveSpeed(0);
    }
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    const [savedSession, savedSettings] = await Promise.all([
      StorageService.getActiveSession(),
      StorageService.getSettings(),
    ]);
    setSession(savedSession);
    setSettings(savedSettings);
    setLoading(false);
  };

  const startLocationMonitoring = async (currentSession: ParkingSession) => {
    const currentSettings = settings || (await StorageService.getSettings());

    await LocationService.startTracking(
      currentSession.location,
      currentSettings.speedThresholdKmH,
      currentSettings.distanceThresholdMeters,
      // Callback בעת זיהוי עזיבת חניה
      (speedKmH, distanceMeters) => {
        handleDepartureTrigger(speedKmH, distanceMeters);
      },
      // Callback לעדכון מרחק, מהירות ואזימוט למצפן הרגלי
      (distanceMeters, speedKmH, currentCoords) => {
        setLiveDistance(distanceMeters);
        setLiveSpeed(speedKmH);

        const bearing = LocationService.calculateBearing(
          currentCoords.latitude,
          currentCoords.longitude,
          currentSession.location.latitude,
          currentSession.location.longitude
        );
        setBearingDegrees(bearing);
      }
    );
  };

  const handleDepartureTrigger = async (speedKmH: number, distanceMeters: number) => {
    if (alertState?.isTriggered) return; // כבר הופעל

    setAlertState({
      isTriggered: true,
      currentSpeedKmH: speedKmH,
      distanceMeters,
      timestamp: Date.now(),
      reason: 'speed_and_distance',
    });

    if (settings?.voiceAlertsEnabled) {
      await VoiceService.alertParkingDeparture();
    }
    await NotificationService.sendDepartureNotification(speedKmH, distanceMeters);
  };

  const handleParkNow = async () => {
    setIsLocating(true);
    const permissions = await LocationService.requestPermissions();
    if (!permissions.foreground) {
      setIsLocating(false);
      Alert.alert(
        'דרושה הרשאת מיקום',
        'אנא אשר הרשאת מיקום כדי שהאפליקציה תוכל לשמור את מיקום הרכב ולהזכיר לך לעצור את פנגו בעת עזיבה.'
      );
      return;
    }

    const loc = await LocationService.getCurrentLocation();
    setIsLocating(false);

    if (!loc) {
      Alert.alert('שגיאת GPS', 'לא הצלחנו לקבל את המיקום הנוכחי. אנא ודא שה-GPS פועל במכשיר.');
      return;
    }

    const newSession: ParkingSession = {
      id: 'session_' + Date.now(),
      startTime: Date.now(),
      location: loc,
      alertSent: false,
    };

    setSession(newSession);
    await StorageService.saveActiveSession(newSession);

    if (settings?.voiceAlertsEnabled) {
      await VoiceService.announceParkingStarted();
    }
  };

  const handleEndParking = async () => {
    await StorageService.clearActiveSession(true);
    await NotificationService.cancelAllScheduledNotifications();
    setSession(null);
    setAlertState(null);
    setLiveDistance(null);
  };

  const handleSaveGarageDetails = async (details: GarageDetails) => {
    if (!session) return;
    const updated = { ...session, garage: details };
    setSession(updated);
    await StorageService.saveActiveSession(updated);
  };

  const handleSaveMeterReminder = async (minutes: number | undefined) => {
    if (!session) return;
    const updated = { ...session, meterReminderMinutes: minutes };
    setSession(updated);
    await StorageService.saveActiveSession(updated);

    if (minutes) {
      const noticeMinutes = Math.max(1, minutes - (settings?.meterReminderNoticeMinutes || 15));
      await NotificationService.scheduleMeterReminder(noticeMinutes);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>טוען את ParkGuard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* כותרת אפליקציה עליונה */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => setShowSimulatorModal(true)}
        >
          <Ionicons name="flask-outline" size={22} color="#A855F7" />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <Text style={styles.appName}>ParkGuard</Text>
          <Text style={styles.appSub}>תזכורת חניה חכמה</Text>
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={onNavigateToSettings}>
          <Ionicons name="settings-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {session ? (
          /* מצב: יש חניה פעילה */
          <View>
            <ActiveParkingCard
              session={session}
              onEditGarage={() => setShowGarageModal(true)}
              onEndParking={handleEndParking}
              onSetMeterReminder={() => setShowMeterModal(true)}
            />

            {/* סרגל קיצורי דרך מהירים (פנגו, סלופארק, Waze, מפות) */}
            <QuickActionsBar
              location={session.location}
              notes={session.garage?.notes}
            />

            {/* מצפן ניווט רגלי לרכב */}
            <CompassRadar
              parkingLocation={session.location}
              currentDistanceMeters={liveDistance}
              bearingDegrees={bearingDegrees}
            />
          </View>
        ) : (
          /* מצב: אין חניה פעילה */
          <View style={styles.noParkingContainer}>
            <View style={styles.parkBtnWrapper}>
              <View style={styles.pulseRing}>
                <TouchableOpacity
                  style={styles.bigParkBtn}
                  onPress={handleParkNow}
                  disabled={isLocating}
                  activeOpacity={0.8}
                >
                  {isLocating ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="car-brake-parking" size={60} color="#FFFFFF" />
                      <Text style={styles.bigParkBtnText}>חניתי כאן</Text>
                      <Text style={styles.bigParkSub}>שמור מיקום והפעל מעקב</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* חיווי זיהוי אוטומטי של Bluetooth */}
            <View style={styles.autoDetectBadge}>
              <Ionicons name="bluetooth" size={16} color="#38BDF8" />
              <Text style={styles.autoDetectText}>
                זיהוי אוטומטי של ניתוק דיבורית רכב פועל ברקע
              </Text>
            </View>

            {/* קיצורי דרך להפעלת פנגו וסלופארק גם כשטרם נשמרה חניה */}
            <QuickActionsBar />

            {/* כרטיס טיפ שימושי */}
            <View style={styles.tipCard}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              <View style={styles.tipTextBox}>
                <Text style={styles.tipTitle}>איך זה עובד?</Text>
                <Text style={styles.tipDesc}>
                  בלחיצה על "חניתי כאן", ParkGuard תשמור את מיקומך. ברגע שתתחיל לנסוע ברכב ותתרחק מהחניה - תקבל התראה קולית והודעה לעצור את החניה בפנגו או סלופארק.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* מודלים */}
      <GarageDetailsModal
        visible={showGarageModal}
        initialDetails={session?.garage}
        onSave={handleSaveGarageDetails}
        onClose={() => setShowGarageModal(false)}
      />

      <MeterReminderModal
        visible={showMeterModal}
        currentMinutes={session?.meterReminderMinutes}
        onSave={handleSaveMeterReminder}
        onClose={() => setShowMeterModal(false)}
      />

      <DepartureAlertModal
        alertState={alertState}
        onDismiss={() => setAlertState(null)}
        onEndParking={handleEndParking}
      />

      <SimulatorModal
        visible={showSimulatorModal}
        onSetSession={(simSession) => setSession(simSession)}
        onSimulateDeparture={(speed, dist) => handleDepartureTrigger(speed, dist)}
        onClose={() => setShowSimulatorModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  brandContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  appSub: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  noParkingContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  parkBtnWrapper: {
    alignItems: 'center',
    marginVertical: 14,
  },
  pulseRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigParkBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  bigParkBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  bigParkSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  autoDetectBadge: {
    alignSelf: 'center',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  autoDetectText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tipCard: {
    width: '100%',
    flexDirection: 'row-reverse',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 6,
  },
  tipTextBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tipTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  tipDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
  },
});
