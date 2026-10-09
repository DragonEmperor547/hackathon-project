import { addDays, differenceInMinutes, parseISO, startOfDay } from 'date-fns';
import { COURSES } from '@/data/courses';
import { NOTICES } from '@/data/notices';
import { SESSIONS } from '@/data/sessions';
import { atTime, toTodayAt, WEEKDAYS } from '@/lib/dates';
import type { ClassSession, Task, Weekday } from '@/types';

// Pure helpers. Select raw store values, then call these inside useMemo.

const byStart = (a: ClassSession, b: ClassSession) => a.start.localeCompare(b.start);

export const getCourse = (id: string | null | undefined) => COURSES.find((c) => c.id === id);
export const getSession = (id: string | undefined) => SESSIONS.find((s) => s.id === id);
export const getNotice = (id: string | undefined) => NOTICES.find((n) => n.id === id);
export const getTask = (tasks: Task[], id: string | undefined) => tasks.find((t) => t.id === id);

export const sessionsForDay = (day: Weekday) => SESSIONS.filter((s) => s.day === day).sort(byStart);

export const sessionsForCourse = (courseId: string) =>
  SESSIONS.filter((s) => s.courseId === courseId).sort(
    (a, b) => WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day) || byStart(a, b),
  );

export function todayWeekday(now: Date): Weekday | null {
  const d = now.getDay(); // 0 = Sun
  return d >= 1 && d <= 5 ? WEEKDAYS[d - 1] : null;
}

export type ClassStatus = 'done' | 'now' | 'next' | 'later';

/** Only meaningful for today's sessions. */
export function classStatus(session: ClassSession, now: Date): ClassStatus {
  if (now >= toTodayAt(session.day, session.end, now)) return 'done';
  if (now >= toTodayAt(session.day, session.start, now)) return 'now';
  const next = sessionsForDay(session.day).find((s) => toTodayAt(s.day, s.start, now) > now);
  return next?.id === session.id ? 'next' : 'later';
}

export interface NextClass {
  session: ClassSession;
  startsInMin: number;
  isToday: boolean;
  isNow: boolean;
}

/** The class in progress or the next one, looking ahead up to a week. */
export function getNextClass(now: Date): NextClass | null {
  for (let i = 0; i <= 7; i++) {
    const date = addDays(startOfDay(now), i);
    const day = todayWeekday(date);
    if (!day) continue;
    for (const session of sessionsForDay(day)) {
      const start = atTime(date, session.start);
      if (now >= atTime(date, session.end)) continue;
      return {
        session,
        startsInMin: Math.max(0, differenceInMinutes(start, now)),
        isToday: i === 0,
        isNow: now >= start,
      };
    }
  }
  return null;
}

export const pendingTasks = (tasks: Task[]) =>
  tasks.filter((t) => t.status === 'pending').sort((a, b) => a.dueAt.localeCompare(b.dueAt));

export const completedTasks = (tasks: Task[]) =>
  tasks
    .filter((t) => t.status === 'completed')
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Pending tasks that are overdue or due within the next 7 days. */
export const dueSoon = (tasks: Task[], now: Date, limit = 3) =>
  pendingTasks(tasks)
    .filter((t) => parseISO(t.dueAt).getTime() - now.getTime() <= WEEK_MS)
    .slice(0, limit);

/** Tasks due within ±7 days of now (rolling, so "this week" reads the same on any demo day). */
export function weekProgress(tasks: Task[], now: Date) {
  const inWindow = tasks.filter((t) => Math.abs(parseISO(t.dueAt).getTime() - now.getTime()) <= WEEK_MS);
  const done = inWindow.filter((t) => t.status === 'completed').length;
  const total = inWindow.length;
  return { done, total, pct: total ? done / total : 0 };
}

export const tasksForCourse = (tasks: Task[], courseId: string) => tasks.filter((t) => t.courseId === courseId);

export const isUnread = (id: string, readIds: string[]) => !readIds.includes(id);
export const unreadCount = (readIds: string[]) => NOTICES.filter((n) => isUnread(n.id, readIds)).length;
