import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { guides } from '@/constants/guides';

export default function InfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = guides.find((g) => g.id === id);

  if (!guide) {
    return (
      <View style={[styles.container, styles.fallback]}>
        <Text style={styles.fallbackText}>guide not found</Text>
      </View>
    );
  }

  if (guide.url) {
    return (
      <View style={styles.container}>
        <WebView
          source={{ uri: guide.url }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.status} />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image style={styles.hero} source={guide.coverImage} resizeMode="cover" />
      <ScrollView style={styles.textContent}>
        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.description}>{guide.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spotiBlack,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: colors.offWhite,
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    flex: 0.4,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    width: '100%',
  },
  textContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.offWhite,
    fontSize: 24,
    fontFamily: fonts.medium,
    marginTop: 24,
    backgroundColor: 'transparent',
  },
  description: {
    color: colors.seventyWhite,
    fontSize: 18,
    fontFamily: fonts.regular,
    marginVertical: 16,
    backgroundColor: 'transparent',
  },
});
