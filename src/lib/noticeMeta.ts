import type Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import type { CourseColorKey, NoticeCategory } from '@/types';

/** Label, icon and tile colour per notice category (null = neutral grey). */
export const NOTICE_META: Record<
  NoticeCategory,
  { label: string; icon: ComponentProps<typeof Feather>['name']; color: CourseColorKey | null }
> = {
  exam: { label: 'Exam update', icon: 'file-text', color: 'coral' },
  room: { label: 'Room change', icon: 'map-pin', color: 'violet' },
  workshop: { label: 'Workshop', icon: 'code', color: 'teal' },
  event: { label: 'Event', icon: 'star', color: 'amber' },
  general: { label: 'General', icon: 'info', color: null },
};
