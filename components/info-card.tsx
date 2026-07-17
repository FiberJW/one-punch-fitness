import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import type { Guide } from '@/constants/guides';

export function InfoCard({ guide }: { guide: Guide }) {
  const { width } = useWindowDimensions();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={guide.title}
      haptic="selection"
      onPress={() => router.push({ pathname: '/info', params: { id: guide.id } })}>
      <View style={[styles.container, { width: width * 0.72 }]}>
        <View>
          <Image style={styles.cover} source={guide.coverImage} resizeMode="cover" />
          <LinearGradient style={styles.gradient} colors={['rgba(29,23,23,0)', colors.panel]} />
          <Text style={styles.title}>{guide.title}</Text>
          {guide.url ? (
            <View style={styles.linkIcon}>
              <Feather name="link" size={14} color={colors.capeWhite} />
            </View>
          ) : null}
        </View>
        <Text style={styles.description}>{guide.shortDescription}</Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.panel,
    marginHorizontal: 8,
    marginVertical: 8,
    overflow: 'hidden',
    borderRadius: 14,
    borderCurve: 'continuous',
  },
  cover: {
    height: 140,
    width: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 140,
  },
  title: {
    color: colors.capeWhite,
    fontSize: 18,
    fontFamily: fonts.medium,
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },
  linkIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.smoke,
    margin: 16,
  },
});
