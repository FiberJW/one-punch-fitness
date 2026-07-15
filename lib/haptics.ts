import * as Haptics from 'expo-haptics';

export type Haptic = 'selection' | 'impact' | 'success' | 'warning';

// Fire-and-forget haptic feedback. Errors (e.g. unsupported hardware) are
// swallowed — feedback is never load-bearing.
export function triggerHaptic(kind: Haptic): void {
  switch (kind) {
    case 'selection':
      void Haptics.selectionAsync();
      return;
    case 'impact':
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    case 'success':
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    case 'warning':
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
  }
}
