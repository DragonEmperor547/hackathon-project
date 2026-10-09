# Campus Companion — Build Plan (4 hours)

## Team & ownership
| Person | Owns (files) |
|---|---|
| **P1 — Lead** | Project setup, `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `src/types.ts`, `src/data/*`, `src/store/*`, `src/lib/*`, `src/theme/*`, shared components, `settings.tsx`, README |
| **P2** | `(tabs)/index.tsx` (Home), `(tabs)/tasks.tsx`, `task/[id].tsx`, `task-form.tsx` |
| **P3** | `(tabs)/schedule.tsx`, `class/[id].tsx`, `(tabs)/courses.tsx`, `course/[id].tsx`, `(tabs)/notices.tsx`, `notice/[id].tsx` |
Two people: P1 also takes Notices + Notice detail after Phase 1.

## Git rules
- `main` always runs. Work on branches: `feat/foundation`, `feat/home-tasks`, `feat/schedule-courses`, `feat/notices`.
- Commit small and often; `git pull --rebase origin main` every 30–45 min.
- **Only P1 edits** `src/types.ts`, `src/store/*`, `src/theme/*`. Need a new action/token? Ask P1 in chat.
- One Claude Code session per person, working only on that person's files. Never two agents on one file.
- Merge to `main` via PR or fast-forward after `npx tsc --noEmit` passes and the app launches.

## Timeline
| Time | Phase |
|---|---|
| 0:00–0:15 | Read docs together, confirm ownership, everyone installs Expo Go and clones the repo |
| 0:15–0:50 | **Phase 1 — Foundation (P1)**. P2/P3 prepare prompts and review DESIGN.md for their screens |
| 0:50–2:20 | **Phase 2 — Screens in parallel** (P2, P3). P1 builds Settings + helps |
| 2:20 | Merge everything to `main` |
| 2:20–2:50 | **Phase 3 — Integration & connected-behavior testing** (checklist below). Bug fixes only |
| 2:50–3:25 | **Phase 4 — Enhancements**: task search/delete polish, dark mode check, notice → task |
| 3:25–3:40 | **Phase 5 — README + Reset demo + record video** |
| 3:40–4:00 | Buffer, verify repo public + video plays, submit |

---

## Phase 1 — Foundation (P1) — prompts for Claude Code
Run these one at a time; review each result.

**Prompt 1.1 — scaffold**
> Read CLAUDE.md and all files in docs/. Create a new Expo app in this folder with TypeScript and Expo Router (tabs template is fine, then clean it up). Install: zustand, @react-native-async-storage/async-storage, date-fns, react-native-svg, @expo/vector-icons, @expo-google-fonts/bricolage-grotesque, @expo-google-fonts/plus-jakarta-sans, expo-splash-screen, @react-native-community/datetimepicker, expo-haptics — using `npx expo install`. Create the folder structure from CLAUDE.md with placeholder screens that just show their title. Make sure `npx expo start` runs. Plan first.

**Prompt 1.2 — types, data, store**
> Implement src/types.ts, all files in src/data/, src/lib/ids.ts, src/lib/dates.ts, src/lib/selectors.ts and src/store/useAppStore.ts exactly as specified in docs/DATA_MODEL.md (mock values included). Seed task dates must be relative to today. Add a quick sanity check by logging nothing — instead show counts on the placeholder Home screen (classes today, pending tasks, unread notices) so we can see the data flows. Run `npx tsc --noEmit`.

**Prompt 1.3 — theme, layout, tabs, components**
> Implement src/theme (tokens + ThemeProvider + useTheme with light/dark/system from the store), load fonts in app/_layout.tsx and keep the splash screen until fonts are loaded AND the store has hydrated. Build the bottom tab layout per docs/DESIGN.md (active pill, Feather icons, Notices badge = live unread count). Then build the shared components every screen needs in src/components/ (Screen, ScreenHeader, BackButton, IconButton, Card, Pill, SectionHeader, CheckCircle, TaskRow, SegmentedControl, ChipGroup). The rest (ClassCard, MiniClassCard, CourseBadge, ProgressRing, ProgressBar, EmptyState, HeroCard, FloorMap, Fab) are built in Phase 2 by whoever needs them first, following DESIGN.md. Register stack screens: class/[id], course/[id], task/[id], task-form (modal), notice/[id], settings — all with headerShown: false.

✅ Push to `main` → tell the team. Everyone pulls.

## Phase 2 — Screens (parallel)
**P2 — Prompt 2.1 Home**
> Build app/(tabs)/index.tsx (Home) exactly per docs/SPEC.md §1 and the Home layout in docs/DESIGN.md, using the shared components and selectors. Everything must be live from the store (checkbox in "Due soon" completes the task in place). Handle weekends / no more classes today. Plan first, then implement, then verify the §1 acceptance criteria.

**P2 — Prompt 2.2 Tasks + form**
> Build app/(tabs)/tasks.tsx and app/task-form.tsx per SPEC §3 and DESIGN. Segmented Pending/Completed with live counts, optional course filter chips, Fab opens the modal form, form supports create and edit (?id=), validates empty title, uses DateTimePicker for date and time, calls router.back() after save. Use LayoutAnimation when toggling. Verify §3 acceptance criteria.

**P2 — Prompt 2.3 Task detail**
> Build app/task/[id].tsx per SPEC §4 and DESIGN: countdown ring, notes, related next class card, Delete with confirmation (then router.back()), Mark complete / Reopen with success banner, edit button → task-form?id=. Handle not-found id.

**P3 — Prompt 3.1 Schedule + Class detail**
> Build app/(tabs)/schedule.tsx and app/class/[id].tsx per SPEC §2 and §4 and DESIGN (week strip, timeline, done/next states for today; class hero in course colour, room & instructor tiles, FloorMap, topic, pending tasks for that course from the store, "Open course" button). Verify acceptance criteria.

**P3 — Prompt 3.2 Courses + Course detail**
> Build app/(tabs)/courses.tsx and app/course/[id].tsx per SPEC §5 and DESIGN (stat tiles, course cards with live pending counts and progress; detail hero, Classes/Tasks/About segments, grading bar). Content must differ per course. Verify acceptance criteria.

**P3 — Prompt 3.3 Notices + Notice detail**
> Build app/(tabs)/notices.tsx and app/notice/[id].tsx per SPEC §6 and DESIGN (back button on the tab screen, unread/read styles, filter chips, Mark all read; detail marks read on mount via useEffect, shows WAS→NOW card when `change` exists, "Add to tasks" button that creates a task linked to the notice and shows "Added to Tasks ✓"). Verify acceptance criteria.

**P1 — Prompt 1.4 Settings**
> Build app/settings.tsx per DESIGN (profile, Appearance System/Light/Dark bound to themeMode, Reset demo data with confirmation). Home avatar links here.

## Phase 3 — Integration test checklist (run on a real phone)
- [ ] Add a task due tomorrow → appears in Tasks (Pending), Home "Due soon", its Course detail → Tasks.
- [ ] Complete it from Home → ring and counts change; it's under Completed in Tasks; strikethrough on Course detail.
- [ ] Open Task detail → Mark complete → back → list already updated. Reopen works.
- [ ] Edit a task's title → list, Home, Course detail all show the new title.
- [ ] Delete a task → gone everywhere; no crash.
- [ ] Empty title cannot be saved.
- [ ] Schedule: each weekday shows the right classes; tapping a class opens THAT class.
- [ ] Two different courses show different classes, tasks, description, grading.
- [ ] Open an unread notice → marked read, badge and Home count drop; "Mark all read" clears badge.
- [ ] Every non-tab screen + Notices has a working back button.
- [ ] Kill the app and reopen → tasks and read state persist.
- [ ] Dark mode: every screen readable, no hard-coded white/black.
- [ ] `npx tsc --noEmit` clean; no yellow-box warnings during the demo path.

## Phase 4 — Enhancements (pick in order, stop at 3:25)
1. Task search (Tasks header search icon → TextInput filter by title).
2. Dark mode polish pass on all screens.
3. Notice → task (if not done in 3.3).
4. Focus timer on Task detail (25:00 countdown with start/pause) — only if everything else is solid.

## Phase 5 — README & demo
**Prompt 5.1**
> Write README.md: one-paragraph pitch, features list mapped to the 6 core areas, enhancements built, tech stack, how to run (Node LTS, `npm install`, `npx expo start`, scan QR with Expo Go; web preview works except the task date picker, which is native-only), project structure, data/persistence notes (mock data, AsyncStorage, Reset demo data in Settings), team members, and credits (fonts: Google Fonts OFL; icons: Feather via @expo/vector-icons).

Demo recording: reset demo data first, follow the storyline in SPEC.md, 3–5 minutes, one narrator.

## Submission checklist
- [ ] All 6 core areas built and navigable with realistic data
- [ ] Changes reflect across dashboard, lists and details
- [ ] Detail screens show the selected item; back keeps changes
- [ ] Edge cases: empty title, empty states, read/unread, not-found ids
- [ ] Enhancements fully working (persistence, dark mode, …)
- [ ] Third-party assets credited in README
- [ ] Repo public, README explains how to run
- [ ] Video 3–5 min, plays, covers key journeys
- [ ] Links double-checked
