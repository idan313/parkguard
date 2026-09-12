import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppSettings } from '../types/parking';
import { StorageService, DEFAULT_SETTINGS } from '../services/storage';
import { VoiceService } from '../services/voice';
import { SimulatorModal } from '../components/SimulatorModal';

interface Props {
  onBack: () => void;
}

export const SettingsScreen: React.FC<Props> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await StorageService.getSettings();
    setSettings(saved);
  };

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await StorageService.saveSettings(updated);
  };

  const handleTestVoice = async () => {
    await VoiceService.alertParkingDeparture();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.title}>הגדרות ParkGuard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* קבוצה 1: זיהוי עזיבה וספים */}
        <Text style={styles.sectionHeader}>ספי זיהוי עזיבת חניה</Text>
        <View style={styles.card}>
          {/* סף מהירות נסיעה */}
          <View style={styles.settingRow}>
            <View style={styles.stepperCol}>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() =>
                    updateSetting(
                      'speedThresholdKmH',
                      Math.max(10, settings.speedThresholdKmH - 5)
                    )
                  }
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{settings.speedThresholdKmH} קמ"ש</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() =>
                    updateSetting(
                      'speedThresholdKmH',
                      Math.min(50, settings.speedThresholdKmH + 5)
                    )
                  }
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>סף מהירות רכב</Text>
              <Text style={styles.settingDesc}>
                התראה תישלח רק אם המהירות עולה מעל סף זה (מונע התראות שווא בהליכה).
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* סף מרחק התרחקות */}
          <View style={styles.settingRow}>
            <View style={styles.stepperCol}>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() =>
                    updateSetting(
                      'distanceThresholdMeters',
                      Math.max(50, settings.distanceThresholdMeters - 25)
                    )
                  }
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{settings.distanceThresholdMeters} מטר</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() =>
                    updateSetting(
                      'distanceThresholdMeters',
                      Math.min(500, settings.distanceThresholdMeters + 25)
                    )
                  }
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>מרחק התרחקות מינימלי</Text>
              <Text style={styles.settingDesc}>
                מרחק נדרש ממקום החניה לפני שההתראה מופעלת.
              </Text>
            </View>
          </View>
        </View>

        {/* קבוצה 2: התראות ושמע */}
        <Text style={styles.sectionHeader}>התראות ושמע</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Switch
              value={settings.voiceAlertsEnabled}
              onValueChange={(val) => updateSetting('voiceAlertsEnabled', val)}
              trackColor={{ false: '#334155', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>הודעה קולית בעברית</Text>
              <Text style={styles.settingDesc}>
                השמעת "שים לב: זוהתה נסיעה, אל תשכח לעצור את פנגו או סלופארק".
              </Text>
            </View>
          </View>

          {settings.voiceAlertsEnabled && (
            <TouchableOpacity style={styles.testVoiceBtn} onPress={handleTestVoice}>
              <Ionicons name="volume-medium-outline" size={18} color="#38BDF8" />
              <Text style={styles.testVoiceText}>השמע דוגמה לבדיקה</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <Switch
              value={settings.vibrationAlertsEnabled}
              onValueChange={(val) => updateSetting('vibrationAlertsEnabled', val)}
              trackColor={{ false: '#334155', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>רטט תחושתי בעת התראה</Text>
              <Text style={styles.settingDesc}>דפוס רטט חזק בעת זיהוי נסיעה</Text>
            </View>
          </View>
        </View>

        {/* קבוצה 3: בלוטות' הרכב */}
        <Text style={styles.sectionHeader}>אינטגרציית Bluetooth רכב</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Switch
              value={settings.bluetoothAutoDetect}
              onValueChange={(val) => updateSetting('bluetoothAutoDetect', val)}
              trackColor={{ false: '#334155', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>זיהוי אוטומטי של Bluetooth</Text>
              <Text style={styles.settingDesc}>
                זיהוי חניה בעת ניתוק מדיבורית הרכב, והתרעה בעת חיבור מחדש.
              </Text>
            </View>
          </View>
        </View>

        {/* קבוצה 4: כלי פיתוח ובדיקה */}
        <Text style={styles.sectionHeader}>כלי בדיקה וסימולציה</Text>
        <TouchableOpacity
          style={styles.simulatorBtn}
          onPress={() => setShowSimulatorModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="flask" size={24} color="#A855F7" />
          <View style={styles.simBtnTextCol}>
            <Text style={styles.simulatorBtnText}>פתח את מעבדת הסימולציה (Simulator)</Text>
            <Text style={styles.simulatorBtnSub}>
              בדוק את כל ההתראות, הצלילים והתרחישים ללא צורך ביציאה לרכב
            </Text>
          </View>
        </TouchableOpacity>

        {/* אודות ופרטיות */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <Ionicons name="lock-closed" size={16} color="#10B981" />
            <Text style={styles.aboutTitle}>פרטיות מוחלטת (Privacy First)</Text>
          </View>
          <Text style={styles.aboutDesc}>
            כל נתוני המיקום, התמונות והחניות שלך נשמרים מקומית על גבי המכשיר שלך בלבד ואינם נשלחים לשום שרת חיצוני. האפליקציה פועלת במלואה גם ללא חיבור לאינטרנט ותואמת את מדיניות Google Play.
          </Text>
          <Text style={styles.versionText}>ParkGuard גרסה 1.0.0 (Production Ready)</Text>
        </View>
      </ScrollView>

      <SimulatorModal
        visible={showSimulatorModal}
        onSetSession={() => {
          Alert.alert('חניה הוגדרה', 'החניה לדוגמה הופעלה בהצלחה! חזור למסך הראשי כדי לראותה.');
        }}
        onSimulateDeparture={() => {
          Alert.alert('התראה הופעלה', 'דימוי עזיבת חניה הופעל בהצלחה.');
        }}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  backBtn: {
    padding: 6,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    marginTop: 14,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  settingTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'right',
  },
  settingDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'right',
  },
  stepperCol: {
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepperValue: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  },
  testVoiceBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  testVoiceText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  simulatorBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A855F7',
    marginBottom: 10,
  },
  simBtnTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  simulatorBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'right',
  },
  simulatorBtnSub: {
    color: '#CBD5E1',
    fontSize: 11,
    textAlign: 'right',
  },
  aboutCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  aboutHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aboutTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  aboutDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 10,
  },
  versionText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
  },
});
