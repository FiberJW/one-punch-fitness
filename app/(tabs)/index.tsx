import { FlatList, type ListRenderItem, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExpertCard } from '@/components/expert-card';
import { InfoCard } from '@/components/info-card';
import { Eyebrow } from '@/components/type';
import { WorkoutCard } from '@/components/workout-card';
import { colors } from '@/constants/colors';
import { guides, type Guide } from '@/constants/guides';
import { useSettingsStore } from '@/store/settings';

// Stable reference so FlatList rows are not rebuilt on every screen redraw.
const renderGuide: ListRenderItem<Guide> = ({ item }) => <InfoCard guide={item} />;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const expertMode = useSettingsStore((s) => s.expertMode);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: expertMode ? insets.top + 8 : 0, paddingBottom: insets.bottom + 16 },
      ]}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}>
      {expertMode ? <ExpertCard /> : <WorkoutCard />}
      <View style={styles.guidesHeader}>
        <Eyebrow>guides</Eyebrow>
      </View>
      <FlatList
        style={styles.guides}
        contentContainerStyle={styles.guidesContent}
        horizontal
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
    backgroundColor: colors.ink,
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  guidesHeader: {
    marginTop: 28,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  guides: {
    flexGrow: 0,
  },
  guidesContent: {
    paddingLeft: 12,
  },
});
