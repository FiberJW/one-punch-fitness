import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

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

function formatTime(seconds: number): string {
  const mm = `${Math.floor(seconds / 60)}`.padStart(2, '0');
  const ss = `${seconds % 60}`.padStart(2, '0');
  return `${mm}:${ss}`;
}

type SessionTimerHandle = { getElapsed: () => number; reset: () => void };

// Owns the 1s ticking state so each tick re-renders only the timer text rather
// than the whole workout screen. Frozen while paused or stopped.
const SessionTimer = forwardRef<SessionTimerHandle, { status: TimerStatus }>(
  function SessionTimer({ status }, ref) {
    const { width } = useWindowDimensions();
    const size = width * 0.6;
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

    return (
      <View style={[styles.timer, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.timerText}>{formatTime(display)}</Text>
      </View>
    );
  },
);

export default function WorkoutScreen() {
  useKeepAwake();

  const { width } = useWindowDimensions();
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const completeSet = useWorkoutStore((s) => s.completeSet);
  const completeWorkout = useWorkoutStore((s) => s.completeWorkout);

  const exercise = currentExercise(currentWorkout);
  const routine = routines[currentWorkout.level];

  const [inSession, setInSession] = useState(false);
  const [status, setStatus] = useState<TimerStatus>('active');
  const timerRef = useRef<SessionTimerHandle>(null);

  const onAction = () => {
    if (inSession) {
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
  const reps =
    exercise === 'run'
      ? `${routine.run.distance}${routine.run.units}`
      : `${routine[exercise].reps}`;
  const progressText =
    exercise === 'run'
      ? ''
      : `set ${currentWorkout.setsCompleted[exercise] + 1} of ${routine[exercise].sets}`;

  const setInfo = (
    <Text style={styles.setType}>
      <Text style={styles.setReps}>{reps}</Text>
      {` ${exerciseNames[exercise]}`}
    </Text>
  );

  return (
    <View style={styles.background}>
      <ScrollView
        contentContainerStyle={styles.content}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {inSession ? (
            <>
              {setInfo}
              <SessionTimer ref={timerRef} status={status} />
              {showProgress ? <Text style={styles.progress}>{progressText}</Text> : null}
              <View style={styles.controlGroup}>
                <TouchableOpacity style={styles.control} activeOpacity={0.75} onPress={onSessionControl}>
                  <View style={styles.controlBase}>
                    <Text style={[styles.controlLabel, { color: colors.blueLeftUsTooSoon }]}>
                      {sessionControlLabel}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.control} activeOpacity={0.75} onPress={onStop}>
                  <View style={styles.controlBase}>
                    <Text style={[styles.controlLabel, { color: colors.bRED }]}>STOP</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Image
                style={[styles.image, { width: width - 32, height: width * 0.7 }]}
                source={exerciseImages[exercise]}
                resizeMode="cover"
              />
              {showProgress ? <Text style={styles.progress}>{progressText}</Text> : null}
              {setInfo}
            </>
          )}
          <TouchableOpacity style={styles.action} activeOpacity={0.75} onPress={onAction}>
            <View style={styles.actionBase}>
              <Text style={styles.actionLabel}>{inSession ? 'COMPLETE' : 'GO'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.spotiBlack,
  },
  content: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  image: {
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  progress: {
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    color: colors.seventyWhite,
    marginTop: 16,
  },
  setType: {
    fontFamily: fonts.regular,
    fontSize: 36,
    textAlign: 'center',
    color: colors.offWhite,
    marginVertical: 8,
  },
  setReps: {
    fontFamily: fonts.bold,
    fontSize: 36,
    textAlign: 'center',
    color: colors.start,
  },
  timer: {
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.status,
  },
  timerText: {
    fontFamily: fonts.regular,
    backgroundColor: 'transparent',
    fontSize: 64,
    color: colors.offWhite,
    textAlign: 'center',
  },
  controlGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  control: {
    width: '50%',
  },
  controlBase: {
    marginHorizontal: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignSelf: 'stretch',
  },
  controlLabel: {
    fontFamily: fonts.bold,
    fontSize: 36,
    textAlign: 'center',
  },
  action: {
    width: '100%',
  },
  actionBase: {
    marginHorizontal: 16,
    backgroundColor: colors.start,
    borderRadius: 12,
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  actionLabel: {
    fontFamily: fonts.bold,
    fontSize: 36,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});
