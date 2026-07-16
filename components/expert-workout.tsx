import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DisplayText } from '@/components/display-text';
import { ImpactBurst, type ImpactBurstHandle } from '@/components/impact-burst';
import { PressableScale } from '@/components/pressable-scale';
import { Eyebrow } from '@/components/type';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import {
  expertGuidance,
  isOptionalToday,
  targetSets,
  visibleSections,
  type ExpertExercise,
  type ExpertSectionName,
} from '@/constants/expert-plan';
import { expertIllustrations } from '@/constants/illustrations';
import { triggerHaptic } from '@/lib/haptics';
import { useExpertStore } from '@/store/expert';

const REST_SECONDS = 90;

// source + crop framing: aspectRatio sizes the absolute image from the banner
// width, and bottomOffset slides the visible 100pt window up the frame so the
// subject (drawn low in each still) stays in view — RN has no objectPosition.
const sectionBanners: Record<ExpertSectionName, { source: number; aspectRatio: number; bottomOffset: number }> = {
  'UPPER BODY': { source: expertIllustrations.upperBody, aspectRatio: 1440 / 1080, bottomOffset: 0 },
  'LOWER BODY': { source: expertIllustrations.lowerBody, aspectRatio: 680 / 632, bottomOffset: 76 },
  CORE: { source: expertIllustrations.core, aspectRatio: 1440 / 1080, bottomOffset: 0 },
};

function BarDayPill({ barDay, onToggle }: { barDay: boolean; onToggle: () => void }) {
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="switch"
      accessibilityState={{ checked: barDay }}
      accessibilityLabel="bar day"
      style={[styles.barPill, barDay ? styles.barPillOn : styles.barPillOff]}
      onPress={onToggle}>
      <Text style={[styles.barPillLabel, barDay && styles.barPillLabelOn]}>BAR DAY</Text>
    </PressableScale>
  );
}

function SectionBanner({ name }: { name: ExpertSectionName }) {
  const { source, aspectRatio, bottomOffset } = sectionBanners[name];
  const { width } = useWindowDimensions();
  const imageWidth = width - 40; // banner spans the screen minus its margins
  const imageHeight = imageWidth / aspectRatio;
  return (
    <View style={styles.banner}>
      <Image
        style={[styles.bannerImage, { width: imageWidth, height: imageHeight, bottom: -bottomOffset }]}
        source={source}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bannerTint]} />
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={['rgba(15,12,12,0.1)', 'rgba(15,12,12,0.85)']}
      />
      <Eyebrow style={styles.bannerTitle}>{name}</Eyebrow>
    </View>
  );
}

function ExerciseRow({
  exercise,
  done,
  optional,
  onLog,
  onUndo,
}: {
  exercise: ExpertExercise;
  done: number;
  optional: boolean;
  onLog: () => void;
  onUndo: () => void;
}) {
  const target = targetSets(exercise);
  const isDone = done >= target;
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={exercise.name}
      style={[styles.row, isDone && styles.rowDone]}
      onPress={onLog}
      onLongPress={() => {
        triggerHaptic('selection');
        onUndo();
      }}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowName}>{exercise.name}</Text>
        <Text style={styles.rowMuscles}>{exercise.muscles}</Text>
        {exercise.note ? <Text style={styles.rowNote}>{exercise.note}</Text> : null}
        {optional ? <Eyebrow style={styles.optionalTag}>optional today</Eyebrow> : null}
      </View>
      <View style={styles.rowRight}>
        <DisplayText size={20} style={isDone ? styles.countDone : undefined}>
          {`${done}/${target}`}
        </DisplayText>
        <Eyebrow style={styles.rowReps}>{`× ${exercise.reps}`}</Eyebrow>
      </View>
    </PressableScale>
  );
}

// Presentational only — the countdown lives in the parent so its ticks never
// reset local state or call back up through an effect.
function RestChip({ remaining, onDismiss }: { remaining: number; onDismiss: () => void }) {
  const label = `REST ${Math.floor(remaining / 60)}:${`${remaining % 60}`.padStart(2, '0')}`;
  return (
    <View style={styles.restWrap} pointerEvents="box-none">
      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel="dismiss rest timer"
        style={styles.restChip}
        onPress={onDismiss}>
        <Text style={styles.restLabel}>{label}</Text>
      </PressableScale>
    </View>
  );
}

export function ExpertWorkout() {
  useKeepAwake();
  const insets = useSafeAreaInsets();

  const currentSession = useExpertStore((s) => s.currentSession);
  const logSet = useExpertStore((s) => s.logSet);
  const undoSet = useExpertStore((s) => s.undoSet);
  const setBarDay = useExpertStore((s) => s.setBarDay);
  const completeSession = useExpertStore((s) => s.completeSession);

  const { barDay, setsDone } = currentSession;
  const burstRef = useRef<ImpactBurstHandle>(null);

  // 0 hides the chip; any positive value is the seconds left. Each logged set
  // resets it to a full rest; it ticks down here so a tick never has to reach
  // back into the chip's own state.
  const [restRemaining, setRestRemaining] = useState(0);
  const dismissRest = useCallback(() => setRestRemaining(0), []);

  useEffect(() => {
    if (restRemaining <= 0) return;
    const id = setTimeout(() => {
      setRestRemaining((r) => {
        if (r <= 1) {
          triggerHaptic('success'); // rest complete
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [restRemaining]);

  const onLog = (id: string) => {
    logSet(id);
    setRestRemaining(REST_SECONDS);
  };

  const onFinish = () => {
    burstRef.current?.fire();
    triggerHaptic('success');
    completeSession();
    Alert.alert('Nice work', 'session logged. rock on!');
    router.back();
  };

  const sections = visibleSections(barDay);

  return (
    <View style={[styles.background, { paddingTop: insets.top + 52 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Eyebrow>expert session</Eyebrow>
          <Text style={styles.guidance}>{expertGuidance.frequency}</Text>
          <Text style={styles.guidance}>{expertGuidance.effort}</Text>
          <View style={styles.headerBarRow}>
            <BarDayPill barDay={barDay} onToggle={() => setBarDay(!barDay)} />
          </View>
        </Animated.View>

        {/* Fixed 14-row program — a plain ScrollView is intentional (per the
            plan); it never grows, so FlatList/SectionList windowing is not needed. */}
        {/* eslint-disable-next-line react-doctor/rn-no-scrollview-mapped-list */}
        {sections.map((section) => (
          <View key={section.name} style={styles.section}>
            <SectionBanner name={section.name} />
            {section.exercises.map((ex) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                done={setsDone[ex.id] ?? 0}
                optional={isOptionalToday(ex, barDay)}
                onLog={() => onLog(ex.id)}
                onUndo={() => undoSet(ex.id)}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {restRemaining > 0 ? <RestChip remaining={restRemaining} onDismiss={dismissRest} /> : null}

      <View style={[styles.finishBar, { paddingBottom: insets.bottom + 8 }]}>
        <PressableScale
          haptic="success"
          accessibilityRole="button"
          accessibilityLabel="finish session"
          style={styles.finish}
          onPress={onFinish}>
          <Text style={styles.finishLabel}>FINISH</Text>
        </PressableScale>
      </View>

      <ImpactBurst ref={burstRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 4,
  },
  guidance: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.smoke,
  },
  headerBarRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  barPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  barPillOn: {
    backgroundColor: colors.heroYellow,
    borderColor: colors.heroYellow,
  },
  barPillOff: {
    backgroundColor: 'transparent',
    borderColor: colors.panelHigh,
  },
  barPillLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.smoke,
  },
  barPillLabelOn: {
    color: colors.ink,
  },
  section: {
    marginTop: 20,
  },
  bannerImage: {
    position: 'absolute',
    left: 0,
  },
  banner: {
    height: 150,
    marginHorizontal: 20,
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  bannerTint: {
    backgroundColor: 'rgba(15, 12, 12, 0.08)',
  },
  bannerTitle: {
    color: colors.capeWhite,
    fontSize: 13,
    padding: 14,
  },
  row: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: colors.panel,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowDone: {
    borderLeftColor: colors.heroYellow,
  },
  rowLeft: {
    flex: 1,
    paddingRight: 12,
  },
  rowName: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.capeWhite,
  },
  rowMuscles: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.smoke,
    marginTop: 3,
  },
  rowNote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.smoke,
    marginTop: 4,
  },
  optionalTag: {
    color: colors.heroYellow,
    fontSize: 10,
    marginTop: 6,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  countDone: {
    color: colors.heroYellow,
  },
  rowReps: {
    fontSize: 10,
    marginTop: 4,
  },
  restWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 96,
    alignItems: 'center',
  },
  restChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colors.panelHigh,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.faint,
  },
  restLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.capeWhite,
  },
  finishBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: colors.ink,
  },
  finish: {
    height: 64,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: colors.heroYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishLabel: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 1,
    color: colors.ink,
  },
});
