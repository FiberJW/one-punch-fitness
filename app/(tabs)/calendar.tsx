import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyProgress } from '@/components/daily-progress';
import { ExpertDailyProgress } from '@/components/expert-daily-progress';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { sessionPercent } from '@/constants/expert-plan';
import { triggerHaptic } from '@/lib/haptics';
import { progressFill } from '@/lib/colors';
import { useExpertStore, type ExpertSession } from '@/store/expert';
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
  const currentSession = useExpertStore((s) => s.currentSession);
  const expertHistory = useExpertStore((s) => s.history);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const workouts = useMemo(() => [currentWorkout, ...history], [currentWorkout, history]);
  const sessions = useMemo(
    () => [currentSession, ...expertHistory],
    [currentSession, expertHistory],
  );

  // Merge Saitama and expert progress per date; when both fall on a day the
  // higher percentage wins the fill.
  const markedDates = useMemo<Record<string, PeriodMark>>(() => {
    const byDate: Record<string, number> = {};
    for (const workout of workouts) {
      const progress = percentComplete(workout);
      if (progress > 0) byDate[workout.date] = Math.max(byDate[workout.date] ?? 0, progress);
    }
    for (const session of sessions) {
      const progress = sessionPercent(session);
      if (progress > 0) byDate[session.date] = Math.max(byDate[session.date] ?? 0, progress);
    }
    const marks: Record<string, PeriodMark> = {};
    for (const [date, progress] of Object.entries(byDate)) {
      marks[date] = {
        startingDay: true,
        endingDay: true,
        color: progressFill(progress),
        // Bright yellow fills read dark; low fills and the gloveRed K.O. day read light.
        textColor: progress > 60 && progress < 100 ? colors.ink : colors.capeWhite,
      };
    }
    return marks;
  }, [workouts, sessions]);

  // Always show the live current entries when the selected day is today.
  const activeDate = selectedDate ?? currentWorkout.date;
  const saitamaForDate: Workout | undefined =
    activeDate === currentWorkout.date
      ? currentWorkout
      : workouts.find((w) => w.date === activeDate);
  const selectedWorkout: Workout = saitamaForDate ?? currentWorkout;
  const selectedSession: ExpertSession | undefined =
    activeDate === currentSession.date
      ? currentSession
      : sessions.find((s) => s.date === activeDate);

  // Prefer the expert card when that day has a logged expert session whose
  // progress meets or beats the Saitama workout's. A day with no Saitama
  // workout has no competing progress — don't compare against today's.
  const expertTouched =
    selectedSession !== undefined &&
    Object.values(selectedSession.setsDone).some((n) => n > 0);
  const saitamaPercent = saitamaForDate ? percentComplete(saitamaForDate) : -1;
  const showExpert = expertTouched && sessionPercent(selectedSession!) >= saitamaPercent;

  // Read both stores at press time so the callback keeps a stable identity and
  // never forces the Calendar to re-render its Day components.
  const onDayPress = useCallback((day: DateData) => {
    const { currentWorkout: c, history: h } = useWorkoutStore.getState();
    const { currentSession: cs, history: eh } = useExpertStore.getState();
    const hasEntry =
      [c, ...h].some((w) => w.date === day.dateString) ||
      [cs, ...eh].some((s) => s.date === day.dateString);
    if (hasEntry) {
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
      {showExpert && selectedSession ? (
        <ExpertDailyProgress session={selectedSession} />
      ) : (
        <DailyProgress workout={selectedWorkout} />
      )}
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
