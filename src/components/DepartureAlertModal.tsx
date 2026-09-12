import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IntegrationsService } from '../services/integrations';
import { DepartureAlertState } from '../types/parking';

interface Props {
  alertState: DepartureAlertState | null;
  onDismiss: () => void;
  onEndParking: () => void;
}

export const DepartureAlertModal: React.FC<Props> = ({
  alertState,
  onDismiss,
  onEndParking,
}) => {
  if (!alertState || !alertState.isTriggered) return null;

  const handleStopPango = () => {
    IntegrationsService.openPango();
    onEndParking();
  };

  const handleStopCello = () => {
    IntegrationsService.openCellopark();
    onEndParking();
  };

  return (
    <Modal
      visible={alertState.isTriggered}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* אייקון התראה מהבהב */}
          <View style={styles.alertIconBadge}>
            <Ionicons name="warning" size={44} color="#EF4444" />
          </View>

          <Text style={styles.title}>שים לב: זוהתה נסיעה!</Text>
          <Text style={styles.subtitle}>
            הרכב שלך יצא ממקום החניה.
          </Text>

          <View style={styles.metricsBox}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {Math.round(alertState.currentSpeedKmH)} קמ"ש
              </Text>
              <Text style={styles.metricLabel}>מהירות נסיעה</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {Math.round(alertState.distanceMeters)} מ'
              </Text>
              <Text style={styles.metricLabel}>התרחקות מהחניה</Text>
            </View>
          </View>

          <Text style={styles.callout}>
            אל תשכח לעצור את החניה כדי לא לשלם חיוב מיותר!
          </Text>

          {/* כפתורי עצירה בפנגו וסלופארק */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.pangoBtn]}
            onPress={handleStopPango}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="parking" size={24} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>עצור חניה בפנגו עכשיו</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.celloBtn]}
            onPress={handleStopCello}
            activeOpacity={0.85}
          >
            <Ionicons name="car-sport" size={24} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>עצור חניה בסלופארק עכשיו</Text>
          </TouchableOpacity>

          {/* כפתורי סיום ודחייה */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={styles.endParkingOnlyBtn}
              onPress={onEndParking}
              activeOpacity={0.7}
            >
              <Text style={styles.endParkingOnlyText}>סמן שסיימת חניה</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={styles.dismissText}>אני באוטובוס / התעלם</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  alertIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F87171',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 16,
  },
  metricsBox: {
    flexDirection: 'row-reverse',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38BDF8',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
  },
  callout: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FDE047',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
    gap: 10,
  },
  pangoBtn: {
    backgroundColor: '#F97316',
  },
  celloBtn: {
    backgroundColor: '#DC2626',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    gap: 8,
  },
  endParkingOnlyBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 10,
  },
  endParkingOnlyText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  dismissText: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
