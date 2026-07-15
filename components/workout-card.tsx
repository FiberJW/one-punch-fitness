import { Feather } from '@expo/vector-icons';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/components/pressable-scale';
import { Eyebrow } from '@/components/type';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { illustrations } from '@/constants/illustrations';
import { routines } from '@/constants/routines';
import { useWorkoutStore } from '@/store/workout';

const levelCovers = [
  illustrations.workoutLevel1,
  illustrations.workoutLevel2,
  illustrations.workoutLevel3,
  illustrations.workoutLevel4,
  illustrations.workoutLevel5,
];

function IntensityButton({
  icon,
  disabled,
  onPress,
}: {
  icon: 'minus' | 'plus';
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={icon === 'minus' ? 'decrease intensity' : 'increase intensity'}
      disabled={disabled}
      onPress={onPress}>
      {isLiquidGlassAvailable() ? (
        <GlassView
          isInteractive={!disabled}
          style={[styles.intensityGlass, disabled && styles.intensityDisabled]}>
          <Feather name={icon} color={colors.capeWhite} size={18} />
        </GlassView>
      ) : (
        <View style={[styles.intensityBase, disabled && styles.intensityDisabled]}>
          <Feather name={icon} color={colors.capeWhite} size={18} />
        </View>
      )}
    </PressableScale>
  );
}

function RoutineFacet({
  count,
  name,
  style,
  delay,
}: {
  count: string;
  name: string;
  style?: object;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[styles.facet, style]}>
      <Text style={styles.facetCount}>{count}</Text>
      <Eyebrow>{name}</Eyebrow>
    </Animated.View>
  );
}

export function WorkoutCard() {
  const { width, height } = useWindowDimensions();
  const heroHeight = Math.round(height * 0.52);
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const incrementLevel = useWorkoutStore((s) => s.incrementLevel);
  const decrementLevel = useWorkoutStore((s) => s.decrementLevel);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  const { level, started, completed } = currentWorkout;
  const routine = routines[level];

  const ctaLabel = completed ? 'DONE TODAY' : started ? 'RESUME' : 'GO';
  const a11yLabel = completed ? 'workout complete' : started ? 'resume workout' : 'start workout';

  const onStart = () => {
    startWorkout();
    router.push('/workout');
  };

  return (
    <View style={{ width }}>
      <View style={[styles.hero, { height: heroHeight }]}>
        <Animated.View entering={FadeIn.duration(500)} style={StyleSheet.absoluteFill}>
          <Image style={styles.cover} source={levelCovers[level]} resizeMode="cover" />
          <LinearGradient style={styles.gradient} colors={['rgba(15,12,12,0)', colors.ink]} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.levelBlock}>
          <Eyebrow>level</Eyebrow>
          <Text style={styles.levelNumeral}>{level + 1}</Text>
        </Animated.View>
        <View style={styles.intensityGroup}>
          <IntensityButton icon="minus" disabled={started || level === 0} onPress={decrementLevel} />
          <IntensityButton icon="plus" disabled={started || level === 4} onPress={incrementLevel} />
        </View>
      </View>

      <View style={styles.facetGrid}>
        <View style={[styles.facetRow, styles.facetRowTop]}>
          <RoutineFacet
            delay={160}
            style={styles.facetLeft}
            count={`${routine.pushUps.sets}×${routine.pushUps.reps}`}
            name="push-ups"
          />
          <RoutineFacet
            delay={220}
            count={`${routine.sitUps.sets}×${routine.sitUps.reps}`}
            name="sit-ups"
          />
        </View>
        <View style={styles.facetRow}>
          <RoutineFacet
            delay={280}
            style={styles.facetLeft}
            count={`${routine.squats.sets}×${routine.squats.reps}`}
            name="squats"
          />
          <RoutineFacet
            delay={340}
            count={`${routine.run.distance}${routine.run.units.toUpperCase()}`}
            name="run"
          />
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <PressableScale
          haptic="impact"
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          disabled={completed}
          style={[styles.cta, completed && styles.ctaDisabled]}
          onPress={onStart}>
          <Text style={[styles.ctaLabel, completed && styles.ctaLabelDisabled]}>{ctaLabel}</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  levelBlock: {
    position: 'absolute',
    left: 20,
    bottom: 16,
  },
  levelNumeral: {
    fontFamily: fonts.display,
    fontSize: 110,
    lineHeight: 112,
    color: colors.capeWhite,
  },
  intensityGroup: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  intensityBase: {
    height: 40,
    width: 40,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.panelHigh,
  },
  intensityGlass: {
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityDisabled: { opacity: 0.3 },
  facetGrid: {
    marginTop: 8,
  },
  facetRow: {
    flexDirection: 'row',
  },
  facetRowTop: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.faint,
  },
  facet: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  facetLeft: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.faint,
  },
  facetCount: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.capeWhite,
    marginBottom: 4,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  cta: {
    height: 60,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: colors.heroYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: {
    backgroundColor: colors.panel,
  },
  ctaLabel: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: 1,
    color: colors.ink,
  },
  ctaLabelDisabled: {
    color: colors.smoke,
  },
});
