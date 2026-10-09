# UI Mockups — visual source of truth

Every screen has a PNG (overall look) and a static HTML file (exact styles) in `docs/mockups/`.
Before building or restyling a screen: **read its HTML for exact values, open its PNG for the look**, then compare your result against both.

| Screen | Image | Exact HTML | Route |
|---|---|---|---|
| Home dashboard | `mockups/01-home.png` | `mockups/html/01-home.html` | `app/(tabs)/index.tsx` |
| Schedule | `mockups/02-schedule.png` | `mockups/html/02-schedule.html` | `app/(tabs)/schedule.tsx` |
| Class detail | `mockups/03-class-detail.png` | `mockups/html/03-class-detail.html` | `app/class/[id].tsx` |
| Tasks | `mockups/04-tasks.png` | `mockups/html/04-tasks.html` | `app/(tabs)/tasks.tsx` |
| Task detail | `mockups/05-task-detail.png` | `mockups/html/05-task-detail.html` | `app/task/[id].tsx` |
| Add / edit task | `mockups/06-task-form.png` | `mockups/html/06-task-form.html` | `app/task-form.tsx` |
| My courses | `mockups/07-courses.png` | `mockups/html/07-courses.html` | `app/(tabs)/courses.tsx` |
| Course detail | `mockups/08-course-detail.png` | `mockups/html/08-course-detail.html` | `app/course/[id].tsx` |
| Campus notices | `mockups/09-notices.png` | `mockups/html/09-notices.html` | `app/(tabs)/notices.tsx` |
| Notice detail | `mockups/10-notice-detail.png` | `mockups/html/10-notice-detail.html` | `app/notice/[id].tsx` |
| Home, dark mode | `mockups/11-home-dark.png` | `mockups/html/11-home-dark.html` | dark theme reference |
| Colour schemes | `mockups/12-colour-schemes.png` | `mockups/html/12-colour-schemes.html` | Scheme A = light, C = dark |

`mockups/html/index.html` is a clickable gallery of every screen (open it in a browser).

## Translating HTML → React Native
- `display:flex` + `flex-direction` / `gap` / `align-items` → `View` style with the same keys (RN supports `gap`).
- `border-radius` → `borderRadius`, `padding: 14px 16px` → `paddingVertical: 14, paddingHorizontal: 16`.
- `font-family: 'Bricolage Grotesque'` → heading font; `'Plus Jakarta Sans'` → body font, matching weight.
- Inline `<svg>` (progress rings, hero shapes, floor map, icons) → `react-native-svg`; stroke icons → Feather from `@expo/vector-icons`.
- Hex colours → the matching theme token in `src/theme/tokens.ts`. Never hard-code hex in screens.
- Mockups are 390 px wide. Use flexible widths, not fixed pixel widths.

## Where the mockups and DESIGN.md differ, DESIGN.md wins
- Home has **no quick-access tiles** (the tab bar covers navigation).
- Notices tab and the Add task form **both have a round back button** (top left).
