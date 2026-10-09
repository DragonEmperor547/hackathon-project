import { useColorScheme } from 'react-native';
import { getCourse } from '@/lib/selectors';
import { useAppStore } from '@/store/useAppStore';
import { courseColors, dark, light, type CourseColors } from './tokens';

/** Resolved colours for the current theme mode. Every screen reads colours from here. */
export function useTheme() {
  const mode = useAppStore((s) => s.themeMode);
  const system = useColorScheme();
  const scheme: 'light' | 'dark' = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  const c = scheme === 'dark' ? dark : light;

  /** Colours for a course by id; "General" tasks (null) get neutral greys. */
  const courseColor = (courseId: string | null | undefined): CourseColors => {
    const course = getCourse(courseId);
    if (course) return courseColors[scheme][course.color];
    return { solid: c.iconMuted, soft: c.surfaceMuted, ink: c.textSecondary, hero: c.inverse };
  };

  return { c, scheme, courseColor };
}
