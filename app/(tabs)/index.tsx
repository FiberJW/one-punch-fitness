import { FlatList, type ListRenderItem, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/info-card';
import { WorkoutCard } from '@/components/workout-card';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { guides, type Guide } from '@/constants/guides';

// Stable reference so FlatList rows are not rebuilt on every screen redraw.
const renderGuide: ListRenderItem<Guide> = ({ item }) => <InfoCard guide={item} />;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}>
      <WorkoutCard />
      <Text style={styles.sectionLabel}>GUIDES (swipe left for more)</Text>
      <FlatList
        style={styles.guides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={guides}
        keyExtractor={(guide) => guide.id}
        renderItem={renderGuide}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.spotiBlack,
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  sectionLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    marginLeft: 16,
    color: colors.seventyWhite,
  },
  guides: {
    flexGrow: 0,
  },
});
