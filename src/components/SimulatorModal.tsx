import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SimulatorService } from '../services/simulator';
import { VoiceService } from '../services/voice';
import { IntegrationsService } from '../services/integrations';
import { ParkingSession } from '../types/parking';

interface Props {
  visible: boolean;
  onSetSession: (session: ParkingSession) => void;
  onSimulateDeparture: (speedKmH: number, distanceMeters: number) => void;
  onClose: () => void;
}

export const SimulatorModal: React.FC<Props> = ({
  visible,
  onSetSession,
  onSimulateDeparture,
  onClose,
}) => {
  const handleSimulateParking = () => {
    const session = SimulatorService.generateSimulatedSession();
    onSetSession(session);
    VoiceService.announceParkingStarted();
    onClose();
  };

  const handleSimulateDeparture = () => {
    SimulatorService.triggerSimulatedDeparture((speed, dist) => {
      onSimulateDeparture(speed, dist);
    });
    onClose();
  };

  const handleSimulateBluetooth = () => {
    SimulatorService.triggerSimulatedBluetoothConnect(() => {
      onSimulateDeparture(25, 180);
    });
    onClose();
  };

  const handleTestVoice = async () => {
    await VoiceService.alertParkingDeparture();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.titleRow}>
              <Ionicons name="flask" size={22} color="#A855F7" />
              <Text style={styles.title}>מצב סימולציה ובדיקה (Simulator)</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            כלי מיוחד לבדיקת כל ההתראות, הצלילים והחיישנים ישירות מהספה ללא צורך לנסוע ברכב בפועל.
          </Text>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {/* סימולציה 1: הפעלת חניה לדוגמה */}
            <TouchableOpacity style={styles.simCard} onPress={handleSimulateParking}>
              <View style={[styles.simIconBox, { backgroundColor: '#0284C7' }]}>
                <Ionicons name="car" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.simTextBox}>
                <Text style={styles.simTitle}>1. צור חניה מדומה (עזריאלי קומה -3)</Text>
                <Text style={styles.simDesc}>מגדיר חניה פעילה עם קומה, עמוד, כתובת וטיימר מדחן</Text>
              </View>
            </TouchableOpacity>

            {/* סימולציה 2: דימוי התרחקות ברכב */}
            <TouchableOpacity style={styles.simCard} onPress={handleSimulateDeparture}>
              <View style={[styles.simIconBox, { backgroundColor: '#EF4444' }]}>
                <Ionicons name="speedometer" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.simTextBox}>
                <Text style={styles.simTitle}>2. דמה עזיבה ברכב (28 קמ"ש, 230 מ')</Text>
                <Text style={styles.simDesc}>מפעיל את התראת המהירות, ההודעה הקולית ומסך העצירה</Text>
              </View>
            </TouchableOpacity>

            {/* סימולציה 3: דימוי חיבור לבלוטות' הרכב */}
            <TouchableOpacity style={styles.simCard} onPress={handleSimulateBluetooth}>
              <View style={[styles.simIconBox, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="bluetooth" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.simTextBox}>
                <Text style={styles.simTitle}>3. דמה חיבור Bluetooth של הרכב</Text>
                <Text style={styles.simDesc}>מדמה התנעה וכניסה לרכב ומזניק התראה לעצירת תשלום</Text>
              </View>
            </TouchableOpacity>

            {/* בדיקה 4: השמעת הנחיה קולית בעברית */}
            <TouchableOpacity style={styles.simCard} onPress={handleTestVoice}>
              <View style={[styles.simIconBox, { backgroundColor: '#10B981' }]}>
                <Ionicons name="volume-high" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.simTextBox}>
                <Text style={styles.simTitle}>4. בדוק השמעת התראה קולית בעברית</Text>
                <Text style={styles.simDesc}>"שים לב: זוהתה נסיעה, אל תשכח לעצור את פנגו..."</Text>
              </View>
            </TouchableOpacity>

            {/* בדיקה 5: בדיקת פתיחת אפליקציות חיצוניות */}
            <View style={styles.integrationsBox}>
              <Text style={styles.boxTitle}>בדיקת פתיחת קישורים חיצוניים:</Text>
              <View style={styles.linksRow}>
                <TouchableOpacity
                  style={[styles.linkChip, { backgroundColor: '#F97316' }]}
                  onPress={() => IntegrationsService.openPango()}
                >
                  <Text style={styles.linkText}>פנגו</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.linkChip, { backgroundColor: '#DC2626' }]}
                  onPress={() => IntegrationsService.openCellopark()}
                >
                  <Text style={styles.linkText}>סלופארק</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.linkChip, { backgroundColor: '#0284C7' }]}
                  onPress={() => IntegrationsService.navigateWithWaze(32.0740, 34.7915)}
                >
                  <Text style={styles.linkText}>Waze</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'right',
    marginBottom: 16,
    lineHeight: 18,
  },
  scrollList: {
    marginBottom: 20,
  },
  simCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  simIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simTextBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  simTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
    textAlign: 'right',
  },
  simDesc: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'right',
  },
  integrationsBox: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  boxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    textAlign: 'right',
    marginBottom: 10,
  },
  linksRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    gap: 8,
  },
  linkChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
