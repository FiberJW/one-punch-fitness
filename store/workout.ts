import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

import { routines } from '@/constants/routines';
import { localDate } from '@/lib/dates';

// Exercises. The three rep-based ones are grouped as `RepExercise`; `run` is
// tracked separately (a single boolean + time rather than a counter + array).
export type RepExercise = 'pushUps' | 'sitUps' | 'squats';
export type Exercise = RepExercise | 'run';

export interface SetsCompleted {
  pushUps: number;
  sitUps: number;
  squats: number;
  run: boolean;
}

export interface TimeUsedPerSet {
  pushUps: number[];
  sitUps: number[];
  squats: number[];
  run: number;
}

export interface Workout {
  level: number;
  date: string;
  started: boolean;
  completed: boolean;
  setsCompleted: SetsCompleted;
  timeUsedPerSet: TimeUsedPerSet;
}

// The persisted slice, stored raw under "@state" — exactly the legacy JSON
// shape `{ currentWorkout, history }` (no zustand `{ state, version }` envelope).
export interface Persisted {
  currentWorkout: Workout;
  history: Workout[];
}

interface WorkoutStore extends Persisted {
  incrementLevel: () => void;
  decrementLevel: () => void;
  startWorkout: () => void;
  completeWorkout: () => void;
  completeSet: (exercise: Exercise, seconds: number) => void;
  rolloverIfNeeded: () => void;
  reset: () => void;
}

function genNewWorkout(level: number): Workout {
  return {
    level,
    date: localDate(),
    started: false,
    completed: false,
    setsCompleted: { pushUps: 0, sitUps: 0, squats: 0, run: false },
    timeUsedPerSet: { pushUps: [], sitUps: [], squats: [], run: 0 },
  };
}

// A custom PersistStorage keeps the on-disk value as the raw legacy shape.
// getItem accepts a raw legacy payload (what existing users already have at
// "@state") by wrapping it in the StorageValue envelope zustand expects;
// setItem unwraps it so we keep writing the raw shape going forward.
const storage: PersistStorage<Persisted> = {
  getItem: async (name) => {
    const raw = await AsyncStorage.getItem(name);
    if (!raw) return null;
    return { state: JSON.parse(raw) as Persisted, version: 0 };
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value.state));
  },
  removeItem: (name) => AsyncStorage.removeItem(name),
};

export const useWorkoutStore = create<WorkoutStore>()(
  persist<WorkoutStore, [], [], Persisted>(
    (set) => ({
      currentWorkout: genNewWorkout(0),
      history: [],
      incrementLevel: () =>
        set((s) => ({
          currentWorkout: {
            ...s.currentWorkout,
            level: Math.min(4, s.currentWorkout.level + 1),
          },
        })),
      decrementLevel: () =>
        set((s) => ({
          currentWorkout: {
            ...s.currentWorkout,
            level: Math.max(0, s.currentWorkout.level - 1),
          },
        })),
      startWorkout: () =>
        set((s) => ({ currentWorkout: { ...s.currentWorkout, started: true } })),
      completeWorkout: () =>
        set((s) => ({ currentWorkout: { ...s.currentWorkout, completed: true } })),
      completeSet: (exercise, seconds) =>
        set((s) => {
          const w = s.currentWorkout;
          if (exercise === 'run') {
            if (w.setsCompleted.run) return {};
            return {
              currentWorkout: {
                ...w,
                setsCompleted: { ...w.setsCompleted, run: true },
                timeUsedPerSet: { ...w.timeUsedPerSet, run: seconds },
              },
            };
          }
          if (w.setsCompleted[exercise] >= routines[w.level][exercise].sets) return {};
          return {
            currentWorkout: {
              ...w,
              setsCompleted: {
                ...w.setsCompleted,
                [exercise]: w.setsCompleted[exercise] + 1,
              },
              timeUsedPerSet: {
                ...w.timeUsedPerSet,
                [exercise]: [...w.timeUsedPerSet[exercise], seconds],
              },
            },
          };
        }),
      // If the persisted current workout is from an earlier day, archive it and
      // start a fresh workout at the same level. Runs after rehydration and can
      // be called again when the app foregrounds on a new day.
      rolloverIfNeeded: () =>
        set((s) => {
          if (s.currentWorkout.date === localDate()) return {};
          return {
            history: [...s.history, s.currentWorkout],
            currentWorkout: genNewWorkout(s.currentWorkout.level),
          };
        }),
      reset: () => set({ currentWorkout: genNewWorkout(0), history: [] }),
    }),
    {
      name: '@state',
      storage,
      partialize: (s) => ({ currentWorkout: s.currentWorkout, history: s.history }),
      onRehydrateStorage: () => (state) => state?.rolloverIfNeeded(),
    },
  ),
);

// Selectors / pure helpers.

// First exercise in order push-ups -> sit-ups -> squats whose completed sets
// are still below the level's target; otherwise the run.
export function currentExercise(workout: Workout): Exercise {
  const routine = routines[workout.level];
  if (workout.setsCompleted.pushUps < routine.pushUps.sets) return 'pushUps';
  if (workout.setsCompleted.sitUps < routine.sitUps.sets) return 'sitUps';
  if (workout.setsCompleted.squats < routine.squats.sets) return 'squats';
  return 'run';
}

// Mean of the four exercise fractions, as a 0..100 percentage.
export function percentComplete(workout: Workout): number {
  const routine = routines[workout.level];
  const fractions = [
    workout.setsCompleted.pushUps / routine.pushUps.sets,
    workout.setsCompleted.sitUps / routine.sitUps.sets,
    workout.setsCompleted.squats / routine.squats.sets,
    workout.setsCompleted.run ? 1 : 0,
  ];
  return (fractions.reduce((sum, f) => sum + f, 0) / fractions.length) * 100;
}
