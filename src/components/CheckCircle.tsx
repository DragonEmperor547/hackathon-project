import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';

interface Props {
  checked: boolean;
  onToggle: () => void;
  /** Task title, used for "Mark X complete" / "Reopen X". */
  label: string;
  /** Ring size: 24 in task cards, 22 in Home's due-soon list. Hit area is always 44. */
  size?: number;
}

export function CheckCircle({ checked, onToggle, label, size = 24 }: Props) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={checked ? `Reopen ${label}` : `Mark ${label} complete`}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onToggle();
      }}
      style={{ width: 44, height: 44, margin: -10, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: checked ? 0 : 2,
          borderColor: c.iconMuted,
          backgroundColor: checked ? c.success : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? <Feather name="check" size={Math.round(size * 0.6)} color={c.surface} /> : null}
      </View>
    </Pressable>
  );
}
