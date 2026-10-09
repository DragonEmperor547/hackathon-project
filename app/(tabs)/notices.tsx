import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BackButton } from '@/components/BackButton';
import { ChipGroup } from '@/components/ChipGroup';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { NOTICES } from '@/data/notices';
import { formatRelative } from '@/lib/dates';
import { NOTICE_META } from '@/lib/noticeMeta';
import { isUnread, unreadCount } from '@/lib/selectors';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/store/useAppStore';
import { courseColors, fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Filter = 'all' | 'unread' | 'exam' | 'room' | 'event';

export default function NoticesScreen() {
  const { c, scheme } = useTheme();
  const now = useNow();
  const readIds = useAppStore((s) => s.readNoticeIds);
  const markAllNoticesRead = useAppStore((s) => s.markAllNoticesRead);
  const [filter, setFilter] = useState<Filter>('all');
  const unread = unreadCount(readIds);

  const visible = useMemo(
    () =>
      NOTICES.filter((n) =>
        filter === 'all' ? true : filter === 'unread' ? isUnread(n.id, readIds) : n.category === filter,
      ),
    [filter, readIds],
  );

  return (
    <Screen scroll>
      <BackButton />
      <ScreenHeader
        eyebrow={unread ? `${unread} unread` : 'All caught up'}
        eyebrowTone={unread ? 'primary' : 'muted'}
        title="Notices"
        right={
          unread ? (
            <Pressable
              accessibilityRole="button"
              onPress={markAllNoticesRead}
              style={({ pressed }) => ({
                height: 40,
                paddingHorizontal: 14,
                borderRadius: 999,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.surface,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.primary }}>Mark all read</Text>
            </Pressable>
          ) : null
        }
      />
      <ChipGroup
        options={[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'exam', label: 'Exams' },
          { key: 'room', label: 'Rooms' },
          { key: 'event', label: 'Events' },
        ]}
        value={filter}
        onChange={setFilter}
      />
      <View style={{ gap: 10 }}>
        {visible.length ? (
          visible.map((n) => {
            const meta = NOTICE_META[n.category];
            const tile = meta.color ? courseColors[scheme][meta.color] : { soft: c.surfaceMuted, ink: c.textSecondary };
            const fresh = isUnread(n.id, readIds);
            return (
              <Pressable
                key={n.id}
                accessibilityRole="button"
                accessibilityLabel={`${fresh ? 'Unread. ' : ''}${meta.label}: ${n.title}`}
                onPress={() => router.push(`/notice/${n.id}`)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  gap: 12,
                  padding: 14,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: fresh ? c.unreadBorder : c.surfaceMuted,
                  backgroundColor: fresh ? c.surface : c.surfaceMuted,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View style={{ width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: tile.soft }}>
                  <Feather name={meta.icon} size={20} color={tile.ink} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: tile.ink }}>{meta.label}</Text>
                    <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>{formatRelative(n.postedAt, now)}</Text>
                  </View>
                  <Text style={{ fontFamily: fresh ? fonts.bold : fonts.regular, fontSize: 15, lineHeight: 20, color: c.text }}>{n.title}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMuted }}>{n.source}</Text>
                </View>
                {fresh ? (
                  <View style={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: c.link }} />
                ) : null}
              </Pressable>
            );
          })
        ) : (
          <EmptyState title="Nothing here" body={filter === 'unread' ? "You've read every notice." : 'No notices in this category.'} />
        )}
      </View>
    </Screen>
  );
}
