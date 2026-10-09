import { format } from 'date-fns';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { HeroCard } from '@/components/HeroCard';
import { IconButton } from '@/components/IconButton';
import { MiniClassCard } from '@/components/MiniClassCard';
import { ProgressRing } from '@/components/ProgressRing';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { TaskRow } from '@/components/TaskRow';
import { STUDENT } from '@/data/student';
import { greeting } from '@/lib/dates';
import {
  classStatus,
  dueSoon,
  getCourse,
  getNextClass,
  pendingTasks,
  sessionsForDay,
  todayWeekday,
  unreadCount,
  weekProgress,
  type NextClass,
} from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function duration(min: number) {
  if (min < 60) return `${min} MIN`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} H ${m} MIN` : `${h} H`;
}

function heroEyebrow(next: NextClass) {
  if (next.isNow) return `NOW · UNTIL ${next.session.end}`;
  if (next.isToday) return `NEXT CLASS · IN ${duration(next.startsInMin)}`;
  return `NEXT CLASS · ${next.session.day.toUpperCase()} ${next.session.start}`;
}

export default function HomeScreen() {
  const { c } = useTheme();
  const now = useNow();
  const tasks = useAppStore((s) => s.tasks);
  const readNoticeIds = useAppStore((s) => s.readNoticeIds);

  const next = useMemo(() => getNextClass(now), [now]);
  const today = useMemo(() => {
    const day = todayWeekday(now);
    return day ? sessionsForDay(day) : [];
  }, [now]);
  const progress = useMemo(() => weekProgress(tasks, now), [tasks, now]);
  const pendingCount = useMemo(() => pendingTasks(tasks).length, [tasks]);
  const soon = useMemo(() => dueSoon(tasks, now), [tasks, now]);
  const unread = unreadCount(readNoticeIds);

  const nextCourse = getCourse(next?.session.courseId);
  const highlightedId = next?.isToday ? next.session.id : undefined;
  // Like the mockup: the last finished class, then the current/next one, then the rest.
  const visibleToday = useMemo(() => {
    const index = today.findIndex((s) => s.id === highlightedId);
    return index > 0 ? today.slice(index - 1) : today;
  }, [today, highlightedId]);

  const stats = [
    { color: c.warningDot, label: `${pendingCount} pending`, href: '/tasks' as const },
    { color: c.danger, label: `${unread} unread notice${unread === 1 ? '' : 's'}`, href: '/notices' as const },
    { color: c.link, label: `${today.length} class${today.length === 1 ? '' : 'es'} today` },
  ];

  return (
    <Screen scroll gap={20}>
      <ScreenHeader
        eyebrow={format(now, 'EEEE, d MMMM')}
        title={`${greeting(now)}, ${STUDENT.firstName}`}
        align="center"
        right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconButton icon="settings" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
            <IconButton
              icon="bell"
              iconSize={22}
              accessibilityLabel={unread ? `Notices, ${unread} unread` : 'Notices'}
              dot={unread > 0}
              onPress={() => router.push('/notices')}
            />
          </View>
        }
      />

      {next && nextCourse ? (
        <HeroCard
          eyebrow={heroEyebrow(next)}
          title={nextCourse.name}
          meta={[
            { icon: 'clock', label: `${next.session.start} – ${next.session.end}` },
            { icon: 'map-pin', label: `${next.session.room}, ${next.session.building}` },
          ]}
          accessibilityLabel={`${heroEyebrow(next).toLowerCase()}: ${nextCourse.name}, ${next.session.room}`}
          onPress={() => router.push(`/class/${next.session.id}`)}
        />
      ) : null}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Card
          onPress={() => router.push('/tasks')}
          accessibilityLabel={`${progress.done} of ${progress.total} tasks done this week`}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
          <ProgressRing size={56} stroke={7} progress={progress.pct} color={c.success}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>{Math.round(progress.pct * 100)}%</Text>
          </ProgressRing>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: c.text }}>
              {progress.done} of {progress.total}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: c.textMuted }}>tasks done this week</Text>
          </View>
        </Card>
        <Card style={{ flex: 1, justifyContent: 'center', gap: 10 }}>
          {stats.map((s) => {
            const row = (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s.color }} />
                <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: c.text }}>{s.label}</Text>
              </View>
            );
            return s.href ? (
              <Pressable key={s.label} accessibilityRole="link" hitSlop={6} onPress={() => router.push(s.href)}>
                {row}
              </Pressable>
            ) : (
              <View key={s.label}>{row}</View>
            );
          })}
        </Card>
      </View>

      <View style={{ gap: 12 }}>
        <SectionHeader title="Today's classes" linkLabel="Full schedule" onLinkPress={() => router.push('/schedule')} />
        {today.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
          >
            {visibleToday.map((s) => (
              <MiniClassCard key={s.id} session={s} status={classStatus(s, now)} highlighted={s.id === highlightedId} />
            ))}
          </ScrollView>
        ) : (
          <Card>
            <EmptyState
              title="No classes today"
              body={
                next && nextCourse
                  ? `Enjoy the break. Next up: ${nextCourse.shortName}, ${next.session.day} ${next.session.start}.`
                  : 'Enjoy the break.'
              }
            />
          </Card>
        )}
      </View>

      <View style={{ gap: 12 }}>
        <SectionHeader title="Due soon" linkLabel="All tasks" onLinkPress={() => router.push('/tasks')} />
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {soon.length ? (
            soon.map((t, i) => <TaskRow key={t.id} task={t} now={now} variant="inline" divider={i < soon.length - 1} />)
          ) : (
            <EmptyState title="Nothing due" body="You're all caught up. Tasks due in the next 7 days show up here." />
          )}
        </Card>
      </View>
    </Screen>
  );
}
