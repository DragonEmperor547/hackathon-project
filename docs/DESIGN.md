# Campus Companion — Design System & Screen Layouts

Reference mockups: the "Campus Companion UI Flow" canvas (11 screens + colour schemes). This file is the build-ready version.

**Look:** "Campus Cobalt" — calm cool-grey ground, white cards, cobalt for actions, amber for attention, one colour per course. Dark mode = "Night Library".
**Feel:** soft, rounded, generous spacing, bold friendly headings. No gradients, no emoji, no coloured left-border cards.

## Tokens — `src/theme/tokens.ts`
```ts
export const light = {
  bg: '#F3F5F9', surface: '#FFFFFF', surfaceMuted: '#EEF1F6', border: '#E3E7EF', divider: '#EEF1F6',
  text: '#101828', textSecondary: '#3D4555', textMuted: '#5B6475', iconMuted: '#9AA3B2',
  primary: '#2343C4', onPrimary: '#FFFFFF', primarySoft: '#E6ECFD', link: '#2F5BEA',
  highlight: '#F2A93B',                       // decorative accent (hero shapes, progress bar)
  success: '#0E9384', successSoft: '#E0F4F1', successInk: '#0B6E63',
  warningSoft: '#FDF1DC', warningInk: '#8A5300', warningDot: '#D98A12',
  danger: '#C9412A', dangerSoft: '#FDECE8', dangerInk: '#A8321F',
  inverse: '#101828', onInverse: '#FFFFFF', inverseTrack: '#2A3447',
  unreadBorder: '#C9D5FB', overlay: 'rgba(16,24,40,0.45)',
};
export const dark = {
  bg: '#0E1118', surface: '#171B25', surfaceMuted: '#222837', border: '#262C3A', divider: '#222837',
  text: '#E8ECF4', textSecondary: '#C3CAD6', textMuted: '#9AA4B8', iconMuted: '#5C6578',
  primary: '#7C9CFF', onPrimary: '#0E1118', primarySoft: '#1D2A5E', link: '#9DB4FF',
  highlight: '#C8F169',
  success: '#3DD6B5', successSoft: '#12352F', successInk: '#3DD6B5',
  warningSoft: '#3A2E12', warningInk: '#F2B544', warningDot: '#F2B544',
  danger: '#FF7A66', dangerSoft: '#3A1D1A', dangerInk: '#FF9A8A',
  inverse: '#1D2A5E', onInverse: '#FFFFFF', inverseTrack: '#2E3E7E',
  unreadBorder: '#2E3E7E', overlay: 'rgba(0,0,0,0.6)',
};
// Course colours: { solid, soft (tile/chip bg), ink (text on soft), hero (bg behind white text) }
export const courseColors = {
  light: {
    teal:   { solid: '#0E9384', soft: '#E0F4F1', ink: '#0B6E63', hero: '#0B6E63' },
    violet: { solid: '#7A5AF8', soft: '#EFEAFE', ink: '#5B3FD6', hero: '#5B3FD6' },
    coral:  { solid: '#E2553C', soft: '#FDECE8', ink: '#B23A25', hero: '#B23A25' },
    amber:  { solid: '#D98A12', soft: '#FDF1DC', ink: '#8A5300', hero: '#8A5300' },
    blue:   { solid: '#2F5BEA', soft: '#E6ECFD', ink: '#2343C4', hero: '#2343C4' },
  },
  dark: {
    teal:   { solid: '#3DD6B5', soft: '#12352F', ink: '#3DD6B5', hero: '#12352F' },
    violet: { solid: '#B5A2FF', soft: '#2A2150', ink: '#B5A2FF', hero: '#2A2150' },
    coral:  { solid: '#FF9A8A', soft: '#3A1D1A', ink: '#FF9A8A', hero: '#3A1D1A' },
    amber:  { solid: '#F2B544', soft: '#3A2E12', ink: '#F2B544', hero: '#3A2E12' },
    blue:   { solid: '#7C9CFF', soft: '#1D2A5E', ink: '#9DB4FF', hero: '#1D2A5E' },
  },
};
export const radius = { sm: 10, md: 14, lg: 18, xl: 20, xxl: 24, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 }; // screen side padding = 20
```
`ThemeProvider` resolves `themeMode` ('system' uses `useColorScheme()`) and exposes `{ c, scheme, course(colorKey) }` via `useTheme()`. Set `StatusBar` style to match.

## Typography
| Role | Font | Size / weight | Use |
|---|---|---|---|
| Display | Bricolage Grotesque 700 | 30, letterSpacing −0.6 | Screen titles, greeting |
| Hero | Bricolage Grotesque 700 | 25–30 | Hero card / detail titles |
| Section | Bricolage Grotesque 700 | 19 (17 in details) | "Today's classes", "Due soon" |
| Eyebrow | Plus Jakarta Sans 700 | 12, UPPERCASE, letterSpacing 0.7, textMuted | Date, "WEEK 6 · FALL 2026" |
| Title | Plus Jakarta Sans 700 | 15–16 | Card titles, task titles |
| Body | Plus Jakarta Sans 400/500 | 14–15, lineHeight 1.6× | Descriptions |
| Meta | Plus Jakarta Sans 500/600 | 12 | Room, instructor, captions |
| Pill | Plus Jakarta Sans 700 | 11 | Due pills, badges |

## Shared components — `src/components/`
| Component | Notes |
|---|---|
| `Screen` | SafeArea top, bg token, side padding 20, optional `scroll` (ScrollView with bottom padding 24). |
| `ScreenHeader` | eyebrow + display title + optional right slot (icon button). |
| `BackButton` | 44×44 circle, surface bg + border (or translucent white on coloured heroes), Feather `chevron-left`. `router.canGoBack() ? router.back() : router.replace('/')`. |
| `IconButton` | 44×44 circle, `accessibilityLabel` required, optional red dot. |
| `Card` | surface, radius 20, 1px border, padding 14–16. Pressable variant with pressed opacity 0.85. |
| `Pill` | tone: danger / warning / neutral / success / primary → soft bg + ink text. |
| `SectionHeader` | title + optional link text ("Full schedule"). |
| `CheckCircle` | 24px ring (iconMuted) → filled success + white check when done. 44px hit area. Light haptic on toggle (`expo-haptics`, optional). |
| `TaskRow` | CheckCircle · title (strikethrough + muted when done) · course dot + "CODE · shortName" · due Pill. Row press → task detail; circle press → `toggleTask`. |
| `ClassCard` | time column + timeline dot + card (course colour square, "CODE · Kind", status pill, name, room + instructor icons). Variants: done (opacity .6), next (2px primary border). |
| `MiniClassCard` | 140px wide card for Home horizontal list. |
| `CourseBadge` | 52px rounded square, course soft bg, abbr in Bricolage, course ink. |
| `ProgressRing` | `react-native-svg`, size/stroke/pct, track = border token, label in centre. |
| `ProgressBar` | height 6–10, rounded, colour prop. |
| `SegmentedControl` | track surfaceMuted (light: `#E3E7EF`), selected = surface, 44px height. |
| `ChipGroup` | horizontal chips; selected = inverse bg + onInverse text. |
| `EmptyState` | small SVG illustration (card + check circle + 2 accent dots), title, body. |
| `HeroCard` | coloured card (primary or course hero colour) with decorative SVG: big translucent ring + highlight circle (see mockup), pill eyebrow, title, meta row. |
| `FloorMap` | simple SVG floor plan (6 rooms, corridor dashed line); highlights the session's room in course colour with a map pin. Rooms list can be generic per building. |
| `Fab` | 60×60, radius 20, primary bg, Feather `plus`, shadow, sits 20px above tab bar. |

Icons (Feather): home, calendar, check-square, book, bell, chevron-left/right, clock, map-pin, user, edit-2, trash-2, search, plus, check, file-text (exam), map-pin (room), code (workshop), info (general), star (event), arrow-right, settings, moon, rotate-ccw.

## Tab bar
Height ~84 incl. safe area, surface bg, top border. Active: primary icon + label, icon inside a `primarySoft` pill (16px h-padding). Inactive: textMuted. Notices tab shows `tabBarBadge` = unread count (hidden at 0), badge colour = danger.

## Screen layouts (top → bottom)
**Home** — eyebrow date · greeting (display) + bell IconButton (dot if unread) + avatar → Settings · HeroCard "NEXT CLASS · IN 25 MIN" (primary bg, amber circle graphic) · 2-col row: ProgressRing card ("4 of 8 / tasks done this week") + stats card (dots: warningDot "N pending", danger "N unread notices", link "N classes today") · SectionHeader "Today's classes" + horizontal MiniClassCards · SectionHeader "Due soon" + Card with up to 3 TaskRows separated by dividers. *(No quick-access tiles — the tab bar covers navigation.)*

**Schedule** — eyebrow "WEEK 6 · FALL 2026" + title + date-range pill · 5 day buttons (72px tall, selected = primary fill, today dot) · "Today · Friday" + "4 classes · from 08:30" · timeline (2px vertical line at x≈58) of ClassCards.

**Class detail** — hero in course hero colour, rounded bottom corners 28, decorative rounded-square SVG; BackButton (translucent) + "Class details" + spacer; pill "CS-311 · LECTURE"; title; "Today · 10:00 – 11:30 · starts in 25 min" · 2 tiles (Room / Instructor) · "Where to go" FloorMap card + directions · "Today's topic" card · "Pending for this course" TaskRows · dark full-width button "Open course →".

**Tasks** — eyebrow "4 pending · 4 done" + title + search IconButton · inverse progress card ("Weekly progress 4/8" + amber bar) · SegmentedControl Pending/Completed with counts · TaskRows in separate cards (gap 10) · EmptyState · Fab.

**Task detail** — BackButton · "Task" · edit IconButton · course chip + status pill · title (28, strikethrough when done) · success banner after completing ("Moved to Completed. Home progress is now 5 of 8.") · due card with countdown ring (warning colours) + "Sun, 11 Oct · 11:59 PM" + priority · "What to do" notes · related class card (primarySoft) · bottom bar: Delete (danger outline square) + primary "Mark as complete" / outline "Reopen task".

**Task form (modal)** — grabber · BackButton + "New task"/"Edit task" · Title input (red border + message when empty on save) · Course chips with colour squares · Due date + Time fields · Priority segmented (dot per level) · Notes textarea · flexible spacer · big Save button (disabled look when title empty).

**Courses** — eyebrow "SEMESTER 5 · BS COMPUTER SCIENCE" + "My courses" · 3 stat tiles (5 courses / 16 credit hours / 14 classes per week) · course Cards: CourseBadge · "CS-311 · 3 cr" · name · "Instructor · N pending" · ProgressBar + "x/y done" · chevron.

**Course detail** — hero in course colour (BackButton, pill "CS-311 · 3 CREDIT HRS", title, instructor · office, 3 translucent chips) · SegmentedControl Classes / Tasks / About · Classes: day/time tiles (today's highlighted with primary border) · Tasks: live TaskRows · About: description + grading stacked bar with legend.

**Notices** — BackButton · eyebrow "2 unread" (primary) or "All caught up" + title + "Mark all read" pill button · filter ChipGroup · NoticeRows: category icon tile (soft bg/ink per category: exam=coral, room=violet, workshop=teal, event=amber, general=neutral), category label + relative time, title, source; unread = surface bg + unreadBorder + bold + blue dot top-right; read = surfaceMuted bg, regular weight.

**Notice detail** — surface background · BackButton + "Marked as read" success chip · category pill · title (27) · source avatar (inverse circle with initials) + timestamp · optional WAS → NOW card (was faded + strikethrough, now with 2px primary border) · body paragraphs · bottom: primary "Add to tasks" (optional) + helper text.

**Settings** — BackButton · avatar + name + program/roll no · Appearance segmented (System / Light / Dark) · "Reset demo data" (confirm Alert) · app version/credits line.

## Motion & polish (cheap wins)
- `Pressable` pressed state: opacity 0.85 or scale 0.98.
- Toggle task: `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` before `toggleTask` so rows slide between groups.
- Task form presented as `presentation: 'modal'`.
- Splash: bg colour `#2343C4`.
