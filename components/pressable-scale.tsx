import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { triggerHaptic, type Haptic } from '@/lib/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING = { damping: 15, stiffness: 320, mass: 0.5 };

// Pressable that springs to 0.96 on press-in and back on release, with optional
// haptic feedback fired on press. Drop-in replacement for TouchableOpacity.
export function PressableScale({
  haptic,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  style,
  children,
  ...rest
}: Omit<PressableProps, 'style'> & {
  haptic?: Haptic;
  // Plain styles only: the Pressable function-style form would be silently
  // ignored once composed with the animated scale style.
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        // Reanimated shared values are mutated through `.value` by design; the
        // React Compiler immutability rule doesn't model them.
        // eslint-disable-next-line react-hooks/immutability
        if (!disabled) scale.value = withSpring(0.96, SPRING);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1, SPRING);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) triggerHaptic(haptic);
        onPress?.(e);
      }}>
      {children}
    </AnimatedPressable>
  );
}
