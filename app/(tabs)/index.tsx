import { useMemo } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { pendingTasks, sessionsForDay, todayWeekday, unreadCount } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const now = useNow();
  const tasks = useAppStore((s) => s.tasks);
  const readNoticeIds = useAppStore((s) => s.readNoticeIds);

  const counts = useMemo(() => {
    const day = todayWeekday(now);
    return [
      `${day ? sessionsForDay(day).length : 0} classes today`,
      `${pendingTasks(tasks).length} pending tasks`,
      `${unreadCount(readNoticeIds)} unread notices`,
    ];
  }, [now, tasks, readNoticeIds]);

  return (
    <Placeholder
      title="Home"
      lines={counts}
      links={['/class/s-fri-cs311', '/course/cs311', '/task/t1', '/task-form', '/notice/n1', '/settings']}
    />
  );
}
