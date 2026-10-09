import Feather from '@expo/vector-icons/Feather';
import { Pressable } from 'react-native';
import { useTheme } from '@/theme/useTheme';

/** 60×60 floating add button, bottom-right, 20px above the tab bar. */
export function Fab({ onPress, accessibilityLabel }: { onPress: () => void; accessibilityLabel: string }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.primary,
        shadowColor: c.primary,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      <Feather name="plus" size={26} color={c.onPrimary} />
    </Pressable>
  );
}
