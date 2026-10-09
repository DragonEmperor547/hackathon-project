import type { TextStyle } from 'react-native';

export const light = {
  bg: '#F3F5F9', surface: '#FFFFFF', surfaceMuted: '#EEF1F6', border: '#E3E7EF', divider: '#EEF1F6',
  text: '#101828', textSecondary: '#3D4555', textMuted: '#5B6475', iconMuted: '#9AA3B2',
  primary: '#2343C4', onPrimary: '#FFFFFF', primarySoft: '#E6ECFD', link: '#2F5BEA',
  highlight: '#F2A93B',
  success: '#0E9384', successSoft: '#E0F4F1', successInk: '#0B6E63',
  warningSoft: '#FDF1DC', warningInk: '#8A5300', warningDot: '#D98A12',
  danger: '#C9412A', dangerSoft: '#FDECE8', dangerInk: '#A8321F',
  inverse: '#101828', onInverse: '#FFFFFF', inverseTrack: '#2A3447',
  unreadBorder: '#C9D5FB', overlay: 'rgba(16,24,40,0.45)',
  onColorSoft: 'rgba(255,255,255,0.16)', // translucent fills on coloured heroes
};

export type Colors = typeof light;

export const dark: Colors = {
  bg: '#0E1118', surface: '#171B25', surfaceMuted: '#222837', border: '#262C3A', divider: '#222837',
  text: '#E8ECF4', textSecondary: '#C3CAD6', textMuted: '#9AA4B8', iconMuted: '#5C6578',
  primary: '#7C9CFF', onPrimary: '#0E1118', primarySoft: '#1D2A5E', link: '#9DB4FF',
  highlight: '#C8F169',
  success: '#3DD6B5', successSoft: '#12352F', successInk: '#3DD6B5',
  warningSoft: '#3A2E12', warningInk: '#F2B544', warningDot: '#F2B544',
  danger: '#FF7A66', dangerSoft: '#3A1D1A', dangerInk: '#FF9A8A',
  inverse: '#1D2A5E', onInverse: '#FFFFFF', inverseTrack: '#2E3E7E',
  unreadBorder: '#2E3E7E', overlay: 'rgba(0,0,0,0.6)',
  onColorSoft: 'rgba(255,255,255,0.16)',
};

export type CourseColors = { solid: string; soft: string; ink: string; hero: string };

export const courseColors = {
  light: {
    teal: { solid: '#0E9384', soft: '#E0F4F1', ink: '#0B6E63', hero: '#0B6E63' },
    violet: { solid: '#7A5AF8', soft: '#EFEAFE', ink: '#5B3FD6', hero: '#5B3FD6' },
    coral: { solid: '#E2553C', soft: '#FDECE8', ink: '#B23A25', hero: '#B23A25' },
    amber: { solid: '#D98A12', soft: '#FDF1DC', ink: '#8A5300', hero: '#8A5300' },
    blue: { solid: '#2F5BEA', soft: '#E6ECFD', ink: '#2343C4', hero: '#2343C4' },
  },
  dark: {
    teal: { solid: '#3DD6B5', soft: '#12352F', ink: '#3DD6B5', hero: '#12352F' },
    violet: { solid: '#B5A2FF', soft: '#2A2150', ink: '#B5A2FF', hero: '#2A2150' },
    coral: { solid: '#FF9A8A', soft: '#3A1D1A', ink: '#FF9A8A', hero: '#3A1D1A' },
    amber: { solid: '#F2B544', soft: '#3A2E12', ink: '#F2B544', hero: '#3A2E12' },
    blue: { solid: '#7C9CFF', soft: '#1D2A5E', ink: '#9DB4FF', hero: '#1D2A5E' },
  },
} satisfies Record<'light' | 'dark', Record<string, CourseColors>>;

export const radius = { sm: 10, md: 14, lg: 18, xl: 20, xxl: 24, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 }; // screen side padding = 20

export const fonts = {
  heading: 'BricolageGrotesque_700Bold',
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

// Text styles from DESIGN.md "Typography". Add `color` from the theme at the call site.
// Custom fonts carry their own weight, so never set fontWeight alongside them (breaks on Android).
export const type = {
  display: { fontFamily: fonts.heading, fontSize: 30, lineHeight: 33, letterSpacing: -0.6 },
  hero: { fontFamily: fonts.heading, fontSize: 25, lineHeight: 28, letterSpacing: -0.25 },
  section: { fontFamily: fonts.heading, fontSize: 19, lineHeight: 24 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 0.72, textTransform: 'uppercase' },
  title: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 },
  meta: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  pill: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14 },
} satisfies Record<string, TextStyle>;
