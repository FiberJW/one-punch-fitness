import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { ANTON, fonts } from '@/constants/fonts';

// Big Anton display text cropped to its ink bounds: the Text keeps its natural
// (very tall) line box and the wrapper clips to cap-height so layouts can
// treat the numeral as exactly as tall as it looks.
export function DisplayText({
  size,
  style,
  children,
}: {
  size: number;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}) {
  const line = Math.round(size * ANTON.line);
  const inkHeight = Math.ceil(size * ANTON.inkHeight) + 2;
  const inkTop = size * ANTON.inkTop - 1;

  return (
    <View style={[styles.clip, { height: inkHeight }]}>
      <Text
        style={[
          styles.text,
          { fontSize: size, lineHeight: line, marginTop: -inkTop },
          style,
        ]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  text: {
    fontFamily: fonts.display,
    color: colors.capeWhite,
    includeFontPadding: false,
  },
});
