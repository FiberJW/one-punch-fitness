import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { illustrations } from '@/constants/illustrations';
import { routines } from '@/constants/routines';
import { currentExercise, useWorkoutStore, type Exercise } from '@/store/workout';

const WIDTH = Dimensions.get('window').width;
const TIMER_SIZE = WIDTH * 0.6;

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

export default function WorkoutScreen() {
  useKeepAwake();

  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const completeSet = useWorkoutStore((s) => s.completeSet);
  const completeWorkout = useWorkoutStore((s) => s.completeWorkout);

  const exercise = currentExercise(currentWorkout);
  const routine = routines[currentWorkout.level];

  const [inSession, setInSession] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('active');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = useRef<TimerStatus>(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = () => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      if (statusRef.current !== 'paused') setTimeUsed((t) => t + 1);
    }, 1000);
  };

  // Clear the interval when leaving the screen.
  useEffect(() => stopInterval, []);

  const onAction = () => {
    if (inSession) {
      stopInterval();
      completeSet(exercise, timeUsed);
      if (exercise === 'run') {
        completeWorkout();
        Alert.alert('Congrats!', "You've completed today's workout. Rock on!");
        router.back();
      }
      setInSession(false);
      setStatus('active');
      setTimeUsed(0);
    } else {
      setTimeUsed(0);
      setStatus('active');
      startInterval();
      setInSession(true);
    }
  };

  const onSessionControl = () => {
    if (status === 'active') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('active');
    } else {
      setTimeUsed(0);
      setStatus('active');
      startInterval();
    }
  };

  const onStop = () => {
    stopInterval();
    setStatus('stopped');
  };

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
              <View style={styles.timer}>
                <Text style={styles.timerText}>{formatTime(timeUsed)}</Text>
              </View>
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
              <Image style={styles.image} source={exerciseImages[exercise]} resizeMode="cover" />
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
    width: WIDTH - 32,
    height: WIDTH * 0.7,
    borderRadius: 12,
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
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
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
