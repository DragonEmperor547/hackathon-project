import { addDays, set, startOfDay, subDays } from 'date-fns';
import type { Priority, Task } from '@/types';

type Seed = [id: string, title: string, courseId: string, dueInDays: number, priority: Priority, done: boolean, notes: string];

const SEEDS: Seed[] = [
  ['t1', 'ER diagram for library DB', 'cs302', 1, 'high', false,
    'Draw the ER diagram for the library database: members, books, copies, loans and fines. Mark primary keys and cardinalities, then submit a PDF on the LMS.'],
  ['t2', 'Assignment 2: Build a Todo screen', 'cs311', 2, 'medium', false,
    'Build a Todo screen in React Native that adds, completes and deletes items. Use a FlatList and keep state in a store. Record a 1-minute screen capture.'],
  ['t3', 'Problem set 4', 'mt201', 4, 'low', false,
    'Questions 1–12 from chapter 4 on discrete random variables. Show all working and upload a scanned copy.'],
  ['t4', 'Quiz 3 prep: Navigation', 'cs311', 6, 'low', false,
    'Revise stack and tab navigation, route params and back behaviour. The quiz runs for 15 minutes at the end of the lecture.'],
  ['t5', 'Lab report: Process scheduling', 'cs305', -2, 'medium', true,
    'Simulate FCFS, SJF and Round Robin on the given workload and compare average waiting times. Include the Gantt charts.'],
  ['t6', 'Normalization worksheet', 'cs302', -3, 'medium', true,
    'Normalize the given hospital schema up to 3NF and justify each decomposition.'],
  ['t7', 'Essay outline: Tech ethics', 'hs210', -4, 'low', true,
    'One-page outline for the essay on ethics in software engineering: a thesis and three supporting arguments.'],
  ['t8', 'Assignment 1: Profile screen', 'cs311', -7, 'medium', true,
    'Build a profile screen with an avatar, name, bio and an edit button. Submit the Expo Snack link.'],
];

// Due dates are relative to today (23:59 local) so the demo never looks stale.
export function buildSeedTasks(now: Date): Task[] {
  const today = startOfDay(now);
  return SEEDS.map(([id, title, courseId, dueInDays, priority, done, notes]) => {
    const due = set(addDays(today, dueInDays), { hours: 23, minutes: 59 });
    return {
      id,
      title,
      notes,
      courseId,
      dueAt: due.toISOString(),
      priority,
      status: done ? 'completed' : 'pending',
      createdAt: subDays(today, 10).toISOString(),
      ...(done && { completedAt: subDays(due, 1).toISOString() }),
    };
  });
}
