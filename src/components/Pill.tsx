import { Text, View } from 'react-native';
import { type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type PillTone = 'danger' | 'warning' | 'neutral' | 'success' | 'primary';

export function Pill({ label, tone = 'neutral' }: { label: string; tone?: PillTone }) {
  const { c } = useTheme();
  const [bg, ink] = {
    danger: [c.dangerSoft, c.dangerInk],
    warning: [c.warningSoft, c.warningInk],
    neutral: [c.surfaceMuted, c.textSecondary],
    success: [c.successSoft, c.successInk],
    primary: [c.primarySoft, c.primary],
  }[tone];
  return (
    <View style={{ alignSelf: 'center', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 999, backgroundColor: bg }}>
      <Text numberOfLines={1} style={[type.pill, { color: ink }]}>
        {label}
      </Text>
    </View>
  );
}
