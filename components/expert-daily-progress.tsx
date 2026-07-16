import { memo, useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { DisplayText } from '@/components/display-text';
import { Eyebrow } from '@/components/type';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import {
  isOptionalToday,
  sessionPercent,
  targetSets,
  visibleSections,
} from '@/constants/expert-plan';
import { formatLongDate, localDate } from '@/lib/dates';
import { type ExpertSession } from '@/store/expert';

function SectionBar({ label, fraction, sets }: { label: string; fraction: number; sets: number }) {
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
      <Text style={styles.statAmount}>{sets}</Text>
    </View>
  );
}

export const ExpertDailyProgress = memo(function ExpertDailyProgress({
  session,
}: {
  session: ExpertSession;
}) {
  const { width } = useWindowDimensions();
  const dateLabel = session.date === localDate() ? 'today' : formatLongDate(session.date);
  const sections = visibleSections(session.barDay);

  return (
    <View style={[styles.container, { width: width - 32 }]}>
      <Eyebrow>{dateLabel}</Eyebrow>
      <View style={styles.percentBlock}>
        <DisplayText size={72}>{`${Math.floor(sessionPercent(session))}%`}</DisplayText>
      </View>
      <View style={styles.stats}>
        {sections.map((s) => {
          const counted = s.exercises.filter((ex) => !isOptionalToday(ex, session.barDay));
          const target = counted.reduce((sum, ex) => sum + targetSets(ex), 0);
          const cappedDone = counted.reduce(
            (sum, ex) => sum + Math.min(session.setsDone[ex.id] ?? 0, targetSets(ex)),
            0,
          );
          const done = s.exercises.reduce((sum, ex) => sum + (session.setsDone[ex.id] ?? 0), 0);
          return (
            <SectionBar
              key={s.name}
              label={s.name}
              fraction={target > 0 ? cappedDone / target : 0}
              sets={done}
            />
          );
        })}
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
    width: 108,
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
    width: 40,
    color: colors.capeWhite,
    textAlign: 'right',
    fontFamily: fonts.display,
    fontSize: 18,
  },
});
