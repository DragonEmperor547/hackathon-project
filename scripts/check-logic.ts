// Self-check for date + selector logic. Run: npm run check
import { addDays, set, startOfDay } from 'date-fns';
import { SEED_READ_IDS } from '@/data/notices';
import { buildSeedTasks } from '@/data/seedTasks';
import { formatDue } from '@/lib/dates';
import { classStatus, dueSoon, getNextClass, getSession, unreadCount, weekProgress } from '@/lib/selectors';

function check(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

const fri = (h: number, m: number) => new Date(2026, 9, 9, h, m); // Fri 9 Oct 2026

// Next class
const during = getNextClass(fri(9, 35));
check(during?.session.id === 's-fri-cs305' && during.isNow && during.isToday, 'class in progress is "now"');
const stillRunning = getNextClass(fri(9, 50));
check(stillRunning?.isNow === true, 'still in cs305 at 09:50');
const between = getNextClass(fri(12, 35));
check(between?.session.id === 's-fri-mt201' && between.startsInMin === 25 && !between.isNow, 'next class in 25 min');
const evening = getNextClass(fri(17, 0));
check(evening?.session.id === 's-mon-cs305' && !evening.isToday, 'after last class → Monday');
check(getNextClass(new Date(2026, 9, 10, 12, 0))?.session.id === 's-mon-cs305', 'Saturday → Monday');

// Class status (today)
const s = (id: string) => getSession(id)!;
check(classStatus(s('s-fri-cs305'), fri(10, 5)) === 'done', 'past class done');
check(classStatus(s('s-fri-cs311'), fri(10, 5)) === 'now', 'running class now');
check(classStatus(s('s-fri-mt201'), fri(10, 5)) === 'next', 'first upcoming is next');
check(classStatus(s('s-fri-hs210'), fri(10, 5)) === 'later', 'others later');

// Tasks: ring must read "4 of 8" on any weekday or weekend
for (let i = 0; i < 7; i++) {
  const now = set(addDays(fri(0, 0), i), { hours: 10 });
  const p = weekProgress(buildSeedTasks(now), now);
  check(p.done === 4 && p.total === 8, `weekProgress 4/8 on day +${i}, got ${p.done}/${p.total}`);
}
const now = fri(10, 0);
const seed = buildSeedTasks(now);
check(dueSoon(seed, now).map((t) => t.id).join() === 't1,t2,t3', 'dueSoon = t1,t2,t3');
const dueIn = (n: number) => set(addDays(startOfDay(now), n), { hours: 23, minutes: 59 }).toISOString();
check(formatDue(dueIn(-1), now).label === 'Overdue', 'overdue');
check(formatDue(dueIn(0), now).label === 'Today', 'today');
check(formatDue(dueIn(1), now).label === 'Tomorrow', 'tomorrow');
check(formatDue(dueIn(2), now).label === 'In 2 days', 'in 2 days');
check(formatDue(dueIn(5), now).label === 'Wed', 'weekday');
check(formatDue(dueIn(9), now).label === '18 Oct', 'date');

// Notices
check(unreadCount(SEED_READ_IDS) === 2, '2 unread notices');

console.log('check-logic: all passed');
