import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Props {
  eyebrow?: string;
  /** "primary" for attention eyebrows like "2 UNREAD". */
  eyebrowTone?: 'muted' | 'primary';
  title: string;
  right?: ReactNode;
  align?: 'center' | 'flex-end';
}

export function ScreenHeader({ eyebrow, eyebrowTone = 'muted', title, right, align = 'flex-end' }: Props) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: align, gap: 12 }}>
      <View style={{ flex: 1, gap: 4 }}>
        {eyebrow ? (
          <Text style={[type.eyebrow, { color: eyebrowTone === 'primary' ? c.primary : c.textMuted }]}>{eyebrow}</Text>
        ) : null}
        <Text accessibilityRole="header" style={[type.display, { color: c.text }]}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
