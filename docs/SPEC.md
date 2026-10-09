# Campus Companion — Product Spec

## Problem
University students juggle classes, deadlines and campus updates across WhatsApp groups, LMS portals, notice boards and personal notes. Important tasks slip and the day is hard to organize.

## Vision
One calm, fast place for a student's academic day. Open the app → instantly know **what's next, what's due, and what changed on campus**. Every action (adding, completing, reading) is reflected everywhere at once.

## Persona (mock user)
**Hamza Ali** — BS Computer Science, Semester 5, roll no. 22K-4517. Five courses, ~14 classes a week.

## Navigation map
```
Bottom tabs:  Home | Schedule | Tasks | Courses | Notices (badge = unread count)

Home ──► Class detail (next class hero / today's classes)
     ──► Task detail (due soon rows)          Task detail ──► Edit (task-form?id=)
     ──► Notices (bell icon)                               ──► Class detail (related class)
     ──► Settings (avatar)
Schedule ──► Class detail ──► Course detail
Tasks ──► Task detail
      ──► Add task (FAB, modal)
Courses ──► Course detail ──► Class detail / Task detail
Notices ──► Notice detail (marks read) ──► "Add to tasks" (optional)
```
All non-root screens have a back button; the Notices tab also has one (goes back, or to Home).

---

## Mandatory core features (6 areas) + acceptance criteria

### 1. Home / Dashboard — `app/(tabs)/index.tsx`
At-a-glance view of the student's day. **Not a static welcome screen.**
- Header: date (e.g. "FRIDAY, 9 OCTOBER"), greeting by time of day + first name, bell button with unread dot → Notices, avatar → Settings.
- **Next class hero card**: course name, time range, room, "in 25 min" / "now" / "Next: Mon 08:30" (if no more classes today). Tap → Class detail.
- **Stats row**: progress ring "X of Y tasks done" (this week) → Tasks; mini list: N pending, N unread notices, N classes today.
- **Today's classes**: horizontal cards (done = faded, next = highlighted border). "Full schedule" → Schedule.
- **Due soon**: up to 3 pending tasks sorted by due date, each with a tappable checkbox (completes in place) and due pill. "All tasks" → Tasks. Tap row → Task detail.
- Empty states: "No classes today 🎉"-style message without emoji (use an icon), "Nothing due — you're all caught up".

Acceptance:
- [ ] Adding a task (anywhere) shows on Home immediately if it's due soon.
- [ ] Completing a task from Home updates the ring, pending count, Tasks list and Course detail.
- [ ] Unread notice count matches the tab badge at all times.
- [ ] Uses mock student info.

### 2. Class Schedule — `app/(tabs)/schedule.tsx`
- Week strip Mon–Fri with dates; today marked with a dot; selected day filled. Defaults to today (Monday on weekends).
- Vertical timeline of that day's classes: start/end time, course color, code · kind (Lecture/Lab/Tutorial), course name, room, instructor.
- Today only: past classes faded + "Done", the next one highlighted + "Next · in N min" or "Now".
- Tap a class → Class detail.

Acceptance:
- [ ] At least 3 sample classes (we have ~14 across the week).
- [ ] Easy to move between days.
- [ ] Opening a class shows THAT class. Timetable editing is NOT required.

### 3. Tasks / Assignments — `app/(tabs)/tasks.tsx` + `app/task-form.tsx`
- Header with "N pending · M done", weekly progress bar card.
- Segmented control: **Pending (n) / Completed (n)**. Optional course filter chips.
- Task rows: checkbox (toggle), title, course color + code, due pill (Overdue / Today / Tomorrow / In 2 days / weekday / date; completed shows "Done").
- Completed rows: filled teal check, strikethrough, muted.
- FAB (+) → `task-form` modal. Form: title (required), course (chips, optional "General"), due date + time, priority (Low/Medium/High), notes. Save disabled/validation message when title is empty.
- Edit uses the same form with `?id=` prefilled.

Acceptance:
- [ ] New tasks appear immediately in Tasks, Home (if due soon) and the Course detail.
- [ ] Status changes update the list AND dashboard instantly.
- [ ] Pending vs completed is easy to distinguish (segment + visual style).

### 4. Task / Class Detail — `app/task/[id].tsx`, `app/class/[id].tsx`
**Task detail**: course chip, status pill, title, due card with countdown ring ("2 DAYS LEFT", "OVERDUE", "✓ DONE"), priority, description/notes, related next class card → Class detail. Bottom bar: Delete (confirm Alert) + primary "Mark as complete" / "Reopen task". Edit icon top-right → task-form?id=.
**Class detail**: colored hero (course color) with code · kind, course name, day/time, "starts in N min". Tiles: Room (+building/floor), Instructor (+office hours). "Where to go" mini floor-map SVG with the room highlighted + directions text. Today's topic. "Pending for this course" task rows. Button "Open course" → Course detail.

Acceptance:
- [ ] Shows the item actually selected (lookup by id).
- [ ] Back navigation keeps all changes (complete on detail → list already updated).
- [ ] Deleted/missing id shows a graceful "not found" state.

### 5. My Courses — `app/(tabs)/courses.tsx` + `app/course/[id].tsx`
- List: header "Semester 5 · BS Computer Science", 3 stat tiles (courses, credit hours, classes/week). Course cards: colored initials badge, code · credits, name, instructor · "N pending"/"all caught up", progress bar "x/y done".
- Course detail: hero in course color (code, credits, name, instructor + office), chips (classes/wk, pending, attendance %), segmented tabs **Classes | Tasks | About**. Classes → Class detail; Tasks → Task detail (live from store); About → description + grading breakdown bar.

Acceptance:
- [ ] Content differs per course (classes, tasks, description, grading all course-specific).
- [ ] Links to schedule/detail screens work. Registration/admin NOT required.

### 6. Campus Notices — `app/(tabs)/notices.tsx` + `app/notice/[id].tsx`
- Header "N unread" + "Mark all read". Filter chips: All / Unread / Exams / Rooms / Events.
- Rows: category icon tile (exam, room change, workshop, event, general), category label, relative time, title, source.
  **Unread**: white card, bold title, blue dot, tinted border. **Read**: muted background, regular weight.
- Notice detail: category pill, title, source avatar + timestamp, optional "WAS → NOW" change card, full body. **Opening marks it read** (in `useEffect` on mount) and shows a small "Marked as read" chip.
- Optional: "Add to tasks" button creating a related task (great connected-behavior demo).

Acceptance:
- [ ] Opening a notice reveals the full message and marks it read; badge + Home count drop.
- [ ] Read vs unread visually distinct. Mock content OK.

---

## Optional enhancements (only after core is done) — priority order
1. **Persistence** (Zustand persist) — app remembers tasks/read state across restarts. *(Planned from the start; ~10 min.)*
2. **Task management+** — delete (with confirm), reopen completed, search tasks (search icon in Tasks header).
3. **Dark mode** — Settings toggle: System / Light / Dark, using the Night Library tokens.
4. **Notice → task** — "Add to tasks" on notice detail.
5. Focus timer (25-min Pomodoro on Task detail) or attendance tracker — only if time remains.

## Out of scope
Timetable editing · course registration / admin panel · real notifications or staff publishing · login · backend.

## Demo video (3–5 min) storyline
1. Problem in one line → Home (next class, ring, due soon).
2. Schedule: switch days, open a class (floor map), open the course.
3. Tasks: add a task → back to Home, it's there → complete it from Home → it's under Completed, ring moved.
4. Courses: open two courses to show different content.
5. Notices: open an unread notice → badge drops; (optional) add it as a task.
6. Extras: kill & reopen app (persistence), toggle dark mode, Reset demo data.
