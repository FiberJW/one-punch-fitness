// Reanimated's official Jest mock: entering/exiting animations become no-ops and
// worklet hooks (useSharedValue/useAnimatedStyle/withSpring/withTiming) return
// static values, so fake-timer tests never touch the UI-thread runtime.
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Haptics are pure side effects with no rendered output — stub to no-ops so the
// native module is never invoked under test.
jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning' },
}));
