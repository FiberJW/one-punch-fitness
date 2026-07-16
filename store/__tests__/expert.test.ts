import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  isOptionalToday,
  sessionPercent,
  sessionTarget,
  targetSets,
  visibleExercises,
} from '@/constants/expert-plan';
import { localDate } from '@/lib/dates';
import { sessionsThisWeek, useExpertStore, type ExpertSession } from '@/store/expert';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const setItemMock = AsyncStorage.setItem as jest.Mock;
const flush = () => new Promise((resolve) => setImmediate(resolve));

beforeEach(async () => {
  await AsyncStorage.clear();
  useExpertStore.getState().reset();
  setItemMock.mockClear();
});

describe('logSet / undoSet', () => {
  it('increments without a cap and floors undo at 0', () => {
    const { logSet, undoSet } = useExpertStore.getState();

    logSet('push-ups');
    logSet('push-ups');
    expect(useExpertStore.getState().currentSession.setsDone['push-ups']).toBe(2);

    // Extra sets beyond target are allowed.
    for (let i = 0; i < 5; i++) logSet('push-ups');
    expect(useExpertStore.getState().currentSession.setsDone['push-ups']).toBe(7);

    undoSet('push-ups');
    expect(useExpertStore.getState().currentSession.setsDone['push-ups']).toBe(6);

    // Undo never drops below zero.
    for (let i = 0; i < 20; i++) undoSet('band-curls');
    expect(useExpertStore.getState().currentSession.setsDone['band-curls']).toBe(0);
  });
});

describe('bar-day visibility filtering', () => {
  it('drops "add" rows off bar days and "skip" rows on bar days', () => {
    const offIds = visibleExercises(false).map((e) => e.id);
    const onIds = visibleExercises(true).map((e) => e.id);

    // pull-ups (add) only on bar days.
    expect(offIds).not.toContain('pull-ups');
    expect(onIds).toContain('pull-ups');

    // seated band rows (skip) drop out on bar days.
    expect(offIds).toContain('seated-band-rows');
    expect(onIds).not.toContain('seated-band-rows');

    // band curls (optionalSkip) stay visible on bar days, marked optional.
    expect(onIds).toContain('band-curls');
    expect(isOptionalToday(visibleExercises(true).find((e) => e.id === 'band-curls')!, true)).toBe(
      true,
    );
    expect(isOptionalToday(visibleExercises(false).find((e) => e.id === 'band-curls')!, false)).toBe(
      false,
    );
  });
});

describe('sessionTarget', () => {
  it('sums targetSets over visible non-optional exercises, differing by bar day', () => {
    // targetSets is sets.min for each exercise.
    const offSum = visibleExercises(false).reduce((n, e) => n + targetSets(e), 0);
    expect(sessionTarget(false)).toBe(offSum);

    // On a bar day, band-curls is optional and excluded, but pull-ups are added.
    const onExpected = visibleExercises(true)
      .filter((e) => !isOptionalToday(e, true))
      .reduce((n, e) => n + targetSets(e), 0);
    expect(sessionTarget(true)).toBe(onExpected);
  });
});

describe('sessionPercent', () => {
  it('caps per-exercise done at target so extra sets never exceed 100', () => {
    const setsDone: Record<string, number> = {};
    // Log way past target on every non-optional exercise off a bar day.
    for (const ex of visibleExercises(false)) setsDone[ex.id] = 99;
    expect(sessionPercent({ barDay: false, setsDone })).toBe(100);
  });

  it('is 0 for an empty session and partial in between', () => {
    expect(sessionPercent({ barDay: false, setsDone: {} })).toBe(0);

    const target = sessionTarget(false);
    // One completed set of push-ups contributes exactly 1 / target.
    const pct = sessionPercent({ barDay: false, setsDone: { 'push-ups': 1 } });
    expect(pct).toBeCloseTo((100 * 1) / target, 5);
  });

  it('excludes optional-on-bar-day rows from the percentage', () => {
    // Logging only band-curls on a bar day (optional) yields 0%.
    expect(sessionPercent({ barDay: true, setsDone: { 'band-curls': 5 } })).toBe(0);
  });
});

describe('rolloverIfNeeded', () => {
  const yesterday = localDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  it('archives a touched earlier-day session and starts fresh', async () => {
    const legacy = {
      currentSession: {
        date: yesterday,
        barDay: true,
        setsDone: { 'push-ups': 2 },
        completed: false,
      } satisfies ExpertSession,
      history: [],
    };
    await AsyncStorage.setItem('@expert', JSON.stringify(legacy));

    await useExpertStore.persist.rehydrate();
    await flush();

    const state = useExpertStore.getState();
    expect(state.history).toHaveLength(1);
    expect(state.history[0].date).toBe(yesterday);
    expect(state.currentSession.date).toBe(localDate());
    expect(state.currentSession.setsDone).toEqual({});
    expect(state.currentSession.barDay).toBe(false);
  });

  it('drops an untouched earlier-day session instead of archiving it', async () => {
    const legacy = {
      currentSession: { date: yesterday, barDay: false, setsDone: {}, completed: false },
      history: [],
    };
    await AsyncStorage.setItem('@expert', JSON.stringify(legacy));

    await useExpertStore.persist.rehydrate();
    await flush();

    const state = useExpertStore.getState();
    expect(state.history).toHaveLength(0);
    expect(state.currentSession.date).toBe(localDate());
  });
});

describe('persisted output stays in the raw shape at "@expert"', () => {
  it('writes a bare { currentSession, history } object with no zustand envelope', async () => {
    useExpertStore.getState().logSet('push-ups');
    await flush();

    expect(setItemMock).toHaveBeenCalled();
    const [key, value] = setItemMock.mock.calls.at(-1)!;
    expect(key).toBe('@expert');
    const parsed = JSON.parse(value);
    expect(Object.keys(parsed).sort()).toEqual(['currentSession', 'history']);
    expect(parsed).not.toHaveProperty('state');
    expect(parsed).not.toHaveProperty('version');
    expect(parsed.currentSession.setsDone['push-ups']).toBe(1);
  });
});

describe('sessionsThisWeek', () => {
  it('counts touched sessions falling in the current ISO week', () => {
    const state = {
      currentSession: {
        date: localDate(),
        barDay: false,
        setsDone: { 'push-ups': 1 },
        completed: false,
      },
      history: [
        // Earlier this week (Monday-based) — use a date guaranteed same week: today itself twice via history.
        { date: localDate(), barDay: false, setsDone: { squats: 1 }, completed: true },
        // Long ago — different week.
        {
          date: localDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
          barDay: false,
          setsDone: { squats: 1 },
          completed: true,
        },
      ],
    };
    expect(sessionsThisWeek(state)).toBe(2);
  });

  it('does not count the current session until a set is logged', () => {
    const state = {
      currentSession: { date: localDate(), barDay: false, setsDone: {}, completed: false },
      history: [],
    };
    expect(sessionsThisWeek(state)).toBe(0);
  });
});

describe('reset', () => {
  it('clears history and the current session', () => {
    const store = useExpertStore.getState();
    store.logSet('push-ups');
    store.reset();
    expect(useExpertStore.getState().history).toHaveLength(0);
    expect(useExpertStore.getState().currentSession.setsDone).toEqual({});
  });
});
