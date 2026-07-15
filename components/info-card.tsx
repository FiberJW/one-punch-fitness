import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import type { Guide } from '@/constants/guides';

const CARD_WIDTH = Dimensions.get('window').width - 16;

export function InfoCard({ guide }: { guide: Guide }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/info', params: { id: guide.id } })}>
      <View style={styles.container}>
        <View>
          <Image
            style={styles.cover}
            source={guide.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            style={styles.gradient}
            colors={['rgba(0,0,0,0)', colors.spotiBlack]}
          />
          <Text style={styles.title}>{guide.title}</Text>
          {guide.url ? (
            <View style={styles.linkIcon}>
              <Feather name="link" size={16} color="white" />
            </View>
          ) : null}
        </View>
        <Text style={styles.description}>{guide.shortDescription}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.elevated,
    width: CARD_WIDTH,
    marginHorizontal: 8,
    marginVertical: 8,
    overflow: 'hidden',
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  cover: {
    height: 148,
    width: '100%',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 148,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontFamily: fonts.medium,
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'transparent',
  },
  linkIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 16,
    right: 16,
  },
  description: {
    fontFamily: fonts.regular,
    backgroundColor: 'transparent',
    fontSize: 12,
    color: colors.seventyWhite,
    margin: 16,
  },
});
