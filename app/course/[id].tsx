import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TaskRow } from '@/components/TaskRow';
import { getCourse, pendingTasks, completedTasks, sessionsForCourse, tasksForCourse, todayWeekday } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';
import { courseColors, fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Tab = 'classes' | 'tasks' | 'about';
const GRADING_COLORS = ['teal', 'violet', 'coral', 'amber', 'blue'] as const;

export default function CourseDetailScreen() {
  const { c, scheme, courseColor } = useTheme();
  const now = useNow();
  const { id } = useLocalSearchParams<{ id: string }>();
  const course = getCourse(id);
  const tasks = useAppStore((s) => s.tasks);
  const [tab, setTab] = useState<Tab>('classes');
  const courseTasks = useMemo(() => {
    const list = tasksForCourse(tasks, id);
    return [...pendingTasks(list), ...completedTasks(list)];
  }, [tasks, id]);

  if (!course) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, padding: 20 }}>
        <BackButton />
        <EmptyState title="Course not found" body="This course isn't in your semester." />
      </SafeAreaView>
    );
  }

  const color = courseColor(course.id);
  const sessions = sessionsForCourse(course.id);
  const pendingCount = courseTasks.filter((t) => t.status === 'pending').length;
  const today = todayWeekday(now);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: color.hero, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          <View style={{ padding: 20, paddingTop: 12, gap: 12 }}>
            <BackButton variant="onColor" />
            <View style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.onColorSoft }}>
              <Text style={[type.pill, { color: c.onInverse, letterSpacing: 0.66 }]}>
                {course.code} · {course.credits} CREDIT HRS
              </Text>
            </View>
            <Text accessibilityRole="header" style={{ fontFamily: fonts.heading, fontSize: 28, lineHeight: 32, color: c.onInverse }}>
              {course.name}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: c.onInverse, opacity: 0.85 }}>
              {course.instructor} · {course.office}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[`${sessions.length} classes/wk`, `${pendingCount} pending`, `${course.attendance}% attendance`].map((t) => (
                <View key={t} style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.onColorSoft }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.onInverse }}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>

        <View style={{ padding: 20, gap: 16 }}>
          <SegmentedControl
            options={[
              { key: 'classes', label: 'Classes' },
              { key: 'tasks', label: 'Tasks' },
              { key: 'about', label: 'About' },
            ]}
            value={tab}
            onChange={setTab}
          />

          {tab === 'classes' ? (
            <View style={{ gap: 10 }}>
              {sessions.map((s) => {
                const isToday = s.day === today;
                return (
                  <Pressable
                    key={s.id}
                    accessibilityRole="button"
                    onPress={() => router.push(`/class/${s.id}`)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      padding: isToday ? 13 : 14,
                      borderRadius: 18,
                      backgroundColor: c.surface,
                      borderWidth: isToday ? 2 : 1,
                      borderColor: isToday ? c.link : c.border,
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <View style={{ width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: color.soft }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: color.ink }}>{s.day}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[type.title, { color: c.text }]}>
                        {s.start} – {s.end} · {s.kind}
                      </Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMuted }}>
                        {s.room}, {s.building}
                        {isToday ? ' · Today' : ''}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {tab === 'tasks' ? (
            <View style={{ gap: 10 }}>
              {courseTasks.length ? courseTasks.map((t) => <TaskRow key={t.id} task={t} now={now} />) : (
                <EmptyState title="No tasks yet" body={`Tasks you add for ${course.code} show up here.`} />
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push(`/task-form?courseId=${course.id}`)}
                style={{ height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: c.border, borderStyle: 'dashed' }}
              >
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.primary }}>+ Add task for {course.code}</Text>
              </Pressable>
            </View>
          ) : null}

          {tab === 'about' ? (
            <View style={{ gap: 16 }}>
              <Text style={[type.body, { fontSize: 15, lineHeight: 24, color: c.textSecondary }]}>{course.description}</Text>
              <Card style={{ gap: 12 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: c.text }}>Grading</Text>
                <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
                  {course.grading.map((g, i) => (
                    <View key={g.label} style={{ flex: g.weight, backgroundColor: courseColors[scheme][GRADING_COLORS[i % 5]].solid }} />
                  ))}
                </View>
                {course.grading.map((g, i) => (
                  <View key={g.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: courseColors[scheme][GRADING_COLORS[i % 5]].solid }} />
                    <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: c.text }}>{g.label}</Text>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{g.weight}%</Text>
                  </View>
                ))}
              </Card>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
