import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { WorkoutCard } from '@/components/workout-card';
import { useWorkoutStore } from '@/store/workout';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...args: unknown[]) => mockPush(...args) } }));

beforeEach(() => {
  useWorkoutStore.getState().reset();
  mockPush.mockClear();
});

describe('WorkoutCard level controls', () => {
  it('shows the current level as a 1-based label', async () => {
    await render(<WorkoutCard />);
    expect(screen.getByText('level 1')).toBeTruthy();
  });

  it('plus and minus change the displayed level', async () => {
    await render(<WorkoutCard />);

    await fireEvent.press(screen.getByLabelText('increase intensity'));
    expect(screen.getByText('level 2')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('increase intensity'));
    expect(screen.getByText('level 3')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('decrease intensity'));
    expect(screen.getByText('level 2')).toBeTruthy();
  });

  it('does not go below level 1 when minus is pressed at the bottom', async () => {
    await render(<WorkoutCard />);
    // minus is disabled at the lowest level, so pressing it changes nothing.
    await fireEvent.press(screen.getByLabelText('decrease intensity'));
    expect(screen.getByText('level 1')).toBeTruthy();
    expect(screen.getByLabelText('decrease intensity').props.accessibilityState?.disabled).toBe(true);
  });

  it('does not go above level 5 when plus is pressed at the top', async () => {
    await render(<WorkoutCard />);
    for (let i = 0; i < 6; i++) await fireEvent.press(screen.getByLabelText('increase intensity'));
    expect(screen.getByText('level 5')).toBeTruthy();
    expect(screen.getByLabelText('increase intensity').props.accessibilityState?.disabled).toBe(true);
  });

  it('locks both level controls once the workout has started', async () => {
    useWorkoutStore.getState().startWorkout();
    await render(<WorkoutCard />);
    // Neither control can change the level while a session is underway.
    await fireEvent.press(screen.getByLabelText('increase intensity'));
    await fireEvent.press(screen.getByLabelText('decrease intensity'));
    expect(screen.getByText('level 1')).toBeTruthy();
    expect(screen.getByLabelText('increase intensity').props.accessibilityState?.disabled).toBe(true);
    expect(screen.getByLabelText('decrease intensity').props.accessibilityState?.disabled).toBe(true);
  });
});

describe('WorkoutCard start button', () => {
  it('reads "start" before starting, "resume" once started, "completed" when done', async () => {
    await render(<WorkoutCard />);
    expect(screen.getByText('start')).toBeTruthy();

    await act(async () => useWorkoutStore.getState().startWorkout());
    expect(screen.getByText('resume')).toBeTruthy();

    await act(async () => useWorkoutStore.getState().completeWorkout());
    expect(screen.getByText('completed')).toBeTruthy();
  });

  it('starts the session and navigates to the workout screen when pressed', async () => {
    await render(<WorkoutCard />);
    await fireEvent.press(screen.getByText('start'));
    expect(useWorkoutStore.getState().currentWorkout.started).toBe(true);
    expect(mockPush).toHaveBeenCalledWith('/workout');
  });
});
