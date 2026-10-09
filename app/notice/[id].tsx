import Feather from '@expo/vector-icons/Feather';
import { addDays, format, parseISO, set, startOfDay } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { EmptyState } from '@/components/EmptyState';
import { NOTICE_META } from '@/lib/noticeMeta';
import { getNotice } from '@/lib/selectors';
import { useAppStore } from '@/store/useAppStore';
import { courseColors, fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function NoticeDetailScreen() {
  const { c, scheme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const notice = getNotice(id);
  const markNoticeRead = useAppStore((s) => s.markNoticeRead);
  const addTask = useAppStore((s) => s.addTask);
  const tasks = useAppStore((s) => s.tasks);
  const linkedTask = useMemo(() => tasks.find((t) => t.sourceNoticeId === id), [tasks, id]);

  useEffect(() => {
    if (notice) markNoticeRead(notice.id);
  }, [notice, markNoticeRead]);

  if (!notice) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, padding: 20 }}>
        <BackButton />
        <EmptyState title="Notice not found" body="It may have been removed." />
      </SafeAreaView>
    );
  }

  const meta = NOTICE_META[notice.category];
  const tile = meta.color ? courseColors[scheme][meta.color] : { soft: c.surfaceMuted, ink: c.textSecondary };
  const initials = notice.source
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  const addToTasks = () => {
    const due = set(addDays(startOfDay(new Date()), 1), { hours: 23, minutes: 59 });
    const newId = addTask({
      title: notice.title,
      notes: notice.body.split('\n\n')[0],
      courseId: notice.courseId ?? null,
      dueAt: due.toISOString(),
      priority: notice.category === 'exam' ? 'high' : 'medium',
      sourceNoticeId: notice.id,
    });
    router.push(`/task/${newId}`);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.surface }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 12, gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackButton variant="muted" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.successSoft }}>
            <Feather name="check" size={14} color={c.successInk} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.successInk }}>Marked as read</Text>
          </View>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: tile.soft }}>
          <Text style={[type.pill, { color: tile.ink }]}>{meta.label.toUpperCase()}</Text>
        </View>
        <Text accessibilityRole="header" style={{ fontFamily: fonts.heading, fontSize: 27, lineHeight: 32, color: c.text }}>
          {notice.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: c.inverse }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.onInverse }}>{initials}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{notice.source}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>
              {format(parseISO(notice.postedAt), 'EEE, d MMM · h:mm a')}
            </Text>
          </View>
        </View>

        {notice.change ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1, gap: 2, padding: 12, borderRadius: 16, backgroundColor: c.surfaceMuted, opacity: 0.7 }}>
              <Text style={[type.pill, { color: c.textMuted }]}>WAS</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.textMuted, textDecorationLine: 'line-through' }}>{notice.change.wasLabel}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMuted, textDecorationLine: 'line-through' }}>{notice.change.wasDetail}</Text>
            </View>
            <Feather name="arrow-right" size={18} color={c.textMuted} />
            <View style={{ flex: 1, gap: 2, padding: 11, borderRadius: 16, borderWidth: 2, borderColor: c.primary, backgroundColor: c.surface }}>
              <Text style={[type.pill, { color: c.primary }]}>NOW</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{notice.change.nowLabel}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textSecondary }}>{notice.change.nowDetail}</Text>
            </View>
          </View>
        ) : null}

        {notice.body.split('\n\n').map((p) => (
          <Text key={p.slice(0, 24)} style={[type.body, { fontSize: 15, lineHeight: 24, color: c.textSecondary }]}>
            {p}
          </Text>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: 10, paddingTop: 8, gap: 6 }}>
        {linkedTask ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/task/${linkedTask.id}`)}
            style={{ height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: c.success, flexDirection: 'row', gap: 8 }}
          >
            <Feather name="check" size={18} color={c.successInk} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.successInk }}>Added to Tasks · View</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={addToTasks}
            style={({ pressed }) => ({ height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primary, opacity: pressed ? 0.85 : 1 })}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.onPrimary }}>Add to Tasks</Text>
          </Pressable>
        )}
        <Text style={{ textAlign: 'center', fontFamily: fonts.regular, fontSize: 12, color: c.textMuted }}>
          {linkedTask ? 'This notice is linked to a task.' : 'Creates a task due tomorrow so you don’t miss it.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

