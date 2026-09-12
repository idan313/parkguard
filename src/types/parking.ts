export interface ParkingLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  address?: string;
  timestamp: number;
}

export interface GarageDetails {
  floor?: string;       // e.g. "-3", "P2", "קרקע"
  colorZone?: string;   // e.g. "צהוב", "כחול", "אדום", "ירוק"
  pillarRow?: string;   // e.g. "עמוד 42", "שורה ד'"
  photoUri?: string;    // local image URI
  notes?: string;       // free text note
}

export interface ParkingSession {
  id: string;
  startTime: number;
  endTime?: number;
  location: ParkingLocation;
  garage?: GarageDetails;
  meterReminderMinutes?: number; // e.g. 120 (2 hours)
  alertSent?: boolean;
  notes?: string;
}

export interface AppSettings {
  speedThresholdKmH: number;      // default 20
  distanceThresholdMeters: number; // default 150
  voiceAlertsEnabled: boolean;     // default true
  vibrationAlertsEnabled: boolean; // default true
  bluetoothAutoDetect: boolean;   // default true
  selectedBluetoothDevice?: string;
  meterReminderEnabled: boolean;  // default true
  meterReminderNoticeMinutes: number; // default 15 (alert 15m before expiry)
  preferredParkingApp: 'pango' | 'cellopark' | 'both';
}

export interface DepartureAlertState {
  isTriggered: boolean;
  currentSpeedKmH: number;
  distanceMeters: number;
  timestamp: number;
  reason: 'speed_and_distance' | 'bluetooth_connected' | 'manual_simulation';
}
