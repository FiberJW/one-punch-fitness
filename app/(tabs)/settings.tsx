import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { formatTime } from '@/lib/dates';
import { useSettingsStore } from '@/store/settings';
import { useWorkoutStore } from '@/store/workout';

const CONTENT_WIDTH = Dimensions.get('window').width - 32;

async function scheduleDailyReminder(date: Date) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'One Punch Fitness', body: 'move forward.' },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: date.getHours(),
      minute: date.getMinutes(),
    },
  });
}

function Switch({ value }: { value: boolean }) {
  return (
    <View style={styles.switchTrack}>
      <View style={[styles.switchKnob, value ? styles.knobOn : styles.knobOff]} />
    </View>
  );
}

function Option({
  tint,
  label,
  onPress,
  children,
}: {
  tint: string;
  label: string;
  onPress: () => void;
  children?: React.ReactNode;
}) {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
      <View style={[styles.option, { backgroundColor: tint }]}>
        <Text style={styles.optionLabel}>{label}</Text>
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { remindersActive, reminderTime, timeSet, setRemindersActive, setReminderTime, reset } =
    useSettingsStore();
  const resetWorkout = useWorkoutStore((s) => s.reset);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempTime, setTempTime] = useState(() => new Date(reminderTime));

  const onToggleReminders = async () => {
    if (remindersActive) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setRemindersActive(false);
      return;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const { granted } = await Notifications.requestPermissionsAsync();
    if (granted) {
      if (timeSet) await scheduleDailyReminder(new Date(reminderTime));
      setRemindersActive(true);
    } else {
      Alert.alert(
        'Hey! If you want to remember to change yourself everyday, enable notifications!',
      );
    }
  };

  const confirmTime = async (date: Date) => {
    await scheduleDailyReminder(date);
    setReminderTime(date.toUTCString());
  };

  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setPickerVisible(false);
      if (event.type === 'set' && date) void confirmTime(date);
    } else if (date) {
      setTempTime(date);
    }
  };

  const onClearData = () => {
    Alert.alert(
      'Are you sure?',
      'Removing your data destroys any progress you were storing in this app.',
      [
        { text: 'cancel', style: 'cancel' },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();
            await AsyncStorage.clear();
            resetWorkout();
            reset();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
        alwaysBounceVertical={false}>
        <Option
          tint={remindersActive ? colors.start : colors.disabled}
          label="reminders"
          onPress={() => void onToggleReminders()}>
          <Switch value={remindersActive} />
        </Option>

        {remindersActive && (
          <Option
            tint={timeSet ? colors.status : colors.disabled}
            label="reminder time"
            onPress={() => {
              setTempTime(new Date(reminderTime));
              setPickerVisible(true);
            }}>
            <Text style={styles.optionText}>{formatTime(new Date(reminderTime))}</Text>
          </Option>
        )}

        <Option tint={colors.bRED} label="clear workout data" onPress={onClearData} />
      </ScrollView>

      {pickerVisible && Platform.OS === 'android' && (
        <DateTimePicker value={tempTime} mode="time" display="default" onChange={onPickerChange} />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={pickerVisible} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>pick a time for your workout reminder</Text>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                themeVariant="dark"
                onChange={onPickerChange}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setPickerVisible(false)}>
                  <Text style={styles.modalCancel}>cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPickerVisible(false);
                    void confirmTime(tempTime);
                  }}>
                  <Text style={styles.modalDone}>done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spotiBlack,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 16,
  },
  option: {
    width: CONTENT_WIDTH,
    padding: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontFamily: fonts.medium,
    fontSize: 24,
    color: 'white',
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 24,
    color: 'white',
  },
  switchTrack: {
    backgroundColor: colors.fortyBlack,
    borderRadius: 12,
    height: 24,
    width: 64,
  },
  switchKnob: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  knobOn: { alignSelf: 'flex-end' },
  knobOff: { alignSelf: 'flex-start' },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.halfBlack,
  },
  modalSheet: {
    backgroundColor: colors.elevated,
    paddingBottom: 32,
    paddingTop: 24,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderCurve: 'continuous',
    gap: 16,
  },
  modalTitle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    textAlign: 'center',
    color: colors.offWhite,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  modalCancel: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.disabled,
  },
  modalDone: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.status,
  },
});
