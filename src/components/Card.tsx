import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/useTheme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Surface card: radius 20, 1px border, padding 16. Pressable when `onPress` is set. */
export function Card({ children, onPress, accessibilityLabel, style }: Props) {
  const { c } = useTheme();
  const base: ViewStyle = { backgroundColor: c.surface, borderRadius: 20, borderWidth: 1, borderColor: c.border, padding: 16 };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [base, style, pressed && { opacity: 0.85 }]}
    >
      {children}
    </Pressable>
  );
}
