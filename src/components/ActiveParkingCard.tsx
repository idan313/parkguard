import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ParkingSession } from '../types/parking';
import { IntegrationsService } from '../services/integrations';

interface Props {
  session: ParkingSession;
  onEditGarage: () => void;
  onEndParking: () => void;
  onSetMeterReminder: () => void;
}

const formatFloorDisplay = (floor?: string): string => {
  if (!floor) return '';
  const trimmed = floor.trim();
  if (trimmed.startsWith('-')) {
    return `מינוס ${trimmed.slice(1)}`;
  }
  if (trimmed.startsWith('+')) {
    return `פלוס ${trimmed.slice(1)}`;
  }
  if (trimmed === '0') {
    return 'קרקע (0)';
  }
  return `\u200E${trimmed}`;
};

export const ActiveParkingCard: React.FC<Props> = ({
  session,
  onEditGarage,
  onEndParking,
  onSetMeterReminder,
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [meterMinutesLeft, setMeterMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateTimes = () => {
      const now = Date.now();
      const diffSeconds = Math.floor((now - session.startTime) / 1000);

      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;

      const pad = (n: number) => n.toString().padStart(2, '0');
      setElapsedTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

      if (session.meterReminderMinutes) {
        const totalMeterSeconds = session.meterReminderMinutes * 60;
        const remainingSeconds = totalMeterSeconds - diffSeconds;
        setMeterMinutesLeft(Math.max(0, Math.floor(remainingSeconds / 60)));
      } else {
        setMeterMinutesLeft(null);
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const garage = session.garage;

  return (
    <View style={styles.card}>
      {/* כותרת עליונה וטיימר חי */}
      <View style={styles.topRow}>
        <View style={styles.statusBadge}>
          <View style={styles.blinkingDot} />
          <Text style={styles.statusText}>חניה פעילה</Text>
        </View>

        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={16} color="#38BDF8" />
          <Text style={styles.timerText}>{elapsedTime}</Text>
        </View>
      </View>

      {/* כתובת המיקום */}
      <View style={styles.addressRow}>
        <Ionicons name="location" size={20} color="#10B981" />
        <Text style={styles.addressText} numberOfLines={2}>
          {session.location.address || 'מיקום שמור ב-GPS'}
        </Text>
      </View>

      {/* מדחן / טיימר זמן קצוב */}
      {meterMinutesLeft !== null && (
        <View
          style={[
            styles.meterBar,
            meterMinutesLeft < 15 ? styles.meterBarUrgent : styles.meterBarNormal,
          ]}
        >
          <MaterialCommunityIcons
            name="timer-alert-outline"
            size={18}
            color={meterMinutesLeft < 15 ? '#EF4444' : '#F59E0B'}
          />
          <Text
            style={[
              styles.meterText,
              meterMinutesLeft < 15 && { color: '#EF4444' },
            ]}
          >
            {meterMinutesLeft > 0
              ? `נותרו כ-${meterMinutesLeft} דקות לחניה במדחן`
              : 'זמן החניה במדחן הסתיים!'}
          </Text>
        </View>
      )}

      {/* תגית פרטי חניון תת-קרקעי (קומה, צבע, עמוד, תמונה) */}
      <View style={styles.garageSection}>
        <View style={styles.garageHeader}>
          <TouchableOpacity onPress={onEditGarage} style={styles.editGarageBtn}>
            <Ionicons name="pencil" size={14} color="#38BDF8" />
            <Text style={styles.editGarageText}>
              {garage?.floor || garage?.pillarRow ? 'ערוך פרטים' : '+ הוסף קומה/עמוד'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.garageTitle}>פרטי החניון:</Text>
        </View>

        <View style={styles.garageDetailsRow}>
          {garage?.photoUri && (
            <Image source={{ uri: garage.photoUri }} style={styles.garageThumb} />
          )}

          <View style={styles.garageBadgesCol}>
            <View style={styles.badgesWrapper}>
              {garage?.floor ? (
                <View style={styles.badgeItem}>
                  <Text style={styles.badgeItemLabel}>קומה:</Text>
                  <Text style={styles.badgeItemVal}>{formatFloorDisplay(garage.floor)}</Text>
                </View>
              ) : null}

              {garage?.colorZone ? (
                <View style={styles.badgeItem}>
                  <Text style={styles.badgeItemLabel}>מתחם:</Text>
                  <Text style={styles.badgeItemVal}>{garage.colorZone}</Text>
                </View>
              ) : null}

              {garage?.pillarRow ? (
                <View style={styles.badgeItem}>
                  <Text style={styles.badgeItemLabel}>סימון:</Text>
                  <Text style={styles.badgeItemVal}>{garage.pillarRow}</Text>
                </View>
              ) : null}
            </View>

            {garage?.notes ? (
              <Text style={styles.garageNoteText} numberOfLines={2}>
                הערה: {garage.notes}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* כפתורי פעולה משניים */}
      <View style={styles.secondaryActions}>
        <TouchableOpacity
          style={styles.secBtn}
          onPress={() =>
            IntegrationsService.shareParkingLocation(
              session.location.latitude,
              session.location.longitude,
              garage?.pillarRow || garage?.floor ? `קומה ${garage.floor || ''}, ${garage.pillarRow || ''}` : undefined
            )
          }
        >
          <Ionicons name="share-social-outline" size={16} color="#94A3B8" />
          <Text style={styles.secBtnText}>שתף בוואטסאפ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secBtn} onPress={onSetMeterReminder}>
          <MaterialCommunityIcons name="timer-plus-outline" size={16} color="#94A3B8" />
          <Text style={styles.secBtnText}>
            {session.meterReminderMinutes ? 'עדכן מדחן' : 'הגדר מדחן'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* כפתור סיום חניה ראשי */}
      <TouchableOpacity
        style={styles.endParkingBtn}
        onPress={onEndParking}
        activeOpacity={0.8}
      >
        <Ionicons name="stop-circle" size={22} color="#FFFFFF" />
        <Text style={styles.endParkingText}>סיום חניה ואיפוס מעקב</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#059669',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  blinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 13,
  },
  timerBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontWeight: '800',
    fontSize: 15,
  },
  addressRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  addressText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  meterBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  meterBarNormal: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  meterBarUrgent: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  meterText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
  },
  garageSection: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  garageHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  garageTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  editGarageBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  editGarageText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  garageDetailsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    alignItems: 'center',
  },
  garageThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  garageBadgesCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  badgesWrapper: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgeItem: {
    flexDirection: 'row-reverse',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeItemLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  badgeItemVal: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 11,
  },
  garageNoteText: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'right',
  },
  secondaryActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  secBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  secBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  endParkingBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 13,
  },
  endParkingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
