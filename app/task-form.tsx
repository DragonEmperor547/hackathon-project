import Feather from '@expo/vector-icons/Feather';
import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addDays, format, isValid, parse, set, startOfDay } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { EmptyState } from '@/components/EmptyState';
import { COURSES } from '@/data/courses';
import { getTask } from '@/lib/selectors';
import { useAppStore } from '@/store/useAppStore';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Priority } from '@/types';

const PRIORITIES: { key: Priority; label: string }[] = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
];

const defaultDue = () => set(addDays(startOfDay(new Date()), 1), { hours: 23, minutes: 59 });

export default function TaskFormScreen() {
  const { c, scheme, courseColor } = useTheme();
  const params = useLocalSearchParams<{ id?: string; courseId?: string }>();
  const addTask = useAppStore((s) => s.addTask);
  const updateTask = useAppStore((s) => s.updateTask);
  // Read once: form fields are the one place local state may start from store data.
  const [existing] = useState(() => getTask(useAppStore.getState().tasks, params.id));
  const isEdit = !!params.id;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [courseId, setCourseId] = useState<string | null>(existing ? existing.courseId : (params.courseId ?? null));
  const [due, setDue] = useState(() => (existing ? new Date(existing.dueAt) : defaultDue()));
  const [priority, setPriority] = useState<Priority>(existing?.priority ?? 'medium');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [showError, setShowError] = useState(false);
  const [iosPicker, setIosPicker] = useState<'date' | 'time' | null>(null);

  const titleMissing = title.trim().length === 0;

  const save = () => {
    if (titleMissing) {
      setShowError(true);
      return;
    }
    const fields = { title: title.trim(), courseId, dueAt: due.toISOString(), priority, notes: notes.trim() || undefined };
    if (existing) updateTask(existing.id, fields);
    else addTask(fields);
    router.back();
  };

  const onPicked = (_: DateTimePickerEvent, picked?: Date) => {
    if (picked) setDue(picked);
  };

  const openPicker = (mode: 'date' | 'time') => {
    if (Platform.OS === 'android') DateTimePickerAndroid.open({ value: due, mode, onChange: onPicked });
    else setIosPicker(iosPicker === mode ? null : mode);
  };

  if (isEdit && !existing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.surface, padding: 20 }}>
        <BackButton variant="muted" />
        <EmptyState title="Task not found" body="It may have been deleted. Go back to your task list." />
      </SafeAreaView>
    );
  }

  const label = (text: string, extra?: string) => (
    <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>
      {text}
      {extra ? <Text style={{ fontFamily: fonts.medium, color: c.textMuted }}> {extra}</Text> : null}
    </Text>
  );

  const inputBox = {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: c.border,
    backgroundColor: c.inputBg,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: c.text,
  } as const;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.surface }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingTop: 12, gap: 18 }}>
          {Platform.OS === 'ios' ? (
            <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: c.grabber }} />
          ) : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <BackButton variant="muted" />
            <Text accessibilityRole="header" style={{ fontFamily: fonts.heading, fontSize: 20, color: c.text }}>
              {isEdit ? 'Edit task' : 'New task'}
            </Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={{ gap: 6 }}>
            {label('Title')}
            <TextInput
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (showError && t.trim()) setShowError(false);
              }}
              placeholder="e.g. Read chapter 5 notes"
              placeholderTextColor={c.textMuted}
              accessibilityLabel="Task title"
              returnKeyType="done"
              style={[inputBox, { height: 50, paddingHorizontal: 14 }, showError && { borderColor: c.danger }]}
            />
            {showError ? (
              <Text accessibilityLiveRegion="polite" style={{ fontFamily: fonts.semibold, fontSize: 12, color: c.danger }}>
                Give the task a title to save it.
              </Text>
            ) : null}
          </View>

          <View style={{ gap: 8 }}>
            {label('Course')}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {COURSES.map((course) => {
                const selected = course.id === courseId;
                return (
                  <Pressable
                    key={course.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${course.code} ${course.name}`}
                    // Tapping the selected course again clears it (task becomes "General").
                    onPress={() => setCourseId(selected ? null : course.id)}
                    hitSlop={2}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      height: 40,
                      paddingHorizontal: 12,
                      borderRadius: 999,
                      borderWidth: 1.5,
                      borderColor: selected ? c.text : c.border,
                      backgroundColor: selected ? c.bg : c.surface,
                    }}
                  >
                    <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: courseColor(course.id).solid }} />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>{course.code}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, gap: 6 }}>
              {label('Due date')}
              {Platform.OS === 'web' ? (
                <WebField value={format(due, 'yyyy-MM-dd')} pattern="yyyy-MM-dd" due={due} onChange={setDue} label="Due date, year-month-day" />
              ) : (
                <PickerField icon="calendar" text={format(due, 'EEE, d MMM yyyy')} onPress={() => openPicker('date')} label="Due date" />
              )}
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              {label('Time')}
              {Platform.OS === 'web' ? (
                <WebField value={format(due, 'HH:mm')} pattern="HH:mm" due={due} onChange={setDue} label="Due time, 24-hour" />
              ) : (
                <PickerField icon="clock" text={format(due, 'h:mm a')} onPress={() => openPicker('time')} label="Due time" />
              )}
            </View>
          </View>
          {iosPicker ? (
            <DateTimePicker value={due} mode={iosPicker} display="spinner" onChange={onPicked} themeVariant={scheme} />
          ) : null}

          <View style={{ gap: 8 }}>
            {label('Priority')}
            <View style={{ flexDirection: 'row', padding: 4, gap: 4, borderRadius: 14, backgroundColor: c.surfaceMuted }}>
              {PRIORITIES.map((p) => {
                const selected = p.key === priority;
                const dot = { low: c.iconMuted, medium: c.warningDot, high: c.danger }[p.key];
                return (
                  <Pressable
                    key={p.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${p.label} priority`}
                    onPress={() => setPriority(p.key)}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      backgroundColor: selected ? c.surface : 'transparent',
                    }}
                  >
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dot }} />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: selected ? c.text : c.textSecondary }}>{p.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ gap: 6 }}>
            {label('Notes', '(optional)')}
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Links, page numbers, group members…"
              placeholderTextColor={c.textMuted}
              accessibilityLabel="Notes"
              multiline
              textAlignVertical="top"
              style={[inputBox, { minHeight: 80, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, fontSize: 14 }]}
            />
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingBottom: 10, paddingTop: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: titleMissing }}
            onPress={save}
            style={({ pressed }) => ({
              height: 56,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: c.primary,
              opacity: titleMissing ? 0.45 : pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.onPrimary }}>{isEdit ? 'Save changes' : 'Save task'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PickerField(props: { icon: ComponentProps<typeof Feather>['name']; text: string; onPress: () => void; label: string }) {
  const { c } = useTheme();
  return (
    <FieldShell>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${props.label}: ${props.text}`}
        onPress={props.onPress}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}
      >
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: c.text }}>{props.text}</Text>
        <Feather name={props.icon} size={18} color={c.text} />
      </Pressable>
    </FieldShell>
  );
}

/** Web has no native picker: a plain text field that updates the date once the text parses. */
function WebField(props: { value: string; pattern: string; due: Date; onChange: (d: Date) => void; label: string }) {
  const { c } = useTheme();
  const [text, setText] = useState(props.value);
  return (
    <FieldShell>
      <TextInput
        value={text}
        accessibilityLabel={props.label}
        onChangeText={(t) => {
          setText(t);
          const parsed = parse(t, props.pattern, props.due);
          if (isValid(parsed)) props.onChange(parsed);
        }}
        style={{ flex: 1, paddingHorizontal: 12, fontFamily: fonts.regular, fontSize: 14, color: c.text }}
      />
    </FieldShell>
  );
}

function FieldShell({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: c.border, backgroundColor: c.inputBg }}>{children}</View>
  );
}
