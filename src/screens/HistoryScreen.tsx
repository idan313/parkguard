import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ParkingSession } from '../types/parking';
import { StorageService } from '../services/storage';
import { IntegrationsService } from '../services/integrations';

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<ParkingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await StorageService.getHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'מחיקת היסטוריה',
      'האם אתה בטוח שברצונך למחוק את כל היסטוריית החניות?',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק הכל',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    if (!endTime) return 'חניה פעילה';
    const diffMin = Math.round((endTime - startTime) / (1000 * 60));
    if (diffMin < 60) {
      return `${diffMin} דקות`;
    }
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return `${hours} שעות ${mins > 0 ? `ו-${mins} דק'` : ''}`;
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.toLocaleDateString('he-IL')} • ${d.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const renderItem = ({ item }: { item: ParkingSession }) => {
    const garage = item.garage;

    return (
      <View style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={14} color="#38BDF8" />
            <Text style={styles.durationText}>
              {formatDuration(item.startTime, item.endTime)}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.startTime)}</Text>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={18} color="#10B981" />
          <Text style={styles.addressText} numberOfLines={2}>
            {item.location.address || 'מיקום שמור ב-GPS'}
          </Text>
        </View>

        {/* פרטי חניון אם הוזנו */}
        {(garage?.floor || garage?.pillarRow || garage?.colorZone || garage?.photoUri) && (
          <View style={styles.garageBox}>
            {garage?.photoUri && (
              <Image source={{ uri: garage.photoUri }} style={styles.garageThumb} />
            )}
            <View style={styles.garageDetails}>
              {garage.floor && <Text style={styles.garageTag}>קומה: {garage.floor}</Text>}
              {garage.colorZone && (
                <Text style={styles.garageTag}>מתחם: {garage.colorZone}</Text>
              )}
              {garage.pillarRow && (
                <Text style={styles.garageTag}>סימון: {garage.pillarRow}</Text>
              )}
            </View>
          </View>
        )}

        {/* כפתורי ניווט */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() =>
              IntegrationsService.navigateWithWaze(
                item.location.latitude,
                item.location.longitude
              )
            }
          >
            <Ionicons name="navigate" size={14} color="#38BDF8" />
            <Text style={styles.navBtnText}>נווט עם Waze</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() =>
              IntegrationsService.navigateWithGoogleMaps(
                item.location.latitude,
                item.location.longitude,
                'walking'
              )
            }
          >
            <MaterialCommunityIcons name="google-maps" size={14} color="#10B981" />
            <Text style={styles.navBtnText}>מפות Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>יומן היסטוריית חניות</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="parking" size={64} color="#334155" />
          <Text style={styles.emptyTitle}>אין חניות קודמות</Text>
          <Text style={styles.emptyDesc}>
            כל חניה שתסיים תישמר ביומן המקומי במכשירך בלבד, כך שתוכל לראות איפה ומתי חנית.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'right',
  },
  clearBtn: {
    padding: 6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  historyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  addressRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  garageBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  garageThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  garageDetails: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
  },
  garageTag: {
    backgroundColor: '#1E293B',
    color: '#CBD5E1',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardActions: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  navBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#94A3B8',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
