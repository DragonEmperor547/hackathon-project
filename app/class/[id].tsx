import Feather from '@expo/vector-icons/Feather';
import { differenceInMinutes } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { TaskRow } from '@/components/TaskRow';
import { toTodayAt } from '@/lib/dates';
import { classStatus, getCourse, getSession, pendingTasks, tasksForCourse, todayWeekday } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function ClassDetailScreen() {
  const { c, courseColor } = useTheme();
  const now = useNow();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = getSession(id);
  const course = getCourse(session?.courseId);
  const tasks = useAppStore((s) => s.tasks);
  const pending = useMemo(() => (course ? pendingTasks(tasksForCourse(tasks, course.id)) : []), [tasks, course]);

  if (!session || !course) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, padding: 20 }}>
        <BackButton />
        <EmptyState title="Class not found" body="This class isn't on the timetable." />
      </SafeAreaView>
    );
  }

  const color = courseColor(course.id);
  const isToday = todayWeekday(now) === session.day;
  let when = `${session.day} · ${session.start} – ${session.end}`;
  if (isToday) {
    const status = classStatus(session, now);
    const mins = differenceInMinutes(toTodayAt(session.day, session.start, now), now);
    const tail = status === 'done' ? 'finished' : status === 'now' ? 'in progress' : mins < 60 ? `starts in ${mins} min` : `starts at ${session.start}`;
    when = `Today · ${session.start} – ${session.end} · ${tail}`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: color.hero, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' }}>
          <Svg width={180} height={180} style={{ position: 'absolute', right: -40, bottom: -50 }}>
            <Rect x={20} y={20} width={140} height={140} rx={36} fill="#FFFFFF" fillOpacity={0.1} />
          </Svg>
          <View style={{ padding: 20, paddingTop: 12, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <BackButton variant="onColor" />
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.onInverse }}>Class details</Text>
              <View style={{ width: 44 }} />
            </View>
            <View style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.onColorSoft }}>
              <Text style={[type.pill, { color: c.onInverse, letterSpacing: 0.66 }]}>
                {course.code} · {session.kind.toUpperCase()}
              </Text>
            </View>
            <Text accessibilityRole="header" style={{ fontFamily: fonts.heading, fontSize: 28, lineHeight: 32, color: c.onInverse }}>
              {course.name}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: c.onInverse, opacity: 0.85 }}>{when}</Text>
          </View>
        </SafeAreaView>

        <View style={{ padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tile label="Room" value={session.room} sub={`${session.building} · Floor ${session.floor}`} />
            <Tile label="Instructor" value={course.instructor} sub={`Office hrs ${course.office.split('· ')[1] ?? ''}`} />
          </View>

          <Card style={{ gap: 10, padding: 14 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>Where to go</Text>
            <Svg viewBox="0 0 320 120" width="100%" height={120}>
              <Rect x={1} y={1} width={318} height={118} rx={12} fill={c.bg} stroke={c.border} />
              <Rect x={14} y={14} width={70} height={40} rx={6} fill={c.surface} stroke={c.border} />
              <Rect x={92} y={14} width={70} height={40} rx={6} fill={c.surface} stroke={c.border} />
              <Rect x={170} y={14} width={136} height={40} rx={6} fill={color.soft} stroke={color.solid} strokeWidth={2} />
              <Rect x={14} y={74} width={110} height={32} rx={6} fill={c.surface} stroke={c.border} />
              <Rect x={132} y={74} width={60} height={32} rx={6} fill={c.surface} stroke={c.border} />
              <Rect x={200} y={74} width={106} height={32} rx={6} fill={c.surface} stroke={c.border} />
              <Path d="M14 64h292" stroke={c.iconMuted} strokeDasharray="4 5" />
              <SvgText x={226} y={38} fontSize={11} fontWeight="700" fill={color.ink}>{session.room}</SvgText>
              <SvgText x={162} y={94} fontSize={10} fill={c.textMuted} textAnchor="middle">Stairs</SvgText>
              <SvgText x={69} y={94} fontSize={10} fill={c.textMuted} textAnchor="middle">Faculty</SvgText>
              <SvgText x={253} y={94} fontSize={10} fill={c.textMuted} textAnchor="middle">Washrooms</SvgText>
              <Path d="M200 34c0-7 5-12 11-12s11 5 11 12c0 8-11 16-11 16s-11-8-11-16z" fill={color.solid} />
            </Svg>
            {session.directions ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMuted }}>{session.directions}</Text> : null}
          </Card>

          {session.topic ? (
            <Card style={{ gap: 6, padding: 14 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: c.textMuted }}>{isToday ? "Today's topic" : 'Topic'}</Text>
              <Text style={[type.title, { color: c.text }]}>{session.topic}</Text>
            </Card>
          ) : null}

          <View style={{ gap: 10 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: c.text }}>Pending for this course</Text>
            {pending.length ? pending.map((t) => <TaskRow key={t.id} task={t} now={now} />) : (
              <Card><Text style={{ fontFamily: fonts.medium, fontSize: 13, color: c.textMuted }}>Nothing pending for {course.code}.</Text></Card>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/course/${course.id}`)}
            style={({ pressed }) => ({ height: 56, borderRadius: 16, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: c.inverse, opacity: pressed ? 0.85 : 1 })}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.onInverse }}>Open course</Text>
            <Feather name="arrow-right" size={18} color={c.onInverse} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  const { c } = useTheme();
  return (
    <Card style={{ flex: 1, gap: 4, padding: 14, borderRadius: 18 }}>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: c.textMuted }}>{label}</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text }}>{value}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMuted }}>{sub}</Text>
    </Card>
  );
}
