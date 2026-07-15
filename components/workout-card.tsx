import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { illustrations } from '@/constants/illustrations';
import { routines } from '@/constants/routines';
import { useWorkoutStore } from '@/store/workout';

const CARD_WIDTH = Dimensions.get('window').width - 16;

const levelCovers = [
  illustrations.workoutLevel1,
  illustrations.workoutLevel2,
  illustrations.workoutLevel3,
  illustrations.workoutLevel4,
  illustrations.workoutLevel5,
];

function IntensityButton({
  icon,
  side,
  disabled,
  onPress,
}: {
  icon: 'minus' | 'plus';
  side: 'left' | 'right';
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.intensityTouchable, side === 'left' ? styles.left : styles.right]}
      accessibilityRole="button"
      accessibilityLabel={icon === 'minus' ? 'decrease intensity' : 'increase intensity'}
      disabled={disabled}
      onPress={onPress}>
      <View style={[styles.intensityBase, disabled && styles.intensityDisabled]}>
        <Feather name={icon} color="white" size={18} />
      </View>
    </TouchableOpacity>
  );
}

function RoutineFacet({ amount, name }: { amount: string; name: string }) {
  return (
    <View style={styles.facet}>
      <Text style={styles.facetAmount}>{amount}</Text>
      <Text style={styles.facetName}>{` ${name}`}</Text>
    </View>
  );
}

export function WorkoutCard() {
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const incrementLevel = useWorkoutStore((s) => s.incrementLevel);
  const decrementLevel = useWorkoutStore((s) => s.decrementLevel);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  const { level, started, completed } = currentWorkout;
  const routine = routines[level];

  const startLabel = completed ? 'completed' : started ? 'resume' : 'start';

  const onStart = () => {
    startWorkout();
    router.push('/workout');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.cover} source={levelCovers[level]} resizeMode="cover" />
        <LinearGradient
          style={styles.gradient}
          colors={['rgba(0,0,0,0)', colors.spotiBlack]}
        />
        <Text style={styles.levelLabel}>{`level ${level + 1}`}</Text>
        <IntensityButton
          icon="minus"
          side="left"
          disabled={started || level === 0}
          onPress={decrementLevel}
        />
        <IntensityButton
          icon="plus"
          side="right"
          disabled={started || level === 4}
          onPress={incrementLevel}
        />
      </View>
      <View style={styles.routineContainer}>
        <View>
          <RoutineFacet amount={`${routine.pushUps.sets}x${routine.pushUps.reps}`} name="push-ups" />
          <RoutineFacet amount={`${routine.sitUps.sets}x${routine.sitUps.reps}`} name="sit-ups" />
        </View>
        <View>
          <RoutineFacet amount={`${routine.squats.sets}x${routine.squats.reps}`} name="squats" />
          <RoutineFacet amount={`${routine.run.distance}${routine.run.units}`} name="run" />
        </View>
      </View>
      <View style={styles.startContainer}>
        <TouchableOpacity style={styles.startTouchable} disabled={completed} onPress={onStart}>
          <Text style={styles.startLabel}>{startLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: CARD_WIDTH,
    marginHorizontal: 8,
    marginVertical: 8,
    overflow: 'hidden',
    borderRadius: 12,
  },
  header: {
    alignItems: 'center',
  },
  cover: {
    height: 200,
    width: '100%',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  levelLabel: {
    color: 'white',
    fontSize: 24,
    fontFamily: fonts.medium,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 18,
  },
  intensityTouchable: {
    position: 'absolute',
    bottom: 16,
  },
  left: { left: 16 },
  right: { right: 16 },
  intensityBase: {
    height: 32,
    width: 32,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.twentyWhite,
  },
  intensityDisabled: { opacity: 0.3 },
  routineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  facet: {
    flexDirection: 'row',
  },
  facetAmount: {
    fontFamily: fonts.bold,
    color: colors.spotiBlack,
    fontSize: 14,
  },
  facetName: {
    fontFamily: fonts.regular,
    color: colors.spotiBlack,
    fontSize: 14,
  },
  startContainer: {
    height: 64,
    backgroundColor: colors.start,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  startTouchable: {
    backgroundColor: colors.twentyOnStart,
    borderRadius: 8,
    flex: 1,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  },
});
