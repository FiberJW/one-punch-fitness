import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

// Tracked-caps utility label ("SET 1 OF 10", "PUSH-UPS", "GUIDES"). Content is
// uppercased by styling so source copy can stay conversational.
export function Eyebrow({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[styles.eyebrow, style]} />;
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.medium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.smoke,
  },
});
