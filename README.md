# Campus Companion

One calm place for a university student's academic day. Open the app and instantly see **what's next, what's due, and what changed on campus**. Every action (adding a task, ticking it off, reading a notice) shows up everywhere at once: the dashboard, lists, course pages and detail screens all read from one shared store.

Built for **Loopverse 3.0, Track A**.

## Features (the 6 core areas)
| Area | What you can do |
|---|---|
| **Home dashboard** | Date and greeting, next-class hero with a live countdown, weekly progress ring, pending / unread / classes-today counts, today's classes, and "Due soon" tasks you can tick off in place. |
| **Class schedule** | Mon–Fri week strip; a timeline for each day with done / now / next states for today. Tap a class to open it. |
| **Tasks** | Pending / Completed segments with live counts, weekly progress card, search by title, add and edit tasks (title, course, due date and time, priority, notes) with empty-title validation. |
| **Task & class detail** | Task: countdown ring, notes, next class for the course, mark complete / reopen, edit, delete with confirmation. Class: room, instructor, floor map with directions, today's topic, pending tasks for the course. Missing ids show a friendly "not found" screen. |
| **My courses** | Semester stats and course cards with live progress. Course detail has Classes / Tasks / About tabs (grading breakdown) and "Add task for this course". |
| **Campus notices** | Unread / read styles, filter chips, Mark all read, tab badge. Opening a notice marks it read; exam changes show a WAS → NOW card. |

## Enhancements
- **Persistence**: tasks, read notices and theme survive app restarts (Zustand persist + AsyncStorage).
- **Dark mode**: System / Light / Dark in Settings (gear icon on Home).
- **Notice → task**: "Add to Tasks" on a notice creates a linked task.
- **Task search** and **Reset demo data** (Settings).

## Tech stack
Expo SDK 57 · TypeScript (strict) · Expo Router · Zustand · AsyncStorage · date-fns · react-native-svg · Feather icons · Bricolage Grotesque + Plus Jakarta Sans.
No backend, no login: all data is mock data in `src/data/`.

## Run it
1. Install Node.js LTS and the **Expo Go** app on your phone.
2. `npm install`
3. `npx expo start`, then scan the QR code with Expo Go (Android) or the Camera app (iOS).

Web preview: `npx expo start --web`. On web, the due date and time are typed in (`YYYY-MM-DD` / `HH:mm`) because the native date picker is phone-only.

Checks: `npm run typecheck` and `npm run check` (date and selector logic).

## Project structure
```
app/            screens (Expo Router): (tabs)/ Home, Schedule, Tasks, Courses, Notices
                + class/[id], course/[id], task/[id], task-form, notice/[id], settings
src/data/       mock student, courses, class sessions, notices, seed tasks
src/store/      useAppStore: the single source of truth for everything that changes
src/lib/        selectors, date helpers, useNow (live clock)
src/theme/      colour tokens (light + dark), fonts, text styles, useTheme
src/components/ shared UI (cards, task rows, rings, hero, etc.)
docs/           spec, data model, design system, mockups
```

## Data & persistence
Seed task due dates are relative to today, so the demo never looks stale. After the first launch, your saved copy wins. **Settings → Reset demo data** restores the sample tasks and notices.

## Team
Ahsan Umer

## Credits
- Fonts: Bricolage Grotesque and Plus Jakarta Sans from Google Fonts (SIL Open Font License).
- Icons: Feather, via `@expo/vector-icons` (MIT).
