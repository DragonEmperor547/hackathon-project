import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="class/[id]" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="task/[id]" />
      <Stack.Screen name="task-form" options={{ presentation: 'modal' }} />
      <Stack.Screen name="notice/[id]" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
