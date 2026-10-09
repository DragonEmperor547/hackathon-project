import { addDays, differenceInMinutes, format, startOfWeek } from 'date-fns';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { toTodayAt, WEEKDAYS } from '@/lib/dates';
import { classStatus, getCourse, sessionsForDay, todayWeekday } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Weekday } from '@/types';

export default function ScheduleScreen() {
  const { c, courseColor } = useTheme();
  const now = useNow();
  const today = todayWeekday(now);
  const [day, setDay] = useState<Weekday>(today ?? 'Mon');
  // On weekends the strip shows next week.
  const monday = useMemo(() => startOfWeek(addDays(now, today ? 0 : 2), { weekStartsOn: 1 }), [now, today]);
  const sessions = useMemo(() => sessionsForDay(day), [day]);
  const isToday = day === today;
  const date = addDays(monday, WEEKDAYS.indexOf(day));

  return (
    <Screen scroll>
      <ScreenHeader
        eyebrow="Week 6 · Fall 2026"
        title="Schedule"
        right={<Pill label={`${format(monday, 'd')}–${format(addDays(monday, 4), 'd MMM')}`} tone="primary" />}
      />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {WEEKDAYS.map((d, i) => {
          const selected = d === day;
          return (
            <Pressable
              key={d}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={format(addDays(monday, i), 'EEEE d MMMM')}
              onPress={() => setDay(d)}
              style={{
                flex: 1,
                height: 72,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                backgroundColor: selected ? c.primary : c.surface,
                borderWidth: 1,
                borderColor: selected ? c.primary : c.border,
              }}
            >
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: selected ? c.onPrimary : c.textMuted }}>{d}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 19, color: selected ? c.onPrimary : c.text }}>{format(addDays(monday, i), 'd')}</Text>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: d === today ? (selected ? c.onPrimary : c.primary) : 'transparent' }} />
            </Pressable>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={[type.section, { color: c.text }]}>
          {isToday ? 'Today · ' : ''}
          {format(date, 'EEEE')}
        </Text>
        <Text style={[type.meta, { color: c.textMuted }]}>
          {sessions.length ? `${sessions.length} classes · from ${sessions[0].start}` : 'No classes'}
        </Text>
      </View>

      {sessions.length ? (
        <View style={{ gap: 12 }}>
          {sessions.map((s) => {
            const course = getCourse(s.courseId);
            const status = isToday ? classStatus(s, now) : 'later';
            const done = status === 'done';
            const next = status === 'next' || status === 'now';
            const mins = differenceInMinutes(toTodayAt(s.day, s.start, now), now);
            const pill =
              status === 'done' ? { label: 'Done', tone: 'neutral' as const } :
              status === 'now' ? { label: 'Now', tone: 'success' as const } :
              status === 'next' ? { label: mins < 60 ? `Next · in ${mins} min` : 'Next', tone: 'primary' as const } : null;
            return (
              <View key={s.id} style={{ flexDirection: 'row', gap: 12, opacity: done ? 0.6 : 1 }}>
                <View style={{ width: 46, paddingTop: 14 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>{s.start}</Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>{s.end}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${course?.name}, ${s.kind}, ${s.start} to ${s.end}, ${s.room}`}
                  onPress={() => router.push(`/class/${s.id}`)}
                  style={({ pressed }) => ({
                    flex: 1,
                    gap: 6,
                    padding: next ? 13 : 14,
                    borderRadius: 18,
                    backgroundColor: c.surface,
                    borderWidth: next ? 2 : 1,
                    borderColor: next ? c.link : c.border,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: courseColor(s.courseId).solid }} />
                    <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 12, color: c.textMuted }}>
                      {course?.code} · {s.kind}
                    </Text>
                    {pill ? <Pill label={pill.label} tone={pill.tone} /> : null}
                  </View>
                  <Text style={[type.title, { color: c.text }]}>{course?.name}</Text>
                  <Text style={[type.meta, { fontFamily: fonts.regular, color: c.textMuted }]}>
                    {s.room}, {s.building} · {course?.instructor}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : (
        <EmptyState title="No classes" body="Nothing scheduled for this day." />
      )}
    </Screen>
  );
}
