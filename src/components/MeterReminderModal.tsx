import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  currentMinutes?: number;
  onSave: (minutes: number | undefined) => void;
  onClose: () => void;
}

const PRESET_OPTIONS = [
  { label: 'חצי שעה', minutes: 30 },
  { label: 'שעה אחת', minutes: 60 },
  { label: 'שעה וחצי', minutes: 90 },
  { label: 'שעתיים', minutes: 120 },
  { label: '3 שעות', minutes: 180 },
];

export const MeterReminderModal: React.FC<Props> = ({
  visible,
  currentMinutes,
  onSave,
  onClose,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number | undefined>(currentMinutes);
  const [customInput, setCustomInput] = useState<string>('');

  const handleSelect = (mins: number) => {
    setSelectedMinutes(mins);
    setCustomInput('');
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedMinutes(parsed);
    }
  };

  const handleSave = () => {
    onSave(selectedMinutes);
    onClose();
  };

  const handleCancelReminder = () => {
    onSave(undefined);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
            <Text style={styles.title}>תזכורת מדחן / כחול-לבן</Text>
          </View>

          <Text style={styles.description}>
            בחר את זמן החניה המרבי המותר. האפליקציה תתריע לך 15 דקות לפני שהזמן מסתיים.
          </Text>

          {/* אפשרויות נפוצות */}
          <View style={styles.presetsGrid}>
            {PRESET_OPTIONS.map((item) => {
              const isSelected = selectedMinutes === item.minutes;
              return (
                <TouchableOpacity
                  key={item.minutes}
                  style={[styles.presetBtn, isSelected && styles.selectedPresetBtn]}
                  onPress={() => handleSelect(item.minutes)}
                >
                  <MaterialCommunityIcons
                    name="clock-time-four-outline"
                    size={20}
                    color={isSelected ? '#FFFFFF' : '#38BDF8'}
                  />
                  <Text style={[styles.presetText, isSelected && styles.selectedPresetText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* שדה הזנה מותאמת אישית */}
          <Text style={styles.customLabel}>או הגדר ידנית בדקות:</Text>
          <TextInput
            style={styles.customInput}
            keyboardType="number-pad"
            placeholder="לדוגמה: 45"
            placeholderTextColor="#64748B"
            value={customInput}
            onChangeText={handleCustomChange}
            textAlign="center"
          />

          {/* כפתורי פעולה */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>הפעל תזכורת</Text>
            </TouchableOpacity>

            {currentMinutes ? (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelReminder}>
                <Text style={styles.cancelBtnText}>בטל תזכורת</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'right',
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'right',
    marginBottom: 16,
    lineHeight: 18,
  },
  presetsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  presetBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedPresetBtn: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  presetText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedPresetText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  customLabel: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'right',
    marginBottom: 6,
  },
  customInput: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13,
  },
});
