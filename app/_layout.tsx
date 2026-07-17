import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';

import { colors } from '@/constants/colors';

// Inter fonts are embedded at build time via the expo-font config plugin (app.json),
// so no runtime font loading is needed here.
export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.spotiBlack },
          headerTintColor: colors.offWhite,
          contentStyle: { backgroundColor: colors.spotiBlack },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workout" options={{ title: 'workout' }} />
        <Stack.Screen name="info" options={{ title: 'info' }} />
      </Stack>
    </ThemeProvider>
  );
}
