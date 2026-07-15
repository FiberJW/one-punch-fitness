import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

// Minimal placeholder screen body. Real UIs land in later PRs.
export function Placeholder({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.spotiBlack,
  },
  label: {
    color: colors.offWhite,
    fontSize: 20,
  },
});
