import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { useTheme } from '@/theme/useTheme';

interface Props {
  /** default = surface + border; onColor = translucent on coloured heroes; muted = bg fill on surface sheets. */
  variant?: 'default' | 'onColor' | 'muted';
}

export function BackButton({ variant = 'default' }: Props) {
  const { c } = useTheme();
  const bg = { default: c.surface, onColor: c.onColorSoft, muted: c.bg }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: variant === 'default' ? 1 : 0,
        borderColor: c.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Feather name="chevron-left" size={22} color={variant === 'onColor' ? c.onInverse : c.text} />
    </Pressable>
  );
}
