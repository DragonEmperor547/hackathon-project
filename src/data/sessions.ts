import type { ClassSession } from '@/types';

const ROOM_101 = { room: 'Room 101', building: 'Main Block', floor: 1, directions: 'Enter through the main gate; Room 101 is the first door left of reception.' };
const ROOM_112 = { room: 'Room 112', building: 'Main Block', floor: 1, directions: 'From reception turn right; Room 112 is at the end of the corridor, next to the notice board.' };
const ROOM_305 = { room: 'Room 305', building: 'Main Block', floor: 3, directions: 'Take the central stairs or the lift to the third floor; Room 305 faces the stairs.' };
const ROOM_204 = { room: 'Room 204', building: 'CS Block', floor: 2, directions: 'Take the CS Block stairs to the second floor; Room 204 is the third door on the left.' };
const LAB_3 = { room: 'Lab 3', building: 'CS Block', floor: 2, directions: 'Take the main stairs, Lab 3 is the last door on the right.' };
const DB_LAB_1 = { room: 'DB Lab 1', building: 'CS Block', floor: 1, directions: 'Enter the CS Block ground floor; DB Lab 1 is straight ahead past the vending machines.' };

export const SESSIONS: ClassSession[] = [
  { id: 's-mon-cs305', courseId: 'cs305', day: 'Mon', start: '08:30', end: '10:00', kind: 'Lecture', ...ROOM_101, topic: 'Process scheduling: FCFS, SJF and Round Robin' },
  { id: 's-mon-cs302', courseId: 'cs302', day: 'Mon', start: '11:00', end: '12:30', kind: 'Lecture', ...ROOM_204, topic: 'Functional dependencies and normal forms' },
  { id: 's-mon-hs210', courseId: 'hs210', day: 'Mon', start: '14:00', end: '15:00', kind: 'Lecture', ...ROOM_112, topic: 'Writing clear user documentation' },
  { id: 's-tue-cs311', courseId: 'cs311', day: 'Tue', start: '10:00', end: '11:30', kind: 'Lecture', ...LAB_3, topic: 'Navigation with Expo Router' },
  { id: 's-tue-mt201', courseId: 'mt201', day: 'Tue', start: '13:00', end: '14:30', kind: 'Lecture', ...ROOM_305, topic: 'Discrete random variables' },
  { id: 's-wed-cs305', courseId: 'cs305', day: 'Wed', start: '08:30', end: '10:00', kind: 'Lecture', ...ROOM_101, topic: 'Threads and concurrency' },
  { id: 's-wed-cs302', courseId: 'cs302', day: 'Wed', start: '11:00', end: '12:30', kind: 'Lecture', ...ROOM_204, topic: 'SQL joins and subqueries' },
  { id: 's-wed-cs302-lab', courseId: 'cs302', day: 'Wed', start: '14:00', end: '16:00', kind: 'Lab', ...DB_LAB_1, topic: 'Building the library schema in PostgreSQL' },
  { id: 's-thu-cs311-lab', courseId: 'cs311', day: 'Thu', start: '09:00', end: '11:00', kind: 'Lab', ...LAB_3, topic: 'Lists, forms and local storage' },
  { id: 's-thu-hs210', courseId: 'hs210', day: 'Thu', start: '12:00', end: '13:00', kind: 'Tutorial', ...ROOM_112, topic: 'Peer review of essay outlines' },
  { id: 's-fri-cs305', courseId: 'cs305', day: 'Fri', start: '08:30', end: '10:00', kind: 'Lecture', ...ROOM_101, topic: 'Synchronization: mutexes and semaphores' },
  { id: 's-fri-cs311', courseId: 'cs311', day: 'Fri', start: '10:00', end: '11:30', kind: 'Lecture', ...LAB_3, topic: 'State management with Zustand' },
  { id: 's-fri-mt201', courseId: 'mt201', day: 'Fri', start: '13:00', end: '14:30', kind: 'Lecture', ...ROOM_305, topic: 'The binomial and Poisson distributions' },
  { id: 's-fri-hs210', courseId: 'hs210', day: 'Fri', start: '15:00', end: '16:00', kind: 'Tutorial', ...ROOM_112, topic: 'Structuring a technical report' },
];
