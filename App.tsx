import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Tab = 'home' | 'history' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* אזור התוכן לפי הטאב הפעיל */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen onNavigateToSettings={() => setActiveTab('settings')} />
        )}
        {activeTab === 'history' && <HistoryScreen />}
        {activeTab === 'settings' && (
          <SettingsScreen onBack={() => setActiveTab('home')} />
        )}
      </View>

      {/* סרגל ניווט תחתון (Bottom Tab Bar) */}
      <SafeAreaView style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          {/* טאב הגדרות */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={activeTab === 'settings' ? '#10B981' : '#64748B'}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'settings' && styles.activeNavLabel,
              ]}
            >
              הגדרות
            </Text>
          </TouchableOpacity>

          {/* טאב היסטוריה */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'history' ? 'time' : 'time-outline'}
              size={22}
              color={activeTab === 'history' ? '#10B981' : '#64748B'}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'history' && styles.activeNavLabel,
              ]}
            >
              יומן חניות
            </Text>
          </TouchableOpacity>

          {/* טאב חניה ראשי */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'home' ? 'car' : 'car-outline'}
              size={24}
              color={activeTab === 'home' ? '#10B981' : '#64748B'}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'home' && styles.activeNavLabel,
              ]}
            >
              חניה
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  screenContainer: {
    flex: 1,
  },
  bottomNavContainer: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 16 : 8,
    backgroundColor: '#0F172A',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 4,
  },
  navLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  activeNavLabel: {
    color: '#10B981',
    fontWeight: '800',
  },
});
