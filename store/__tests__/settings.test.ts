import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSettingsStore } from '@/store/settings';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const setItemMock = AsyncStorage.setItem as jest.Mock;
const flush = () => new Promise((resolve) => setImmediate(resolve));

beforeEach(async () => {
  await AsyncStorage.clear();
  useSettingsStore.getState().reset();
  setItemMock.mockClear();
});

describe('rehydration of legacy "settings" payload', () => {
  it('hydrates the known fields and tolerates a stray datePickerVisible key', async () => {
    const legacy = {
      remindersActive: true,
      reminderTime: 'Wed, 16 Jul 2026 09:00:00 GMT',
      timeSet: true,
      datePickerVisible: false, // stray legacy field
    };
    await AsyncStorage.setItem('settings', JSON.stringify(legacy));

    await useSettingsStore.persist.rehydrate();
    await flush();

    const state = useSettingsStore.getState();
    expect(state.remindersActive).toBe(true);
    expect(state.reminderTime).toBe('Wed, 16 Jul 2026 09:00:00 GMT');
    expect(state.timeSet).toBe(true);
  });
});

describe('persisted output stays in the raw legacy shape', () => {
  it('writes only the three known fields, dropping any stray keys', async () => {
    useSettingsStore.getState().setReminderTime('Thu, 17 Jul 2026 08:00:00 GMT');
    await flush();

    expect(setItemMock).toHaveBeenCalled();
    const [key, value] = setItemMock.mock.calls.at(-1)!;
    expect(key).toBe('settings');
    const parsed = JSON.parse(value);
    expect(Object.keys(parsed).sort()).toEqual(['reminderTime', 'remindersActive', 'timeSet']);
    expect(parsed).not.toHaveProperty('datePickerVisible');
    expect(parsed).not.toHaveProperty('state');
    expect(parsed.timeSet).toBe(true);
  });
});
