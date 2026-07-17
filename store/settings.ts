import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

// Persisted under the legacy AsyncStorage key "settings" in the raw legacy shape.
// Legacy payloads also carry a stray `datePickerVisible` field — tolerated on read
// (we simply ignore extra keys) and dropped going forward.
export interface Persisted {
  remindersActive: boolean;
  reminderTime: string; // UTC date string
  timeSet: boolean;
  expertMode: boolean;
}

interface SettingsStore extends Persisted {
  setRemindersActive: (active: boolean) => void;
  setReminderTime: (utcString: string) => void;
  setExpertMode: (expertMode: boolean) => void;
  reset: () => void;
}

const initial: Persisted = {
  remindersActive: false,
  reminderTime: new Date().toUTCString(),
  timeSet: false,
  expertMode: false,
};

// Raw-shape storage adapter (same approach as store/workout.ts): reads/writes the
// bare legacy JSON object at "settings" instead of zustand's wrapped envelope.
const storage: PersistStorage<Persisted> = {
  getItem: async (name) => {
    const raw = await AsyncStorage.getItem(name);
    if (!raw) return null;
    return { state: JSON.parse(raw) as Persisted, version: 0 };
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value.state));
  },
  removeItem: (name) => AsyncStorage.removeItem(name),
};

export const useSettingsStore = create<SettingsStore>()(
  persist<SettingsStore, [], [], Persisted>(
    (set) => ({
      ...initial,
      setRemindersActive: (remindersActive) => set({ remindersActive }),
      setReminderTime: (reminderTime) => set({ reminderTime, timeSet: true }),
      setExpertMode: (expertMode) => set({ expertMode }),
      reset: () => set(initial),
    }),
    {
      name: 'settings',
      storage,
      partialize: (s) => ({
        remindersActive: s.remindersActive,
        reminderTime: s.reminderTime,
        timeSet: s.timeSet,
        expertMode: s.expertMode,
      }),
    },
  ),
);
