import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { ChipGroup } from '@/components/ChipGroup';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TaskRow } from '@/components/TaskRow';
import { completedTasks, dueSoon, pendingTasks, unreadCount } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';
import { type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Temporary component preview (Phase 1.3). P2 replaces this file with the real Home screen.
export default function HomeScreen() {
  const { c } = useTheme();
  const now = useNow();
  const tasks = useAppStore((s) => s.tasks);
  const readNoticeIds = useAppStore((s) => s.readNoticeIds);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const [seg, setSeg] = useState<'pending' | 'completed'>('pending');
  const [chip, setChip] = useState<'all' | 'unread' | 'exams'>('all');

  const soon = useMemo(() => dueSoon(tasks, now), [tasks, now]);
  const list = useMemo(() => (seg === 'pending' ? pendingTasks(tasks) : completedTasks(tasks)), [tasks, seg]);
  const unread = unreadCount(readNoticeIds);

  return (
    <Screen scroll gap={20}>
      <ScreenHeader
        eyebrow="Component preview"
        title="Good morning, Hamza"
        align="center"
        right={<IconButton icon="bell" accessibilityLabel={`Notices, ${unread} unread`} dot={unread > 0} onPress={() => router.push('/notices')} />}
      />
      <SegmentedControl
        options={[
          { key: 'system', label: 'System' },
          { key: 'light', label: 'Light' },
          { key: 'dark', label: 'Dark' },
        ]}
        value={themeMode}
        onChange={setThemeMode}
      />
      <View style={{ gap: 12 }}>
        <SectionHeader title="Due soon" linkLabel="All tasks" onLinkPress={() => router.push('/tasks')} />
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {soon.map((t, i) => (
            <TaskRow key={t.id} task={t} now={now} variant="inline" divider={i < soon.length - 1} />
          ))}
        </Card>
      </View>
      <SegmentedControl
        options={[
          { key: 'pending', label: `Pending · ${pendingTasks(tasks).length}` },
          { key: 'completed', label: `Completed · ${completedTasks(tasks).length}` },
        ]}
        value={seg}
        onChange={setSeg}
      />
      <View style={{ gap: 10 }}>
        {list.map((t) => (
          <TaskRow key={t.id} task={t} now={now} />
        ))}
      </View>
      <ChipGroup
        options={[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'exams', label: 'Exams' },
        ]}
        value={chip}
        onChange={setChip}
      />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Pill label="Overdue" tone="danger" />
        <Pill label="In 2 days" tone="warning" />
        <Pill label="Tue" />
        <Pill label="Done" tone="success" />
        <Pill label="Lecture" tone="primary" />
      </View>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <BackButton />
        <BackButton variant="muted" />
        <View style={{ padding: 8, borderRadius: 16, backgroundColor: c.primary }}>
          <BackButton variant="onColor" />
        </View>
        <Text style={[type.body, { color: c.textMuted }]}>Back buttons</Text>
      </View>
    </Screen>
  );
}
