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
          <Text style={styles.btnText} numberOfLines={1}>פנגו</Text>
          <Text style={styles.subText} numberOfLines={1}>Pango</Text>
        </TouchableOpacity>

        {/* כפתור סלופארק */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.celloBtn]}
          onPress={() => IntegrationsService.openCellopark()}
          activeOpacity={0.8}
        >
          <Ionicons name="car-sport" size={24} color="#FFFFFF" />
          <Text style={styles.btnText} numberOfLines={1}>סלופארק</Text>
          <Text style={styles.subText} numberOfLines={1}>Cello</Text>
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
          <FontAwesome5 name="waze" size={22} color="#FFFFFF" />
          <Text style={styles.btnText} numberOfLines={1}>Waze</Text>
          <Text style={styles.subText} numberOfLines={1}>ניווט לרכב</Text>
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
          <Text style={styles.btnText} numberOfLines={1}>מפות</Text>
          <Text style={styles.subText} numberOfLines={1}>ניווט רגלי</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
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
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 2,
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
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});
