import Feather from '@expo/vector-icons/Feather';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import { ProgressRing } from '@/components/ProgressRing';
import { confirm } from '@/lib/confirm';
import { WEEKDAYS } from '@/lib/dates';
import { getCourse, getTask, sessionsForCourse, todayWeekday, weekProgress } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function TaskDetailScreen() {
  const { c, courseColor } = useTheme();
  const now = useNow();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tasks = useAppStore((s) => s.tasks);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const task = getTask(tasks, id);
  const [justCompleted, setJustCompleted] = useState(false);
  const progress = useMemo(() => weekProgress(tasks, now), [tasks, now]);

  if (!task) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, padding: 20 }}>
        <BackButton />
        <EmptyState title="Task not found" body="It may have been deleted. Your other tasks are safe." />
      </SafeAreaView>
    );
  }

  const course = getCourse(task.courseId);
  const color = courseColor(task.courseId);
  const done = task.status === 'completed';
  const due = parseISO(task.dueAt);
  const daysLeft = differenceInCalendarDays(due, now);
  const overdue = !done && due < now;
  const ringLabel = done ? 'DONE' : overdue ? 'OVERDUE' : daysLeft === 0 ? 'TODAY' : `${daysLeft} DAY${daysLeft === 1 ? '' : 'S'} LEFT`;
  const ringTone = done ? c.success : overdue || daysLeft <= 1 ? c.danger : c.warningDot;

  // Next class for this course (today's later ones first, then the rest of the week).
  const todayIdx = WEEKDAYS.indexOf(todayWeekday(now) ?? 'Mon');
  const sessions = course ? sessionsForCourse(course.id) : [];
  const nextClass = sessions.find((s) => WEEKDAYS.indexOf(s.day) >= todayIdx) ?? sessions[0];

  const toggle = () => {
    setJustCompleted(!done);
    toggleTask(task.id);
  };

  const remove = () =>
    confirm('Delete task?', `"${task.title}" will be removed everywhere.`, 'Delete', () => {
      deleteTask(task.id);
      router.back();
    });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 12, gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackButton />
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.text }}>Task</Text>
          <IconButton icon="edit-2" accessibilityLabel="Edit task" onPress={() => router.push(`/task-form?id=${task.id}`)} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: color.soft }}>
            <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color.solid }} />
            <Text style={[type.pill, { color: color.ink }]}>{course ? `${course.code} · ${course.shortName}` : 'General'}</Text>
          </View>
          <Pill label={done ? 'Completed' : overdue ? 'Overdue' : 'Pending'} tone={done ? 'success' : overdue ? 'danger' : 'warning'} />
        </View>

        <Text
          accessibilityRole="header"
          style={{ fontFamily: fonts.heading, fontSize: 28, lineHeight: 33, color: done ? c.textMuted : c.text, textDecorationLine: done ? 'line-through' : 'none' }}
        >
          {task.title}
        </Text>

        {justCompleted && done ? (
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 14, borderRadius: 16, backgroundColor: c.successSoft }}>
            <Feather name="check-circle" size={20} color={c.successInk} />
            <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 13, color: c.successInk }}>
              Moved to Completed. Home progress is now {progress.done} of {progress.total}.
            </Text>
          </View>
        ) : null}

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <ProgressRing size={76} stroke={8} progress={done ? 1 : overdue ? 1 : Math.max(0.08, 1 - daysLeft / 7)} color={ringTone}>
            <Feather name={done ? 'check' : 'clock'} size={22} color={ringTone} />
          </ProgressRing>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[type.eyebrow, { color: ringTone }]}>{ringLabel}</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text }}>{format(due, 'EEE, d MMM · h:mm a')}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>
              {task.priority[0].toUpperCase() + task.priority.slice(1)} priority
            </Text>
          </View>
        </Card>

        {task.notes ? (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: c.text }}>What to do</Text>
            <Text style={[type.body, { fontSize: 15, lineHeight: 24, color: c.textSecondary }]}>{task.notes}</Text>
          </View>
        ) : null}

        {nextClass && course ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/class/${nextClass.id}`)}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 18, backgroundColor: c.primarySoft, opacity: pressed ? 0.85 : 1 })}
          >
            <Feather name="calendar" size={20} color={c.primary} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: c.primary }}>Next {course.code} class</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>
                {nextClass.day} · {nextClass.start} – {nextClass.end} · {nextClass.room}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={c.primary} />
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete task"
          onPress={remove}
          style={{ width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: c.danger }}
        >
          <Feather name="trash-2" size={22} color={c.danger} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={toggle}
          style={({ pressed }) => ({
            flex: 1,
            height: 56,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: done ? 'transparent' : c.primary,
            borderWidth: done ? 1.5 : 0,
            borderColor: c.border,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: done ? c.text : c.onPrimary }}>{done ? 'Reopen task' : 'Mark as complete'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
