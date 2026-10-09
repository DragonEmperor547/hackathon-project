import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/theme/useTheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const { c, scheme } = useTheme();
  // A font failure falls back to system fonts rather than a stuck splash screen.
  const ready = (fontsLoaded || !!fontError) && hasHydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="class/[id]" />
        <Stack.Screen name="course/[id]" />
        <Stack.Screen name="task/[id]" />
        <Stack.Screen name="task-form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notice/[id]" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
