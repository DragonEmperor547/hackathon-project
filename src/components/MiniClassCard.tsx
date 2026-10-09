import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { getCourse, type ClassStatus } from '@/lib/selectors';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ClassSession } from '@/types';

interface Props {
  session: ClassSession;
  status: ClassStatus;
  /** The class shown in the Home hero: 2px primary border. */
  highlighted: boolean;
}

/** 140px card in Home's "Today's classes" row (mockup 01). */
export function MiniClassCard({ session, status, highlighted }: Props) {
  const { c, scheme, courseColor } = useTheme();
  const course = getCourse(session.courseId);
  const suffix = status === 'done' ? ' · Done' : highlighted ? (status === 'now' ? ' · Now' : ' · Next') : '';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course?.name} at ${session.start}${suffix}`}
      onPress={() => router.push(`/class/${session.id}`)}
      style={({ pressed }) => ({
        width: 140,
        gap: 6,
        padding: highlighted ? 13 : 14,
        borderRadius: 18,
        backgroundColor: c.surface,
        borderWidth: highlighted ? 2 : 1,
        borderColor: highlighted ? (scheme === 'dark' ? c.primary : c.link) : c.border,
        opacity: status === 'done' ? (scheme === 'dark' ? 0.55 : 0.6) : pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: highlighted ? (scheme === 'dark' ? c.link : c.primary) : c.textMuted }}>
        {session.start}
        {suffix}
      </Text>
      <View style={{ width: 24, height: 4, borderRadius: 2, backgroundColor: courseColor(session.courseId).solid }} />
      <Text numberOfLines={2} style={{ fontFamily: fonts.bold, fontSize: 14, lineHeight: 18, color: c.text }}>
        {course?.shortName}
      </Text>
      <Text numberOfLines={2} style={[type.meta, { fontFamily: fonts.regular, color: c.textMuted }]}>
        {highlighted ? `${session.room}, ${session.building}` : session.room}
      </Text>
    </Pressable>
  );
}
