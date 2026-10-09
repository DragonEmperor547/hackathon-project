import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

const tab = (title: string, icon: ComponentProps<typeof Feather>['name']) => ({
  title,
  tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => <Feather name={icon} color={color} size={size} />,
});

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={tab('Home', 'home')} />
      <Tabs.Screen name="schedule" options={tab('Schedule', 'calendar')} />
      <Tabs.Screen name="tasks" options={tab('Tasks', 'check-square')} />
      <Tabs.Screen name="courses" options={tab('Courses', 'book')} />
      <Tabs.Screen name="notices" options={tab('Notices', 'bell')} />
    </Tabs>
  );
}
