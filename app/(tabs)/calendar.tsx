import { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import { DailyProgress } from '@/components/daily-progress';
import { colors } from '@/constants/colors';
import { progressColor, relativeLuminance } from '@/lib/colors';
import { percentComplete, useWorkoutStore, type Workout } from '@/store/workout';

const CONTENT_WIDTH = Dimensions.get('window').width - 32;

type PeriodMark = { startingDay: boolean; endingDay: boolean; color: string; textColor: string };

export default function CalendarScreen() {
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const history = useWorkoutStore((s) => s.history);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
          textColor: relativeLuminance(color) > 0.5 ? colors.spotiBlack : 'white',
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

  const onDayPress = (day: DateData) => {
    if (workouts.some((w) => w.date === day.dateString)) setSelectedDate(day.dateString);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}>
      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        markingType="period"
        onDayPress={onDayPress}
        theme={{
          calendarBackground: 'white',
          arrowColor: colors.status,
          todayTextColor: colors.status,
          monthTextColor: colors.spotiBlack,
          textMonthFontFamily: 'InterUI-Bold',
          textDayFontFamily: 'InterUI-Regular',
          textDayHeaderFontFamily: 'InterUI-Medium',
        }}
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  calendar: {
    width: CONTENT_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
