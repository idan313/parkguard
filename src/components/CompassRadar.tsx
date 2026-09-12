import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IntegrationsService } from '../services/integrations';
import { ParkingLocation } from '../types/parking';

interface Props {
  parkingLocation: ParkingLocation;
  currentDistanceMeters: number | null;
  bearingDegrees: number; // 0-360
}

export const CompassRadar: React.FC<Props> = ({
  parkingLocation,
  currentDistanceMeters,
  bearingDegrees,
}) => {
  const formattedDistance =
    currentDistanceMeters !== null
      ? currentDistanceMeters >= 1000
        ? `${(currentDistanceMeters / 1000).toFixed(1)} ק"מ`
        : `${Math.round(currentDistanceMeters)} מטר`
      : 'מחשב מרחק...';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="compass" size={20} color="#10B981" />
        <Text style={styles.headerTitle}>מצפן ניווט רגלי לרכב (Walking Radar)</Text>
      </View>

      <View style={styles.radarContent}>
        {/* מעגל הרדאר ומחט הכיוון */}
        <View style={styles.radarCircle}>
          <View style={styles.innerRing} />
          <View
            style={[
              styles.pointerContainer,
              { transform: [{ rotate: `${bearingDegrees}deg` }] },
            ]}
          >
            <Ionicons name="arrow-up" size={36} color="#10B981" />
          </View>
          <View style={styles.centerDot} />
        </View>

        {/* נתוני מרחק וכפתור ניווט מהיר */}
        <View style={styles.infoCol}>
          <Text style={styles.distanceLabel}>מרחק בקו אווירי לרכב:</Text>
          <Text style={styles.distanceValue}>{formattedDistance}</Text>

          <TouchableOpacity
            style={styles.walkNavBtn}
            onPress={() =>
              IntegrationsService.navigateWithGoogleMaps(
                parkingLocation.latitude,
                parkingLocation.longitude,
                'walking'
              )
            }
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="walk" size={18} color="#FFFFFF" />
            <Text style={styles.walkNavText}>נווט רגלית במפה</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  radarContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  radarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1E293B',
    borderStyle: 'dashed',
  },
  pointerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  infoCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8',
    marginBottom: 8,
  },
  walkNavBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  walkNavText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
