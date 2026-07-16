import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { ExpertWorkout } from '@/components/expert-workout';
import { useExpertStore } from '@/store/expert';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-keep-awake', () => ({ useKeepAwake: jest.fn() }));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({ router: { back: (...a: unknown[]) => mockBack(...a) } }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

beforeEach(() => {
  jest.useFakeTimers();
  useExpertStore.getState().reset();
  mockBack.mockClear();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('ExpertWorkout checklist', () => {
  it('increments an exercise counter when its row is tapped', async () => {
    await render(<ExpertWorkout />);

    // push-ups target is 4 sets; starts at 0/4.
    expect(screen.getByText('0/4')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('push-ups'));
    expect(useExpertStore.getState().currentSession.setsDone['push-ups']).toBe(1);
    expect(screen.getByText('1/4')).toBeTruthy();
  });

  it('undoes a set on long press, flooring at zero', async () => {
    await render(<ExpertWorkout />);
    await fireEvent.press(screen.getByLabelText('push-ups'));
    expect(screen.getByText('1/4')).toBeTruthy();

    await fireEvent(screen.getByLabelText('push-ups'), 'longPress');
    expect(useExpertStore.getState().currentSession.setsDone['push-ups']).toBe(0);
    expect(screen.getByText('0/4')).toBeTruthy();
  });

  it('finishes the session, alerts, and navigates back', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await render(<ExpertWorkout />);

    await fireEvent.press(screen.getByLabelText('finish session'));

    expect(useExpertStore.getState().currentSession.completed).toBe(true);
    expect(alertSpy).toHaveBeenCalledWith('Nice work', expect.stringContaining('session logged'));
    expect(mockBack).toHaveBeenCalled();
  });
});
