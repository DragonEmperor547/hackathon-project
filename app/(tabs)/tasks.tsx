import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { Fab } from '@/components/Fab';
import { IconButton } from '@/components/IconButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TaskRow } from '@/components/TaskRow';
import { completedTasks, pendingTasks, weekProgress } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Segment = 'pending' | 'completed';

export default function TasksScreen() {
  const { c } = useTheme();
  const now = useNow();
  const tasks = useAppStore((s) => s.tasks);
  const [segment, setSegment] = useState<Segment>('pending');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const pending = useMemo(() => pendingTasks(tasks), [tasks]);
  const completed = useMemo(() => completedTasks(tasks), [tasks]);
  const progress = useMemo(() => weekProgress(tasks, now), [tasks, now]);

  const visible = useMemo(() => {
    const list = segment === 'pending' ? pending : completed;
    const q = query.trim().toLowerCase();
    return q ? list.filter((t) => t.title.toLowerCase().includes(q)) : list;
  }, [segment, pending, completed, query]);

  const toggleSearch = () => {
    if (searchOpen) setQuery('');
    setSearchOpen(!searchOpen);
  };

  const empty = query.trim()
    ? { title: 'No matching tasks', body: `Nothing in ${segment} matches "${query.trim()}".` }
    : segment === 'pending'
      ? { title: 'All caught up', body: 'No pending tasks. Tap + to add one.' }
      : { title: 'Nothing completed yet', body: 'Tick a task to move it here.' };

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll style={{ paddingBottom: 100 }}>
        <ScreenHeader
          eyebrow={`${pending.length} pending · ${completed.length} done`}
          title="Tasks"
          right={
            <IconButton
              icon={searchOpen ? 'x' : 'search'}
              accessibilityLabel={searchOpen ? 'Close search' : 'Search tasks'}
              onPress={toggleSearch}
            />
          }
        />

        {searchOpen ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: 48,
              paddingHorizontal: 14,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: c.border,
              backgroundColor: c.surface,
            }}
          >
            <Feather name="search" size={18} color={c.textMuted} />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Search by title"
              placeholderTextColor={c.textMuted}
              returnKeyType="search"
              accessibilityLabel="Search tasks by title"
              style={{ flex: 1, height: '100%', fontFamily: fonts.medium, fontSize: 15, color: c.text }}
            />
          </View>
        ) : null}

        <View style={{ gap: 10, padding: 16, borderRadius: 20, backgroundColor: c.inverse }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: c.onInverse }}>Weekly progress</Text>
            <Text style={{ fontFamily: fonts.heading, fontSize: 22, color: c.onInverse }}>
              {progress.done}/{progress.total}
            </Text>
          </View>
          <ProgressBar progress={progress.pct} color={c.highlight} trackColor={c.inverseTrack} height={10} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: c.onInverseMuted }}>
            Tick a task to see the bar, counts and Home update together.
          </Text>
        </View>

        <SegmentedControl
          options={[
            { key: 'pending', label: `Pending · ${pending.length}` },
            { key: 'completed', label: `Completed · ${completed.length}` },
          ]}
          value={segment}
          onChange={setSegment}
        />

        <View style={{ gap: 10 }}>
          {visible.length ? (
            visible.map((t) => <TaskRow key={t.id} task={t} now={now} />)
          ) : (
            <EmptyState title={empty.title} body={empty.body} />
          )}
        </View>
      </Screen>
      <Fab accessibilityLabel="Add a task" onPress={() => router.push('/task-form')} />
    </View>
  );
}
