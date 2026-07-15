import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ImpactBurst, type ImpactBurstHandle } from '@/components/impact-burst';
import { PressableScale } from '@/components/pressable-scale';
import { Eyebrow } from '@/components/type';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { illustrations } from '@/constants/illustrations';
import { routines } from '@/constants/routines';
import { currentExercise, useWorkoutStore, type Exercise } from '@/store/workout';

type TimerStatus = 'active' | 'paused' | 'stopped';

const exerciseImages: Record<Exercise, number> = {
  pushUps: illustrations.pushups,
  sitUps: illustrations.situps,
  squats: illustrations.squats,
  run: illustrations.run,
};

const exerciseNames: Record<Exercise, string> = {
  pushUps: 'push-ups',
  sitUps: 'sit-ups',
  squats: 'squats',
  run: 'run',
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const DIGIT_SIZE = 96;
const DIGIT_CELL = DIGIT_SIZE * 1.04;

// A single fixed-width digit cell that rolls: on value change the column of
// 0-9 slides so the new digit enters from below/above the old one.
function RollingDigit({ digit }: { digit: number }) {
  const translateY = useSharedValue(-digit * DIGIT_CELL);
  useEffect(() => {
    translateY.value = withTiming(-digit * DIGIT_CELL, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [digit, translateY]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  return (
    <View style={styles.digitCell}>
      <Animated.View style={style}>
        {DIGITS.map((d) => (
          <Text key={d} style={styles.digit}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

type SessionTimerHandle = { getElapsed: () => number; reset: () => void };

// Owns the 1s ticking state so each tick re-renders only the timer rather than
// the whole workout screen. Frozen while paused or stopped.
const SessionTimer = forwardRef<SessionTimerHandle, { status: TimerStatus }>(
  function SessionTimer({ status }, ref) {
    const elapsed = useRef(0);
    const [display, setDisplay] = useState(0);

    useImperativeHandle(
      ref,
      () => ({
        getElapsed: () => elapsed.current,
        reset: () => {
          elapsed.current = 0;
          setDisplay(0);
        },
      }),
      [],
    );

    useEffect(() => {
      if (status !== 'active') return;
      const id = setInterval(() => {
        elapsed.current += 1;
        setDisplay(elapsed.current);
      }, 1000);
      return () => clearInterval(id);
    }, [status]);

    const mm = Math.floor(display / 60);
    const ss = display % 60;
    // String-derived digits so sessions of 100+ minutes grow a third column.
    const minuteDigits = `${mm}`.padStart(2, '0').split('');
    return (
      <View style={styles.timer}>
        {minuteDigits.map((d, i) => (
          <RollingDigit key={`m${minuteDigits.length - i}`} digit={Number(d)} />
        ))}
        <Text style={styles.colon}>:</Text>
        <RollingDigit digit={Math.floor(ss / 10)} />
        <RollingDigit digit={ss % 10} />
      </View>
    );
  },
);

export default function WorkoutScreen() {
  useKeepAwake();

  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const completeSet = useWorkoutStore((s) => s.completeSet);
  const completeWorkout = useWorkoutStore((s) => s.completeWorkout);

  const exercise = currentExercise(currentWorkout);
  const routine = routines[currentWorkout.level];

  const [inSession, setInSession] = useState(false);
  const [status, setStatus] = useState<TimerStatus>('active');
  const timerRef = useRef<SessionTimerHandle>(null);
  const burstRef = useRef<ImpactBurstHandle>(null);

  const onAction = () => {
    if (inSession) {
      burstRef.current?.fire();
      completeSet(exercise, timerRef.current?.getElapsed() ?? 0);
      if (exercise === 'run') {
        completeWorkout();
        Alert.alert('Congrats!', "You've completed today's workout. Rock on!");
        router.back();
      }
      setInSession(false);
      setStatus('active');
    } else {
      setStatus('active');
      setInSession(true);
    }
  };

  const onSessionControl = () => {
    if (status === 'active') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('active');
    } else {
      timerRef.current?.reset();
      setStatus('active');
    }
  };

  const onStop = () => setStatus('stopped');

  const sessionControlLabel =
    status === 'active' ? 'PAUSE' : status === 'paused' ? 'RESUME' : 'START';

  const showProgress = exercise !== 'run';
  const count =
    exercise === 'run'
      ? `${routine.run.distance}${routine.run.units.toUpperCase()}`
      : `${routine[exercise].reps}`;
  const progressText = showProgress
    ? `set ${currentWorkout.setsCompleted[exercise] + 1} of ${routine[exercise].sets}`
    : exerciseNames[exercise];

  return (
    <View style={styles.background}>
      {inSession ? (
        <View style={styles.session}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.sessionTop}>
            <Eyebrow>{progressText}</Eyebrow>
          </Animated.View>
          <View style={styles.sessionCenter}>
            <SessionTimer ref={timerRef} status={status} />
            <View style={styles.controlGroup}>
              <PressableScale
                haptic="selection"
                accessibilityRole="button"
                style={styles.controlPill}
                onPress={onSessionControl}>
                <Text style={styles.controlLabel}>{sessionControlLabel}</Text>
              </PressableScale>
              <PressableScale
                haptic="selection"
                accessibilityRole="button"
                style={[styles.controlPill, styles.stopPill]}
                onPress={onStop}>
                <Text style={[styles.controlLabel, styles.stopLabel]}>STOP</Text>
              </PressableScale>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.transition}>
          <View style={styles.hero}>
            <Animated.Image
              key={`${currentWorkout.level}-${exercise}`}
              entering={FadeIn.duration(300)}
              style={StyleSheet.absoluteFill}
              source={exerciseImages[exercise]}
              resizeMode="cover"
            />
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={['rgba(15,12,12,0)', 'rgba(15,12,12,0.4)', colors.ink]}
            />
          </View>
          <View style={styles.transitionCenter}>
            {showProgress ? (
              <Animated.View entering={FadeInDown.delay(60).duration(400)}>
                <Eyebrow style={styles.centerEyebrow}>{progressText}</Eyebrow>
              </Animated.View>
            ) : null}
            <Animated.Text entering={FadeInDown.delay(120).duration(400)} style={styles.bigCount}>
              {count}
            </Animated.Text>
            <Animated.View entering={FadeInDown.delay(180).duration(400)}>
              <Eyebrow style={styles.centerEyebrow}>{exerciseNames[exercise]}</Eyebrow>
            </Animated.View>
          </View>
        </View>
      )}

      <View style={styles.actionContainer}>
        <PressableScale
          haptic={inSession ? 'success' : 'impact'}
          accessibilityRole="button"
          style={styles.action}
          onPress={onAction}>
          <Text style={styles.actionLabel}>{inSession ? 'COMPLETE' : 'GO'}</Text>
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
  transition: {
    flex: 1,
  },
  hero: {
    height: '45%',
    width: '100%',
  },
  transitionCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centerEyebrow: {
    textAlign: 'center',
  },
  bigCount: {
    fontFamily: fonts.display,
    fontSize: 110,
    lineHeight: 116,
    color: colors.capeWhite,
    textAlign: 'center',
  },
  session: {
    flex: 1,
  },
  sessionTop: {
    alignItems: 'center',
    paddingTop: 32,
  },
  sessionCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DIGIT_CELL,
  },
  digitCell: {
    height: DIGIT_CELL,
    width: DIGIT_SIZE * 0.62,
    overflow: 'hidden',
    alignItems: 'center',
  },
  digit: {
    fontFamily: fonts.display,
    fontSize: DIGIT_SIZE,
    lineHeight: DIGIT_CELL,
    color: colors.heroYellow,
    textAlign: 'center',
  },
  colon: {
    fontFamily: fonts.display,
    fontSize: DIGIT_SIZE,
    lineHeight: DIGIT_CELL,
    color: colors.heroYellow,
    marginHorizontal: 2,
    textAlignVertical: 'center',
  },
  controlGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  controlPill: {
    minWidth: 128,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.faint,
    alignItems: 'center',
  },
  stopPill: {
    borderColor: colors.gloveRed,
  },
  controlLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.capeWhite,
  },
  stopLabel: {
    color: colors.gloveRed,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  action: {
    height: 64,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: colors.heroYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 1,
    color: colors.ink,
  },
});
