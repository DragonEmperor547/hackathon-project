import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { CourseBadge } from '@/components/CourseBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { COURSES } from '@/data/courses';
import { SESSIONS } from '@/data/sessions';
import { STUDENT } from '@/data/student';
import { tasksForCourse } from '@/lib/selectors';
import { useAppStore } from '@/store/useAppStore';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function CoursesScreen() {
  const { c, courseColor } = useTheme();
  const tasks = useAppStore((s) => s.tasks);
  const credits = COURSES.reduce((sum, x) => sum + x.credits, 0);

  return (
    <Screen scroll>
      <ScreenHeader eyebrow={`Semester ${STUDENT.semester} · ${STUDENT.program}`} title="My courses" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[
          [COURSES.length, 'courses'],
          [credits, 'credit hours'],
          [SESSIONS.length, 'classes per week'],
        ].map(([n, label]) => (
          <Card key={label} style={{ flex: 1, padding: 14, borderRadius: 18, gap: 2 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: c.text }}>{n}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>{label}</Text>
          </Card>
        ))}
      </View>
      <View style={{ gap: 12 }}>
        {COURSES.map((course) => {
          const list = tasksForCourse(tasks, course.id);
          const done = list.filter((t) => t.status === 'completed').length;
          const pending = list.length - done;
          return (
            <Card
              key={course.id}
              onPress={() => router.push(`/course/${course.id}`)}
              accessibilityLabel={`${course.name}, ${pending} pending`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}
            >
              <CourseBadge courseId={course.id} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.textMuted }}>
                  {course.code} · {course.credits} cr
                </Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text }}>{course.name}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMuted }}>
                  {course.instructor} · {pending ? `${pending} pending` : 'all caught up'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <View style={{ flex: 1 }}>
                    <ProgressBar progress={list.length ? done / list.length : 0} color={courseColor(course.id).solid} trackColor={c.surfaceMuted} height={6} />
                  </View>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: c.textMuted }}>
                    {done}/{list.length} done
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={c.iconMuted} />
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
