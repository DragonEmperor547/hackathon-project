# Campus Companion — Data Model, Store & Mock Data

## Principles
- **Static data** (never changes at runtime): student, courses, class sessions, notices → `src/data/*.ts`, imported directly.
- **Mutable data** (user changes it): tasks, which notices are read, settings → Zustand store, persisted to AsyncStorage.
- Mock files are the *seed*. First launch: store starts from seed. After that, the persisted copy wins.
- Only persist mutable data (`partialize`), so edits to static mock files show up immediately during the hackathon.
- All dates/times are **ISO strings** (`"2026-10-11T23:59:00.000Z"`) or `"HH:mm"` strings. Never store `Date` objects.

## `src/types.ts`
```ts
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export type CourseColorKey = 'teal' | 'violet' | 'coral' | 'amber' | 'blue';

export interface Student {
  name: string;          // "Hamza Ali"
  firstName: string;     // "Hamza"
  rollNo: string;        // "22K-4517"
  program: string;       // "BS Computer Science"
  semester: number;      // 5
  initials: string;      // "HA"
}

export interface Course {
  id: string;            // "cs311"
  code: string;          // "CS-311"
  name: string;          // "Mobile App Development"
  shortName: string;     // "Mobile App Dev"
  abbr: string;          // "MA" (badge initials)
  instructor: string;
  office: string;        // "Room 210, CS Block · Thu 2–4 PM"
  credits: number;
  color: CourseColorKey;
  description: string;
  attendance: number;    // percent, mock
  grading: { label: string; weight: number }[]; // sums to 100
}

export type SessionKind = 'Lecture' | 'Lab' | 'Tutorial';

export interface ClassSession {
  id: string;            // "s-fri-cs311"
  courseId: string;
  day: Weekday;
  start: string;         // "10:00"
  end: string;           // "11:30"
  kind: SessionKind;
  room: string;          // "Lab 3"
  building: string;      // "CS Block"
  floor: number;         // 2
  topic?: string;        // "State management with Zustand"
  directions?: string;   // "Take the main stairs, last door on the right."
}

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  courseId: string | null;   // null = General
  dueAt: string;             // ISO
  priority: Priority;
  status: TaskStatus;
  createdAt: string;         // ISO
  completedAt?: string;      // ISO, set when completed, removed when reopened
  sourceNoticeId?: string;   // set when created from a notice
}

export type NoticeCategory = 'exam' | 'room' | 'workshop' | 'event' | 'general';

export interface Notice {
  id: string;
  title: string;
  body: string;              // full message, paragraphs separated by \n\n
  category: NoticeCategory;
  source: string;            // "Examinations Office"
  postedAt: string;          // ISO
  courseId?: string;
  change?: { wasLabel: string; wasDetail: string; nowLabel: string; nowDetail: string };
}

export type ThemeMode = 'system' | 'light' | 'dark';
```

## `src/store/useAppStore.ts`
```ts
interface AppState {
  tasks: Task[];
  readNoticeIds: string[];
  themeMode: ThemeMode;
  hasHydrated: boolean;

  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'status' | 'completedAt'>) => string; // returns id
  updateTask: (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  toggleTask: (id: string) => void;      // pending <-> completed, sets/clears completedAt
  deleteTask: (id: string) => void;
  markNoticeRead: (id: string) => void;  // no-op if already read (avoid needless re-renders)
  markAllNoticesRead: () => void;
  setThemeMode: (m: ThemeMode) => void;
  resetDemo: () => void;                 // tasks = buildSeedTasks(new Date()), readNoticeIds = SEED_READ_IDS
}
```
Persist config:
```ts
persist(..., {
  name: 'campus-companion',                    // never rename: that wipes saved data
  version: 1,                                  // bump when the persisted shape changes
  migrate: (persisted, from) => persisted,     // give old saves defaults for new fields
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (s) => ({ tasks: s.tasks, readNoticeIds: s.readNoticeIds, themeMode: s.themeMode }),
  onRehydrateStorage: () => () => useAppStore.setState({ hasHydrated: true }),
})
```
- **Adding mutable data later:** add the field + actions, add it to `partialize`, bump `version`, and default it in `migrate` (e.g. `if (from < 2) p.attendance = {}`).
- **New fields on existing types are always optional** (`field?:`) so older saved data stays valid.
- Root layout shows the splash screen until `hasHydrated && fontsLoaded`.
- IDs: `src/lib/ids.ts` → `` `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}` ``.
- New tasks are prepended; lists sort by `dueAt` anyway.

## `src/lib/selectors.ts` (pure functions — use with `useMemo`)
```ts
getCourse(id): Course | undefined
getSession(id): ClassSession | undefined
sessionsForDay(day: Weekday): ClassSession[]            // sorted by start
sessionsForCourse(courseId): ClassSession[]             // sorted Mon→Fri, start
todayWeekday(now): Weekday | null                       // null on Sat/Sun
classStatus(session, now): 'done' | 'now' | 'next' | 'later'   // only meaningful for today
getNextClass(now): { session, startsInMin, isToday, isNow } | null   // looks ahead into next days
pendingTasks(tasks) / completedTasks(tasks)             // pending sorted by dueAt asc, completed by completedAt desc
dueSoon(tasks, now, limit = 3)                          // pending, sorted by dueAt
weekProgress(tasks, now): { done, total, pct }          // tasks due within ±7 days of now (rolling window, so seed data reads "4 of 8" any day)
tasksForCourse(tasks, courseId)
unreadCount(readIds) / isUnread(id, readIds)
```
`src/lib/dates.ts`:
```ts
formatDue(dueAt, now): { label: string; tone: 'danger' | 'warning' | 'neutral' }
//   overdue → "Overdue" danger · today → "Today" danger · tomorrow → "Tomorrow" danger
//   ≤3 days → "In N days" warning · ≤6 days → weekday "Tue" neutral · else "12 Oct" neutral
formatRelative(iso, now)     // "2h ago", "Yesterday", "6 Oct"
greeting(now)                // "Good morning" / "Good afternoon" / "Good evening"
toTodayAt(day: Weekday, hhmm, now): Date   // for countdowns
```
`src/lib/useNow.ts`: `useNow(intervalMs = 60_000): Date` re-renders every minute so "in 25 min", "Now" and done/next states stay live. Use it on Home, Schedule, Class detail and Task detail instead of calling `new Date()` in render.

## Mock data (write to `src/data/`)
Use these exact values so the app matches the mockups.

### `student.ts`
Hamza Ali · firstName "Hamza" · 22K-4517 · BS Computer Science · Semester 5 · initials "HA".

### `courses.ts`
| id | code | name (shortName) | abbr | instructor | office | cr | color | attendance |
|---|---|---|---|---|---|---|---|---|
| cs311 | CS-311 | Mobile App Development (Mobile App Dev) | MA | Dr. Sana Iqbal | Room 210, CS Block · Thu 2–4 PM | 3 | teal | 92 |
| cs302 | CS-302 | Database Systems (Database Systems) | DB | Mr. Usman Tariq | Room 118, CS Block · Mon 3–4 PM | 4 | violet | 88 |
| cs305 | CS-305 | Operating Systems (Operating Systems) | OS | Dr. Farhan Ahmed | Room 204, EE Block · Wed 1–2 PM | 3 | coral | 95 |
| mt201 | MT-201 | Probability & Statistics (Probability & Stats) | PS | Ms. Hira Saleem | Room 07, Main Block · Tue 3–4 PM | 3 | amber | 84 |
| hs210 | HS-210 | Technical Writing (Technical Writing) | TW | Ms. Mahnoor Raza | Room 112, Main Block · Fri 12–1 PM | 3 | blue | 100 |

Descriptions (1–2 sentences each, course-specific). Grading:
- cs311: Assignments 20, Quizzes 10, Midterm 30, Final project 40
- cs302: Assignments 15, Lab 20, Midterm 25, Final 40
- cs305: Assignments 15, Quizzes 15, Midterm 30, Final 40
- mt201: Problem sets 20, Quizzes 20, Midterm 25, Final 35
- hs210: Essays 40, Presentations 20, Participation 10, Final portfolio 30

### `sessions.ts` (14 sessions)
| day | course | start–end | kind | room · building · floor |
|---|---|---|---|---|
| Mon | cs305 | 08:30–10:00 | Lecture | Room 101 · Main Block · 1 |
| Mon | cs302 | 11:00–12:30 | Lecture | Room 204 · CS Block · 2 |
| Mon | hs210 | 14:00–15:00 | Lecture | Room 112 · Main Block · 1 |
| Tue | cs311 | 10:00–11:30 | Lecture | Lab 3 · CS Block · 2 |
| Tue | mt201 | 13:00–14:30 | Lecture | Room 305 · Main Block · 3 |
| Wed | cs305 | 08:30–10:00 | Lecture | Room 101 · Main Block · 1 |
| Wed | cs302 | 11:00–12:30 | Lecture | Room 204 · CS Block · 2 |
| Wed | cs302 | 14:00–16:00 | Lab | DB Lab 1 · CS Block · 1 |
| Thu | cs311 | 09:00–11:00 | Lab | Lab 3 · CS Block · 2 |
| Thu | hs210 | 12:00–13:00 | Tutorial | Room 112 · Main Block · 1 |
| Fri | cs305 | 08:30–10:00 | Lecture | Room 101 · Main Block · 1 |
| Fri | cs311 | 10:00–11:30 | Lecture | Lab 3 · CS Block · 2 |
| Fri | mt201 | 13:00–14:30 | Lecture | Room 305 · Main Block · 3 |
| Fri | hs210 | 15:00–16:00 | Tutorial | Room 112 · Main Block · 1 |

Give each a short `topic` (e.g. Fri cs311: "State management with Zustand") and `directions` (e.g. "Take the main stairs; Lab 3 is the last door on the right.").

### `seedTasks.ts` — `buildSeedTasks(now: Date): Task[]`
Due dates are **relative to today** so the demo never looks stale (`addDays(startOfDay(now), n)` at 23:59, local).
| id | title | course | due (days from today) | priority | status |
|---|---|---|---|---|---|
| t1 | ER diagram for library DB | cs302 | +1 | high | pending |
| t2 | Assignment 2: Build a Todo screen | cs311 | +2 | medium | pending |
| t3 | Problem set 4 | mt201 | +4 | low | pending |
| t4 | Quiz 3 prep: Navigation | cs311 | +6 | low | pending |
| t5 | Lab report: Process scheduling | cs305 | −2 | medium | completed |
| t6 | Normalization worksheet | cs302 | −3 | medium | completed |
| t7 | Essay outline: Tech ethics | hs210 | −4 | low | completed |
| t8 | Assignment 1: Profile screen | cs311 | −7 | medium | completed |
Give every task realistic `notes` (t2: "Build a Todo screen in React Native that adds, completes and deletes items. Use a FlatList and keep state in a store. Record a 1-minute screen capture.").
Completed tasks get `completedAt` = due date − 1 day.

### `notices.ts` (6 notices) + `SEED_READ_IDS = ['n3','n4','n5','n6']` (so 2 unread)
| id | category | title | source | posted |
|---|---|---|---|---|
| n1 | exam | Midterm revised: OS paper moved to Fri, 16 Oct | Examinations Office | 2h ago |
| n2 | room | CS-302 Database Systems moves to Room 204 from Monday | Academic Office | 5h ago |
| n3 | workshop | React Native & Flutter workshop on Sat, 17 Oct | ACM Student Chapter | 1 day ago |
| n4 | general | Library open till 10 PM during exam week | Central Library | 3 days ago |
| n5 | event | Career fair on 20 Oct in the Main Auditorium | Career Services | 4 days ago |
| n6 | exam | Quiz week schedule published on the LMS | Examinations Office | 6 days ago |
`postedAt` relative to now at module load is fine. n1 has `courseId: 'cs305'` and `change: { wasLabel: 'Wed, 14 Oct', wasDetail: 'Exam Hall B', nowLabel: 'Fri, 16 Oct', nowDetail: '9:00 AM · Exam Hall A' }`. Write 2 short paragraphs of body text for each.

## Connected-behavior map (why this design works)
| Action | Store change | Screens that update automatically |
|---|---|---|
| Add task | `tasks` | Tasks, Home (due soon, ring, counts), Course detail, Class detail "pending" |
| Complete / reopen | `tasks[i].status` | same as above + Task detail |
| Delete task | `tasks` | same; Task detail shows "not found" if revisited |
| Open notice | `readNoticeIds` | Notices list, tab badge, Home bell dot + count |
| Mark all read | `readNoticeIds` | same |
| Theme mode | `themeMode` | every screen |
| Reset demo | everything mutable | everything |
