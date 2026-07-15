import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '@/constants/colors';

export type ImpactBurstHandle = { fire: () => void };

const RAY_COUNT = 16;
const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => (i * 360) / RAY_COUNT);

// Signature manga speed-line burst: N thin capeWhite rays scale out and fade,
// with a brief full-screen flash. Fire imperatively via ref on impact moments.
export const ImpactBurst = forwardRef<ImpactBurstHandle>(function ImpactBurst(_props, ref) {
  const { width, height } = useWindowDimensions();
  const rayLength = Math.max(width, height);
  // Rest state is t=1 (opacity 0); fire() rewinds to 0 and plays forward.
  const t = useSharedValue(1);
  const flash = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    fire: () => {
      t.value = 0;
      t.value = withTiming(1, { duration: 450 });
      flash.value = 0.08;
      flash.value = withTiming(0, { duration: 80 });
    },
  }));

  const rayStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - t.value),
    transform: [{ scaleY: 0.4 + t.value }],
  }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, styles.flash, flashStyle]} />
      {RAYS.map((angle) => (
        <View key={angle} style={[styles.rayWrap, { transform: [{ rotate: `${angle}deg` }] }]}>
          <Animated.View style={[styles.ray, { height: rayLength }, rayStyle]} />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  flash: {
    backgroundColor: colors.capeWhite,
  },
  rayWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    width: 2,
    backgroundColor: colors.capeWhite,
  },
});
