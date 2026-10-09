import {
  addDays,
  differenceInCalendarDays,
  differenceInMinutes,
  format,
  parseISO,
  set,
  startOfWeek,
} from 'date-fns';
import type { Weekday } from '@/types';

export const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export type DueTone = 'danger' | 'warning' | 'neutral';

export function formatDue(dueAt: string, now: Date): { label: string; tone: DueTone } {
  const due = parseISO(dueAt);
  if (due < now) return { label: 'Overdue', tone: 'danger' };
  const days = differenceInCalendarDays(due, now);
  if (days === 0) return { label: 'Today', tone: 'danger' };
  if (days === 1) return { label: 'Tomorrow', tone: 'danger' };
  if (days <= 3) return { label: `In ${days} days`, tone: 'warning' };
  if (days <= 6) return { label: format(due, 'EEE'), tone: 'neutral' };
  return { label: format(due, 'd MMM'), tone: 'neutral' };
}

export function formatRelative(iso: string, now: Date): string {
  const date = parseISO(iso);
  const mins = differenceInMinutes(now, date);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const days = differenceInCalendarDays(now, date);
  if (days === 0) return `${Math.floor(mins / 60)}h ago`;
  if (days === 1) return 'Yesterday';
  return format(date, 'd MMM');
}

export function greeting(now: Date): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** "HH:mm" on a given date. */
export function atTime(date: Date, hhmm: string): Date {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
}

/** That weekday of the current Mon–Sun week at "HH:mm" (for countdowns). */
export function toTodayAt(day: Weekday, hhmm: string, now: Date): Date {
  const monday = startOfWeek(now, { weekStartsOn: 1 });
  return atTime(addDays(monday, WEEKDAYS.indexOf(day)), hhmm);
}
