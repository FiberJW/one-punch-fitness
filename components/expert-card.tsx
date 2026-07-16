import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { DisplayText } from '@/components/display-text';
import { PressableScale } from '@/components/pressable-scale';
import { Eyebrow } from '@/components/type';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { sessionPercent } from '@/constants/expert-plan';
import { expertIllustrations } from '@/constants/illustrations';
import { sessionsThisWeek, useExpertStore } from '@/store/expert';

function ProgressHairline({ percent }: { percent: number }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withSpring(Math.min(1, percent / 100), { damping: 18, stiffness: 140 });
  }, [percent, width]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value * 100}%` }));
  return (
    <View style={styles.hairlineTrack}>
      <Animated.View style={[styles.hairlineFill, barStyle]} />
    </View>
  );
}

export function ExpertCard() {
  const currentSession = useExpertStore((s) => s.currentSession);
  const history = useExpertStore((s) => s.history);
  const setBarDay = useExpertStore((s) => s.setBarDay);

  const weekCount = sessionsThisWeek({ currentSession, history });
  const { barDay, completed, setsDone } = currentSession;
  const inProgress = Object.values(setsDone).some((n) => n > 0);
  const percent = sessionPercent(currentSession);

  const ctaLabel = completed ? 'DONE TODAY' : inProgress ? 'RESUME' : 'TRAIN';
  const a11yLabel = completed
    ? 'session complete'
    : inProgress
      ? 'resume session'
      : 'start session';

  return (
    <View style={styles.card}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.cover}>
        <Image style={StyleSheet.absoluteFill} source={expertIllustrations.cover} resizeMode="cover" />
        {/* The manga panel has a white background; darken it so it sits on the dark UI. */}
        <View style={[StyleSheet.absoluteFill, styles.coverTint]} />
        <LinearGradient style={StyleSheet.absoluteFill} colors={['rgba(15,12,12,0)', colors.panel]} />
      </Animated.View>

      <View style={styles.body}>
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.weekBlock}>
          <Eyebrow>this week</Eyebrow>
          <View style={styles.weekRow}>
            <DisplayText size={64}>{weekCount}</DisplayText>
            <Text style={styles.weekCaption}>/ 2–3 sessions</Text>
          </View>
        </Animated.View>

        <View style={styles.barDayRow}>
          <PressableScale
            haptic="selection"
            accessibilityRole="switch"
            accessibilityState={{ checked: barDay }}
            accessibilityLabel="bar day"
            style={[styles.barPill, barDay ? styles.barPillOn : styles.barPillOff]}
            onPress={() => setBarDay(!barDay)}>
            <Text style={[styles.barPillLabel, barDay && styles.barPillLabelOn]}>BAR DAY</Text>
          </PressableScale>
        </View>

        <PressableScale
          haptic="impact"
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          disabled={completed}
          style={[styles.cta, completed && styles.ctaDisabled]}
          onPress={() => router.push('/workout')}>
          <Text style={[styles.ctaLabel, completed && styles.ctaLabelDisabled]}>{ctaLabel}</Text>
        </PressableScale>

        {inProgress && !completed ? <ProgressHairline percent={percent} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: colors.panel,
    overflow: 'hidden',
  },
  cover: {
    height: 180,
    width: '100%',
  },
  coverTint: {
    backgroundColor: 'rgba(15, 12, 12, 0.15)',
  },
  body: {
    padding: 20,
  },
  weekBlock: {
    marginTop: -4,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  weekCaption: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.smoke,
    marginBottom: 6,
  },
  barDayRow: {
    flexDirection: 'row',
    marginTop: 16,
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
  cta: {
    height: 60,
    marginTop: 20,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: colors.heroYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: {
    backgroundColor: colors.panelHigh,
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
  hairlineTrack: {
    height: 4,
    marginTop: 16,
    borderRadius: 2,
    backgroundColor: colors.faint,
    overflow: 'hidden',
  },
  hairlineFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.heroYellow,
  },
});
