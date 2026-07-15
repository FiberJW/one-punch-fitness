import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyProgress } from '@/components/daily-progress';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { triggerHaptic } from '@/lib/haptics';
import { progressFill } from '@/lib/colors';
import { percentComplete, useWorkoutStore, type Workout } from '@/store/workout';

type PeriodMark = { startingDay: boolean; endingDay: boolean; color: string; textColor: string };

// Hoisted so the Calendar receives a stable theme identity and does not
// re-render its ~70 Day components on every unrelated store change.
const CALENDAR_THEME = {
  calendarBackground: colors.panel,
  arrowColor: colors.heroYellow,
  todayTextColor: colors.heroYellow,
  dayTextColor: colors.capeWhite,
  textDisabledColor: colors.faint,
  monthTextColor: colors.capeWhite,
  textMonthFontFamily: fonts.display,
  textDayFontFamily: fonts.regular,
  textDayHeaderFontFamily: fonts.medium,
  textSectionTitleColor: colors.smoke,
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
        marks[workout.date] = {
          startingDay: true,
          endingDay: true,
          color: progressFill(progress),
          // Bright yellow fills read dark; low fills and the gloveRed K.O. day read light.
          textColor: progress > 60 && progress < 100 ? colors.ink : colors.capeWhite,
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
    if ([c, ...h].some((w) => w.date === day.dateString)) {
      triggerHaptic('selection');
      setSelectedDate(day.dateString);
    }
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
    backgroundColor: colors.ink,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  calendar: {
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
    paddingBottom: 8,
  },
});
