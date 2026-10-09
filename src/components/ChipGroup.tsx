import { Pressable, Text, View } from 'react-native';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Props<K extends string> {
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}

/** Wrapping filter chips; the selected one is filled with the inverse colour. */
export function ChipGroup<K extends string>({ options, value, onChange }: Props<K>) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const selected = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.key)}
            hitSlop={3}
            style={({ pressed }) => ({
              height: 38,
              paddingHorizontal: 14,
              borderRadius: 999,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: selected ? c.inverse : c.border,
              backgroundColor: selected ? c.inverse : c.surface,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: selected ? c.onInverse : c.text }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
