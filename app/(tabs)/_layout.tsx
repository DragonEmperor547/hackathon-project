import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { unreadCount } from '@/lib/selectors';
import { useAppStore } from '@/store/useAppStore';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type IconName = ComponentProps<typeof Feather>['name'];

export default function TabsLayout() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const readNoticeIds = useAppStore((s) => s.readNoticeIds);
  const unread = unreadCount(readNoticeIds);

  const tab = (title: string, icon: IconName) => ({
    title,
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <View
        style={{
          paddingVertical: 4,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: focused ? c.primarySoft : 'transparent',
        }}
      >
        <Feather name={icon} size={22} color={focused ? c.link : c.textMuted} />
      </View>
    ),
    tabBarLabel: ({ focused }: { focused: boolean }) => (
      <Text style={{ fontFamily: focused ? fonts.bold : fonts.semibold, fontSize: 11, color: focused ? c.link : c.textMuted }}>
        {title}
      </Text>
    ),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: c.bg },
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 10,
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 1,
        },
        tabBarIconStyle: { width: 56, height: 30 },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'home')} />
      <Tabs.Screen name="schedule" options={tab('Schedule', 'calendar')} />
      <Tabs.Screen name="tasks" options={tab('Tasks', 'check-square')} />
      <Tabs.Screen name="courses" options={tab('Courses', 'book')} />
      <Tabs.Screen
        name="notices"
        options={{
          ...tab('Notices', 'bell'),
          tabBarBadge: unread || undefined,
          tabBarBadgeStyle: {
            backgroundColor: c.danger,
            color: c.onInverse,
            fontFamily: fonts.bold,
            fontSize: 10,
            borderWidth: 2,
            borderColor: c.surface,
          },
        }}
      />
    </Tabs>
  );
}
