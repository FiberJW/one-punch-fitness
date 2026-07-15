import AsyncStorage from '@react-native-async-storage/async-storage';

import { localDate } from '@/lib/dates';
import {
  currentExercise,
  percentComplete,
  useWorkoutStore,
  type Workout,
} from '@/store/workout';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const setItemMock = AsyncStorage.setItem as jest.Mock;

// Let zustand's async persist writes settle.
const flush = () => new Promise((resolve) => setImmediate(resolve));

function makeWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    level: 0,
    date: localDate(),
    started: false,
    completed: false,
    setsCompleted: { pushUps: 0, sitUps: 0, squats: 0, run: false },
    timeUsedPerSet: { pushUps: [], sitUps: [], squats: [], run: 0 },
    ...overrides,
  };
}

beforeEach(async () => {
  await AsyncStorage.clear();
  useWorkoutStore.getState().reset();
  setItemMock.mockClear();
});

describe('rehydration of legacy "@state" payload', () => {
  it('archives yesterday\'s workout and starts a fresh one at the same level', async () => {
    const yesterday = localDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const legacy = {
      currentWorkout: makeWorkout({
        level: 2,
        date: yesterday,
        started: true,
        setsCompleted: { pushUps: 3, sitUps: 0, squats: 0, run: false },
      }),
      history: [],
    };
    await AsyncStorage.setItem('@state', JSON.stringify(legacy));

    await useWorkoutStore.persist.rehydrate();
    await flush();

    const state = useWorkoutStore.getState();
    // Yesterday's session was archived.
    expect(state.history).toHaveLength(1);
    expect(state.history[0].date).toBe(yesterday);
    expect(state.history[0].setsCompleted.pushUps).toBe(3);
    // A fresh workout was created for today at the same level.
    expect(state.currentWorkout.date).toBe(localDate());
    expect(state.currentWorkout.level).toBe(2);
    expect(state.currentWorkout.started).toBe(false);
    expect(state.currentWorkout.setsCompleted.pushUps).toBe(0);
  });

  it('keeps today\'s persisted workout untouched (no rollover)', async () => {
    const today = makeWorkout({ level: 1, started: true, date: localDate() });
    await AsyncStorage.setItem('@state', JSON.stringify({ currentWorkout: today, history: [] }));

    await useWorkoutStore.persist.rehydrate();
    await flush();

    const state = useWorkoutStore.getState();
    expect(state.history).toHaveLength(0);
    expect(state.currentWorkout.started).toBe(true);
    expect(state.currentWorkout.level).toBe(1);
  });
});

describe('persisted output stays in the raw legacy shape', () => {
  it('writes a bare { currentWorkout, history } object with no zustand envelope', async () => {
    useWorkoutStore.getState().incrementLevel();
    await flush();

    expect(setItemMock).toHaveBeenCalled();
    const [key, value] = setItemMock.mock.calls.at(-1)!;
    expect(key).toBe('@state');
    const parsed = JSON.parse(value);
    expect(Object.keys(parsed).sort()).toEqual(['currentWorkout', 'history']);
    expect(parsed).not.toHaveProperty('state');
    expect(parsed).not.toHaveProperty('version');
    expect(parsed.currentWorkout.level).toBe(1);
  });
});

describe('completeSet progression via currentExercise', () => {
  it('advances pushUps -> sitUps -> squats -> run as each target is met', () => {
    const store = useWorkoutStore.getState();
    // Level 0 routine: 10 sets each of push-ups/sit-ups/squats, then the run.
    expect(currentExercise(useWorkoutStore.getState().currentWorkout)).toBe('pushUps');

    for (let i = 0; i < 10; i++) store.completeSet('pushUps', 30);
    expect(currentExercise(useWorkoutStore.getState().currentWorkout)).toBe('sitUps');

    for (let i = 0; i < 10; i++) store.completeSet('sitUps', 30);
    expect(currentExercise(useWorkoutStore.getState().currentWorkout)).toBe('squats');

    for (let i = 0; i < 10; i++) store.completeSet('squats', 30);
    expect(currentExercise(useWorkoutStore.getState().currentWorkout)).toBe('run');

    store.completeSet('run', 3600);
    const w = useWorkoutStore.getState().currentWorkout;
    expect(w.setsCompleted.run).toBe(true);
    expect(w.timeUsedPerSet.run).toBe(3600);
    expect(w.timeUsedPerSet.pushUps).toHaveLength(10);
  });
});

describe('percentComplete', () => {
  it('is 0 for a fresh workout and 100 for a fully finished one', () => {
    const fresh = useWorkoutStore.getState().currentWorkout;
    expect(percentComplete(fresh)).toBe(0);

    const done = makeWorkout({
      setsCompleted: { pushUps: 10, sitUps: 10, squats: 10, run: true },
    });
    expect(percentComplete(done)).toBe(100);
  });

  it('averages the four exercise fractions', () => {
    // One of four exercises fully done -> 25%.
    const quarter = makeWorkout({
      setsCompleted: { pushUps: 10, sitUps: 0, squats: 0, run: false },
    });
    expect(percentComplete(quarter)).toBeCloseTo(25, 5);

    // Half of push-ups (5/10) plus the run done -> (0.5 + 1) / 4 = 37.5%.
    const mixed = makeWorkout({
      setsCompleted: { pushUps: 5, sitUps: 0, squats: 0, run: true },
    });
    expect(percentComplete(mixed)).toBeCloseTo(37.5, 5);
  });
});

describe('level clamping', () => {
  it('never rises above 4', () => {
    const store = useWorkoutStore.getState();
    for (let i = 0; i < 8; i++) store.incrementLevel();
    expect(useWorkoutStore.getState().currentWorkout.level).toBe(4);
  });

  it('never drops below 0', () => {
    const store = useWorkoutStore.getState();
    store.decrementLevel();
    store.decrementLevel();
    expect(useWorkoutStore.getState().currentWorkout.level).toBe(0);
  });
});
