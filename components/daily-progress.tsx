import { memo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { routines } from '@/constants/routines';
import { formatLongDate, localDate } from '@/lib/dates';
import { percentComplete, type Workout } from '@/store/workout';

function StatRow({ label, fraction, amount }: { label: string; fraction: number; amount: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statTitle}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.bar, { width: `${Math.min(1, fraction) * 100}%` }]} />
      </View>
      <Text style={styles.statAmount}>{amount}</Text>
    </View>
  );
}

export const DailyProgress = memo(function DailyProgress({ workout }: { workout: Workout }) {
  const { width } = useWindowDimensions();
  const routine = routines[workout.level];
  const { setsCompleted } = workout;
  const title = workout.date === localDate() ? 'Today' : formatLongDate(workout.date);

  return (
    <View style={[styles.container, { width: width - 32, minHeight: width * 0.6 }]}>
      <Text style={styles.title}>{`${title}'s workout`}</Text>
      <Text style={styles.status}>{`${Math.floor(percentComplete(workout))}% complete`}</Text>
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
          label="running"
          fraction={setsCompleted.run ? 1 : 0}
          amount={setsCompleted.run ? '10km' : '0 km'}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.status,
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    color: colors.seventyWhite,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  status: {
    color: 'white',
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 24,
    marginTop: 8,
  },
  stats: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  statTitle: {
    width: 80,
    color: 'white',
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  barTrack: {
    flex: 1,
    height: 4,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.halfWhite,
    overflow: 'hidden',
  },
  bar: {
    height: 4,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  statAmount: {
    width: 48,
    color: 'white',
    textAlign: 'right',
    fontFamily: fonts.medium,
    fontSize: 14,
  },
});
