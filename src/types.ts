export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export type CourseColorKey = 'teal' | 'violet' | 'coral' | 'amber' | 'blue';

export interface Student {
  name: string;
  firstName: string;
  rollNo: string;
  program: string;
  semester: number;
  initials: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  shortName: string;
  abbr: string;
  instructor: string;
  office: string;
  credits: number;
  color: CourseColorKey;
  description: string;
  attendance: number;
  grading: { label: string; weight: number }[];
}

export type SessionKind = 'Lecture' | 'Lab' | 'Tutorial';

export interface ClassSession {
  id: string;
  courseId: string;
  day: Weekday;
  start: string; // "HH:mm"
  end: string;
  kind: SessionKind;
  room: string;
  building: string;
  floor: number;
  topic?: string;
  directions?: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  courseId: string | null; // null = General
  dueAt: string; // ISO
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  sourceNoticeId?: string;
}

export type NoticeCategory = 'exam' | 'room' | 'workshop' | 'event' | 'general';

export interface Notice {
  id: string;
  title: string;
  body: string; // paragraphs separated by \n\n
  category: NoticeCategory;
  source: string;
  postedAt: string;
  courseId?: string;
  change?: { wasLabel: string; wasDetail: string; nowLabel: string; nowDetail: string };
}

export type ThemeMode = 'system' | 'light' | 'dark';
