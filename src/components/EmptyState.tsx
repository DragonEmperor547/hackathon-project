import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Props {
  title: string;
  body?: string;
  /** Optional action (e.g. a button) under the text. */
  children?: ReactNode;
}

/** Small illustration (card + check circle + two accent dots), title and body. */
export function EmptyState({ title, body, children }: Props) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 6, paddingVertical: 20, paddingHorizontal: 16 }}>
      <Svg width={88} height={64} viewBox="0 0 88 64" accessibilityElementsHidden importantForAccessibility="no">
        <Rect x={12} y={10} width={60} height={44} rx={10} fill={c.surfaceMuted} stroke={c.border} />
        <Rect x={22} y={22} width={26} height={5} rx={2.5} fill={c.border} />
        <Rect x={22} y={33} width={18} height={5} rx={2.5} fill={c.border} />
        <Circle cx={66} cy={44} r={14} fill={c.success} />
        <Path d="M60 44l4 4 8-9" fill="none" stroke={c.surface} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={8} cy={14} r={4} fill={c.highlight} />
        <Circle cx={80} cy={10} r={3} fill={c.link} />
      </Svg>
      <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.text, textAlign: 'center', marginTop: 4 }}>{title}</Text>
      {body ? <Text style={[type.body, { fontSize: 13, lineHeight: 20, color: c.textMuted, textAlign: 'center' }]}>{body}</Text> : null}
      {children}
    </View>
  );
}
