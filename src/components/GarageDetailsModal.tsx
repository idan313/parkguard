import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { GarageDetails } from '../types/parking';

interface Props {
  visible: boolean;
  initialDetails?: GarageDetails;
  onSave: (details: GarageDetails) => void;
  onClose: () => void;
}

const FLOORS = ['-5', '-4', '-3', '-2', '-1', '0', '+1', '+2', '+3', '+4', '+5'];
const COLOR_ZONES = [
  { name: 'צהוב', color: '#EAB308' },
  { name: 'כחול', color: '#3B82F6' },
  { name: 'אדום', color: '#EF4444' },
  { name: 'ירוק', color: '#10B981' },
  { name: 'כתום', color: '#F97316' },
  { name: 'סגול', color: '#A855F7' },
  { name: 'אפור', color: '#64748B' },
];

export const GarageDetailsModal: React.FC<Props> = ({
  visible,
  initialDetails,
  onSave,
  onClose,
}) => {
  const [floor, setFloor] = useState(initialDetails?.floor || '');
  const [colorZone, setColorZone] = useState(initialDetails?.colorZone || '');
  const [pillarRow, setPillarRow] = useState(initialDetails?.pillarRow || '');
  const [notes, setNotes] = useState(initialDetails?.notes || '');
  const [photoUri, setPhotoUri] = useState<string | undefined>(initialDetails?.photoUri);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('הרשאת מצלמה', 'נא לאשר גישה למצלמה בהגדרות המכשיר לצילום מקום החניה.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera error:', e);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Gallery error:', e);
    }
  };

  const handleSave = () => {
    onSave({
      floor,
      colorZone,
      pillarRow,
      photoUri,
      notes,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* כותרת וכפתור סגירה */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
            <Text style={styles.title}>פרטי חניון תת-קרקעי</Text>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* בורר קומה */}
            <Text style={styles.label}>קומה בחניון:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {FLOORS.map((f) => {
                const isSelected = floor === f;
                return (
                  <TouchableOpacity
                    key={f}
                    style={[styles.floorChip, isSelected && styles.selectedChip]}
                    onPress={() => setFloor(isSelected ? '' : f)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                      {`\u200E${f}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {floor ? (
              <Text style={styles.selectedFloorLabel}>
                נבחרה קומה:{' '}
                {floor.startsWith('-')
                  ? `מינוס ${floor.slice(1)}`
                  : floor.startsWith('+')
                  ? `פלוס ${floor.slice(1)}`
                  : floor === '0'
                  ? 'קרקע (0)'
                  : floor}
              </Text>
            ) : null}

            {/* בורר צבע מתחם */}
            <Text style={styles.label}>צבע אזור / מתחם:</Text>
            <View style={styles.colorRow}>
              {COLOR_ZONES.map((zone) => {
                const isSelected = colorZone === zone.name;
                return (
                  <TouchableOpacity
                    key={zone.name}
                    style={[
                      styles.colorBadge,
                      { backgroundColor: zone.color },
                      isSelected && styles.selectedColorBadge,
                    ]}
                    onPress={() => setColorZone(isSelected ? '' : zone.name)}
                  >
                    {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
            {colorZone ? (
              <Text style={styles.selectedColorLabel}>נבחר: מתחם {colorZone}</Text>
            ) : null}

            {/* שדה עמוד ושורה */}
            <Text style={styles.label}>עמוד / שורה / סימון:</Text>
            <TextInput
              style={styles.input}
              placeholder="לדוגמה: עמוד 42, שורה ד׳, ליד המעלית"
              placeholderTextColor="#64748B"
              value={pillarRow}
              onChangeText={setPillarRow}
              textAlign="right"
            />

            {/* צילום תמונה של עמוד החניה */}
            <Text style={styles.label}>תמונת עמוד החניה / הרכב:</Text>
            {photoUri ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => setPhotoUri(undefined)}
                >
                  <Ionicons name="trash" size={18} color="#FFFFFF" />
                  <Text style={styles.removePhotoText}>מחק תמונה</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActionRow}>
                <TouchableOpacity style={styles.photoBtn} onPress={handleTakePhoto}>
                  <Ionicons name="camera" size={20} color="#10B981" />
                  <Text style={styles.photoBtnText}>צלם במצלמה</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoBtn} onPress={handlePickFromGallery}>
                  <Ionicons name="images" size={20} color="#38BDF8" />
                  <Text style={styles.photoBtnText}>בחר מהגלריה</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* הערות חופשיות */}
            <Text style={styles.label}>הערות נוספות:</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="רשום הערה לעצמך..."
              placeholderTextColor="#64748B"
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlign="right"
            />
          </ScrollView>

          {/* כפתור שמירה */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Ionicons name="save" size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>שמור פרטי חניון</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'right',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    marginTop: 12,
    textAlign: 'right',
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    paddingVertical: 4,
  },
  floorChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedChip: {
    backgroundColor: '#059669',
    borderColor: '#10B981',
  },
  chipText: {
    color: '#E2E8F0',
    fontWeight: '700',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  colorRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginVertical: 6,
  },
  colorBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColorBadge: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  selectedFloorLabel: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 4,
  },
  selectedColorLabel: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  notesInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  photoActionRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
  },
  photoBtnText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  removePhotoBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 14,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
