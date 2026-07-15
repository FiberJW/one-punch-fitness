import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWorkoutStore } from '@/store/workout';

// Keep the splash visible until the workout store has rehydrated so cold-start
// taps can't act on pre-hydration state.
SplashScreen.preventAutoHideAsync();

// Inter fonts are embedded at build time via the expo-font config plugin (app.json),
// so no runtime font loading is needed here.
export default function RootLayout() {
  const [hydrated, setHydrated] = useState(() => useWorkoutStore.persist.hasHydrated());

  useEffect(() => useWorkoutStore.persist.onFinishHydration(() => setHydrated(true)), []);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  // Archive an earlier day's workout when the app returns to the foreground.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') useWorkoutStore.getState().rolloverIfNeeded();
    });
    return () => sub.remove();
  }, []);

  if (!hydrated) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.ink },
          headerTintColor: colors.capeWhite,
          headerTitleStyle: { fontFamily: fonts.regular },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.ink },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout"
          options={{ title: 'workout', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }}
        />
        <Stack.Screen name="info" options={{ title: 'info' }} />
      </Stack>
    </ThemeProvider>
  );
}
