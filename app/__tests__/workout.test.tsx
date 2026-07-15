import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import WorkoutScreen from '@/app/workout';
import { useWorkoutStore } from '@/store/workout';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-keep-awake', () => ({ useKeepAwake: jest.fn() }));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({ router: { back: (...a: unknown[]) => mockBack(...a) } }));

beforeEach(() => {
  jest.useFakeTimers();
  useWorkoutStore.getState().reset();
  mockBack.mockClear();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('WorkoutScreen session', () => {
  it('starts a session when GO is pressed, revealing COMPLETE', async () => {
    await render(<WorkoutScreen />);
    expect(screen.getByText('GO')).toBeTruthy();

    await fireEvent.press(screen.getByText('GO'));
    expect(screen.getByText('COMPLETE')).toBeTruthy();
  });

  it('advances to the next set after COMPLETE', async () => {
    await render(<WorkoutScreen />);
    // Level 0 push-ups: 10 sets. Start on set 1.
    expect(screen.getByText('set 1 of 10')).toBeTruthy();

    await fireEvent.press(screen.getByText('GO'));
    await fireEvent.press(screen.getByText('COMPLETE'));

    // One set recorded; the UI now offers set 2.
    expect(useWorkoutStore.getState().currentWorkout.setsCompleted.pushUps).toBe(1);
    expect(screen.getByText('set 2 of 10')).toBeTruthy();
    expect(screen.getByText('GO')).toBeTruthy();
  });

  it('fires a congratulations alert and navigates back after the final run', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    // Finish every rep-based set so the run is the only exercise left.
    const store = useWorkoutStore.getState();
    for (let i = 0; i < 10; i++) store.completeSet('pushUps', 10);
    for (let i = 0; i < 10; i++) store.completeSet('sitUps', 10);
    for (let i = 0; i < 10; i++) store.completeSet('squats', 10);

    await render(<WorkoutScreen />);
    expect(screen.getByText(/run/)).toBeTruthy();

    await fireEvent.press(screen.getByText('GO'));
    await fireEvent.press(screen.getByText('COMPLETE'));

    expect(useWorkoutStore.getState().currentWorkout.completed).toBe(true);
    expect(alertSpy).toHaveBeenCalledWith(
      'Congrats!',
      expect.stringContaining("completed today's workout"),
    );
    expect(mockBack).toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
