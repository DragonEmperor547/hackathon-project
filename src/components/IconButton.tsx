import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';

interface Props {
  icon: ComponentProps<typeof Feather>['name'];
  accessibilityLabel: string;
  onPress: () => void;
  /** Small red dot (e.g. unread notices). */
  dot?: boolean;
  /** 20 for search/edit, 22 for the Home bell (per mockups). */
  iconSize?: number;
}

export function IconButton({ icon, accessibilityLabel, onPress, dot, iconSize = 20 }: Props) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Feather name={icon} size={iconSize} color={c.text} />
      {dot ? (
        <View
          style={{
            position: 'absolute',
            top: 9,
            right: 10,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: c.danger,
            borderWidth: 2,
            borderColor: c.surface,
          }}
        />
      ) : null}
    </Pressable>
  );
}
