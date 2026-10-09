import { router } from 'expo-router';
import { LayoutAnimation, Pressable, Text, View } from 'react-native';
import { formatDue } from '@/lib/dates';
import { getCourse } from '@/lib/selectors';
import { useAppStore } from '@/store/useAppStore';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Task } from '@/types';
import { CheckCircle } from './CheckCircle';
import { Pill } from './Pill';

interface Props {
  task: Task;
  now: Date;
  /** card = own bordered card (Tasks, Course detail); inline = row inside a shared card (Home due soon). */
  variant?: 'card' | 'inline';
  /** inline only: draw the divider below this row. */
  divider?: boolean;
}

export function TaskRow({ task, now, variant = 'card', divider }: Props) {
  const { c, courseColor } = useTheme();
  const toggleTask = useAppStore((s) => s.toggleTask);
  const done = task.status === 'completed';
  const course = getCourse(task.courseId);
  const due = done ? { label: 'Done', tone: 'success' as const } : formatDue(task.dueAt, now);
  const isCard = variant === 'card';

  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
        isCard && { borderRadius: 18, borderWidth: 1, borderColor: c.border, backgroundColor: done ? c.surfaceMuted : c.surface },
        divider && { borderBottomWidth: 1, borderBottomColor: c.divider },
      ]}
    >
      <CheckCircle
        checked={done}
        label={task.title}
        size={isCard ? 24 : 22}
        onToggle={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          toggleTask(task.id);
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open task ${task.title}`}
        onPress={() => router.push(`/task/${task.id}`)}
        style={({ pressed }) => ({ flex: 1, minWidth: 0, gap: isCard ? 5 : 3, opacity: pressed ? 0.85 : 1 })}
      >
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.bold,
            fontSize: isCard ? 15 : 14,
            color: done ? c.textMuted : c.text,
            textDecorationLine: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {isCard ? <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: courseColor(task.courseId).solid }} /> : null}
          <Text numberOfLines={1} style={[type.meta, { fontFamily: fonts.regular, color: c.textMuted, flexShrink: 1 }]}>
            {course ? `${course.code} · ${course.shortName}` : 'General'}
          </Text>
        </View>
      </Pressable>
      <Pill label={due.label} tone={due.tone} />
    </View>
  );
}
