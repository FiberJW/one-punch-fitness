import * as Haptics from 'expo-haptics';

export type Haptic = 'selection' | 'impact' | 'success' | 'warning';

// Fire-and-forget haptic feedback. Errors (e.g. unsupported hardware) are
// swallowed — feedback is never load-bearing.
export function triggerHaptic(kind: Haptic): void {
  switch (kind) {
    case 'selection':
      Haptics.selectionAsync().catch(() => {});
      return;
    case 'impact':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      return;
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      return;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
  }
}
