import { Text, View } from 'react-native';
import { getCourse } from '@/lib/selectors';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** 52px rounded square with the course initials in its colour. */
export function CourseBadge({ courseId }: { courseId: string }) {
  const { courseColor } = useTheme();
  const color = courseColor(courseId);
  return (
    <View style={{ width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: color.soft }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: color.ink }}>{getCourse(courseId)?.abbr}</Text>
    </View>
  );
}
