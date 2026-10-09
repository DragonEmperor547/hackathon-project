# Campus Companion — Claude Code Instructions

You are helping a 2–3 person team build **Campus Companion** (Track A, Loopverse 3.0 hackathon) in **4 hours**.
A mobile app that gives a university student ONE place to manage their academic day: classes, tasks, courses and campus notices.

Read these before writing code (they are the source of truth):
- @docs/SPEC.md — features, screens, acceptance criteria (what judges check)
- @docs/DATA_MODEL.md — types, store, mock data, selectors
- @docs/DESIGN.md — theme tokens, typography, components, screen layouts
- @docs/BUILD_PLAN.md — phases, ownership, git rules, test checklist

## Guiding principle
**A smooth, working, connected core beats a long list of half-finished features.**
Finish and polish all 6 mandatory areas before touching any optional enhancement.

## Stack (do not swap without asking)
- Expo (latest SDK) + TypeScript (strict) + **Expo Router** (file-based, tabs + stack)
- **Zustand** + `persist` middleware + `@react-native-async-storage/async-storage`
- `date-fns` for dates, `react-native-svg` for rings/graphics
- `@expo/vector-icons` → **Feather** icon set only (matches the stroke-style mockups)
- Fonts: `@expo-google-fonts/bricolage-grotesque` (headings) + `@expo-google-fonts/plus-jakarta-sans` (body)
- `@react-native-community/datetimepicker` for the task due date
- No backend, no auth, no network calls. Mock data only.

Install packages with `npx expo install <pkg>` (keeps versions compatible with the SDK).

## Golden rules (non-negotiable)
1. **One source of truth.** ALL mutable data (tasks, notice read state, settings) lives in `src/store/useAppStore.ts`.
   Static data (student, courses, class sessions, notices) is imported from `src/data/*`.
2. **Screens never copy store data into local state** (`useState(task)` is forbidden). Form inputs are the only exception.
3. **Navigate with IDs only:** `router.push(\`/task/${id}\`)`. Detail screens look the item up from the store / data by id.
   Handle "not found" (e.g. the task was deleted) with a friendly message + back button.
4. **No derived arrays inside the Zustand selector.** `useAppStore(s => s.tasks.filter(...))` causes infinite re-renders.
   Select raw values, then derive with `useMemo` or use helpers from `src/lib/selectors.ts`.
5. **Dates are ISO strings** in data and store. Parse with `date-fns` (`parseISO`) only when computing/displaying.
6. **Colors come from the theme** (`useTheme()`), never hard-coded hex in screens. Course colors come from `courseColor(courseId, scheme)`.
7. **Every screen except tab roots has a back button** (`<BackButton />` → `router.back()`, falls back to `/` when `!router.canGoBack()`). The Notices tab also shows a back button.
8. Keep files small and owned: one screen per file in `app/`, shared UI in `src/components/`. Don't edit files outside your task's scope; never change `src/types.ts` or the store shape unless the task says so.
9. Touch targets ≥ 44px, real `Pressable`s with `accessibilityRole` and `accessibilityLabel` on icon-only buttons.
10. No `console.log` left behind, no TODO stubs on core screens, no lorem ipsum.

## Folder structure
```
app/
  _layout.tsx            # root Stack, fonts, hydration gate, ThemeProvider
  (tabs)/_layout.tsx     # bottom tabs: Home, Schedule, Tasks, Courses, Notices (+unread badge)
  (tabs)/index.tsx       # Home dashboard
  (tabs)/schedule.tsx
  (tabs)/tasks.tsx
  (tabs)/courses.tsx
  (tabs)/notices.tsx
  class/[id].tsx         # Class detail
  course/[id].tsx        # Course detail
  task/[id].tsx          # Task detail
  task-form.tsx          # Add / edit task (modal). ?id=<taskId> → edit mode
  notice/[id].tsx        # Notice detail (marks read on open)
  settings.tsx           # Profile + dark mode + "Reset demo data"
src/
  types.ts
  data/student.ts courses.ts sessions.ts notices.ts seedTasks.ts
  store/useAppStore.ts
  lib/selectors.ts dates.ts ids.ts
  theme/tokens.ts ThemeProvider.tsx
  components/*.tsx
```

## Definition of done for any screen
- Matches DESIGN.md layout and uses theme tokens (works in light AND dark).
- Reads from the store/data; changes made elsewhere appear instantly.
- Back navigation preserves every change.
- Empty states handled (no tasks, no classes today, all notices read).
- No TypeScript errors (`npx tsc --noEmit`), no red screens.

## How to work
- For any non-trivial task: **propose a short plan first**, then implement.
- After implementing, verify against the relevant acceptance criteria in SPEC.md and the checklist in BUILD_PLAN.md, and say what you checked.
- Prefer simple, readable code over clever abstractions. This is a 4-hour build.
- Commit messages: `feat(tasks): add pending/completed toggle` style.
