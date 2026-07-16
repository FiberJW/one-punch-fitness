import { memo, useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { DisplayText } from '@/components/display-text';
import { Eyebrow } from '@/components/type';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { routines } from '@/constants/routines';
import { formatLongDate, localDate } from '@/lib/dates';
import { percentComplete, type Workout } from '@/store/workout';

function StatRow({ label, fraction, amount }: { label: string; fraction: number; amount: string }) {
  // Start at 0 so the fill springs in on mount, then tracks changes.
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withSpring(Math.min(1, fraction), { damping: 18, stiffness: 140 });
  }, [fraction, width]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value * 100}%` }));

  return (
    <View style={styles.statRow}>
      <Eyebrow style={styles.statLabel}>{label}</Eyebrow>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
      <Text style={styles.statAmount}>{amount}</Text>
    </View>
  );
}

export const DailyProgress = memo(function DailyProgress({ workout }: { workout: Workout }) {
  const { width } = useWindowDimensions();
  const routine = routines[workout.level];
  const { setsCompleted } = workout;
  const dateLabel = workout.date === localDate() ? 'today' : formatLongDate(workout.date);

  return (
    <View style={[styles.container, { width: width - 32 }]}>
      <Eyebrow>{dateLabel}</Eyebrow>
      <View style={styles.percentBlock}>
        <DisplayText size={72}>{`${Math.floor(percentComplete(workout))}%`}</DisplayText>
      </View>
      <View style={styles.stats}>
        <StatRow
          label="push-ups"
          fraction={setsCompleted.pushUps / routine.pushUps.sets}
          amount={`${setsCompleted.pushUps * routine.pushUps.reps}`}
        />
        <StatRow
          label="sit-ups"
          fraction={setsCompleted.sitUps / routine.sitUps.sets}
          amount={`${setsCompleted.sitUps * routine.sitUps.reps}`}
        />
        <StatRow
          label="squats"
          fraction={setsCompleted.squats / routine.squats.sets}
          amount={`${setsCompleted.squats * routine.squats.reps}`}
        />
        <StatRow
          label="run"
          fraction={setsCompleted.run ? 1 : 0}
          amount={setsCompleted.run ? '10KM' : '0KM'}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.panel,
    marginTop: 16,
    padding: 24,
    borderRadius: 16,
    borderCurve: 'continuous',
  },
  percentBlock: {
    marginTop: 8,
  },
  stats: {
    marginTop: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  statLabel: {
    width: 84,
  },
  barTrack: {
    flex: 1,
    height: 4,
    marginHorizontal: 16,
    borderRadius: 2,
    backgroundColor: colors.faint,
    overflow: 'hidden',
  },
  bar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.heroYellow,
  },
  statAmount: {
    width: 56,
    color: colors.capeWhite,
    textAlign: 'right',
    fontFamily: fonts.display,
    fontSize: 18,
  },
});
