import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyProgress } from '@/components/daily-progress';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { progressColor, relativeLuminance } from '@/lib/colors';
import { percentComplete, useWorkoutStore, type Workout } from '@/store/workout';

type PeriodMark = { startingDay: boolean; endingDay: boolean; color: string; textColor: string };

// Hoisted so the Calendar receives a stable theme identity and does not
// re-render its ~70 Day components on every unrelated store change.
const CALENDAR_THEME = {
  calendarBackground: 'white',
  arrowColor: colors.status,
  todayTextColor: colors.status,
  monthTextColor: colors.spotiBlack,
  textMonthFontFamily: fonts.bold,
  textDayFontFamily: fonts.regular,
  textDayHeaderFontFamily: fonts.medium,
} as const;

export default function CalendarScreen() {
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const history = useWorkoutStore((s) => s.history);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const workouts = useMemo(() => [currentWorkout, ...history], [currentWorkout, history]);

  const markedDates = useMemo<Record<string, PeriodMark>>(() => {
    const marks: Record<string, PeriodMark> = {};
    for (const workout of workouts) {
      const progress = percentComplete(workout);
      if (progress > 0) {
        const color = progressColor(progress);
        marks[workout.date] = {
          startingDay: true,
          endingDay: true,
          color,
          textColor: relativeLuminance(color) > 0.179 ? colors.spotiBlack : 'white',
        };
      }
    }
    return marks;
  }, [workouts]);

  // Always show the live current workout when the selected day is today.
  const selectedWorkout: Workout =
    selectedDate && selectedDate !== currentWorkout.date
      ? (workouts.find((w) => w.date === selectedDate) ?? currentWorkout)
      : currentWorkout;

  // Read workouts from the store at press time so the callback keeps a stable
  // identity and never forces the Calendar to re-render its Day components.
  const onDayPress = useCallback((day: DateData) => {
    const { currentWorkout: c, history: h } = useWorkoutStore.getState();
    if ([c, ...h].some((w) => w.date === day.dateString)) setSelectedDate(day.dateString);
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}>
      <Calendar
        style={[styles.calendar, { width: width - 32 }]}
        markedDates={markedDates}
        markingType="period"
        onDayPress={onDayPress}
        theme={CALENDAR_THEME}
      />
      <DailyProgress workout={selectedWorkout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.spotiBlack,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});
