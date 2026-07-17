import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { ExpertCard } from '@/components/expert-card';
import { useExpertStore } from '@/store/expert';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...args: unknown[]) => mockPush(...args) } }));

beforeEach(() => {
  useExpertStore.getState().reset();
  mockPush.mockClear();
});

describe('ExpertCard CTA states', () => {
  it('reads TRAIN when nothing is logged, RESUME after a set, DONE TODAY when completed', async () => {
    await render(<ExpertCard />);
    expect(screen.getByText('TRAIN')).toBeTruthy();
    expect(screen.getByLabelText('start session')).toBeTruthy();

    await act(async () => useExpertStore.getState().logSet('push-ups'));
    expect(screen.getByText('RESUME')).toBeTruthy();
    expect(screen.getByLabelText('resume session')).toBeTruthy();

    await act(async () => useExpertStore.getState().completeSession());
    expect(screen.getByText('DONE TODAY')).toBeTruthy();
    expect(screen.getByLabelText('session complete')).toBeTruthy();
  });

  it('navigates to the workout screen when pressed', async () => {
    await render(<ExpertCard />);
    await fireEvent.press(screen.getByText('TRAIN'));
    expect(mockPush).toHaveBeenCalledWith('/workout');
  });
});

describe('ExpertCard bar-day toggle', () => {
  it('flips the store barDay flag', async () => {
    await render(<ExpertCard />);
    expect(useExpertStore.getState().currentSession.barDay).toBe(false);

    await fireEvent.press(screen.getByLabelText('bar day'));
    expect(useExpertStore.getState().currentSession.barDay).toBe(true);

    await fireEvent.press(screen.getByLabelText('bar day'));
    expect(useExpertStore.getState().currentSession.barDay).toBe(false);
  });
});
