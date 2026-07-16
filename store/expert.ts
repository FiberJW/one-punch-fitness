import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

import { sessionPercent } from '@/constants/expert-plan';
import { isoWeekStart, localDate } from '@/lib/dates';

// A single expert training session. `setsDone` maps exercise id -> completed
// sets (uncapped — extra sets beyond target are allowed and shown).
export interface ExpertSession {
  date: string;
  barDay: boolean;
  setsDone: Record<string, number>;
  completed: boolean;
}

// Persisted slice, stored raw under "@expert" (a bare { currentSession, history }
// object — same raw-shape adapter pattern as the other stores, no legacy data).
export interface Persisted {
  currentSession: ExpertSession;
  history: ExpertSession[];
}

interface ExpertStore extends Persisted {
  logSet: (id: string) => void;
  undoSet: (id: string) => void;
  setBarDay: (barDay: boolean) => void;
  completeSession: () => void;
  rolloverIfNeeded: () => void;
  reset: () => void;
}

function genNewSession(): ExpertSession {
  return { date: localDate(), barDay: false, setsDone: {}, completed: false };
}

const anySetLogged = (s: ExpertSession) => Object.values(s.setsDone).some((n) => n > 0);

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

export const useExpertStore = create<ExpertStore>()(
  persist<ExpertStore, [], [], Persisted>(
    (set) => ({
      currentSession: genNewSession(),
      history: [],
      logSet: (id) =>
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            setsDone: {
              ...s.currentSession.setsDone,
              [id]: (s.currentSession.setsDone[id] ?? 0) + 1,
            },
          },
        })),
      undoSet: (id) =>
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            setsDone: {
              ...s.currentSession.setsDone,
              [id]: Math.max(0, (s.currentSession.setsDone[id] ?? 0) - 1),
            },
          },
        })),
      setBarDay: (barDay) =>
        set((s) => ({ currentSession: { ...s.currentSession, barDay } })),
      completeSession: () =>
        set((s) => ({ currentSession: { ...s.currentSession, completed: true } })),
      // Archive an earlier day's session (only if any set was logged — an
      // untouched day is dropped) and start fresh. Same local-date rule as the
      // workout store; runs after rehydration and on app foreground.
      rolloverIfNeeded: () =>
        set((s) => {
          if (s.currentSession.date === localDate()) return {};
          return {
            history: anySetLogged(s.currentSession)
              ? [...s.history, s.currentSession]
              : s.history,
            currentSession: genNewSession(),
          };
        }),
      reset: () => set({ currentSession: genNewSession(), history: [] }),
    }),
    {
      name: '@expert',
      storage,
      partialize: (s) => ({ currentSession: s.currentSession, history: s.history }),
      onRehydrateStorage: () => (state) => state?.rolloverIfNeeded(),
    },
  ),
);

// Sessions logged in the current ISO week (Mon-based). The current session
// counts only once it has any logged set.
export function sessionsThisWeek(state: Persisted): number {
  const week = isoWeekStart(localDate());
  const sessions = anySetLogged(state.currentSession)
    ? [state.currentSession, ...state.history]
    : state.history;
  return sessions.filter((s) => isoWeekStart(s.date) === week).length;
}

// Live percent for the current session (re-exported convenience for UI).
export function currentSessionPercent(state: Persisted): number {
  return sessionPercent(state.currentSession);
}
