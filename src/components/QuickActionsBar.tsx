import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { IntegrationsService } from '../services/integrations';
import { ParkingLocation } from '../types/parking';

interface Props {
  location?: ParkingLocation | null;
  notes?: string;
}

export const QuickActionsBar: React.FC<Props> = ({ location, notes }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>קיצורי דרך מהירים</Text>
      <View style={styles.buttonsRow}>
        {/* כפתור פנגו */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.pangoBtn]}
          onPress={() => IntegrationsService.openPango()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="parking" size={24} color="#FFFFFF" />
          <Text style={styles.btnText}>פנגו</Text>
          <Text style={styles.subText}>Pango</Text>
        </TouchableOpacity>

        {/* כפתור סלופארק */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.celloBtn]}
          onPress={() => IntegrationsService.openCellopark()}
          activeOpacity={0.8}
        >
          <Ionicons name="car-sport" size={24} color="#FFFFFF" />
          <Text style={styles.btnText}>סלופארק</Text>
          <Text style={styles.subText}>Cello</Text>
        </TouchableOpacity>

        {/* כפתור Waze */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.wazeBtn]}
          onPress={() => {
            if (location) {
              IntegrationsService.navigateWithWaze(location.latitude, location.longitude);
            }
          }}
          disabled={!location}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="waze" size={24} color="#FFFFFF" />
          <Text style={styles.btnText}>Waze</Text>
          <Text style={styles.subText}>ניווט לרכב</Text>
        </TouchableOpacity>

        {/* כפתור Google Maps */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.mapsBtn]}
          onPress={() => {
            if (location) {
              IntegrationsService.navigateWithGoogleMaps(location.latitude, location.longitude, 'walking');
            }
          }}
          disabled={!location}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate-circle" size={24} color="#FFFFFF" />
          <Text style={styles.btnText}>מפות</Text>
          <Text style={styles.subText}>ניווט רגלי</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 12,
    textAlign: 'right',
  },
  buttonsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pangoBtn: {
    backgroundColor: '#F97316', // כתום פנגו
  },
  celloBtn: {
    backgroundColor: '#EF4444', // אדום סלופארק
  },
  wazeBtn: {
    backgroundColor: '#0EA5E9', // תכלת וויז
  },
  mapsBtn: {
    backgroundColor: '#10B981', // ירוק מפות
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    marginTop: 2,
  },
});
