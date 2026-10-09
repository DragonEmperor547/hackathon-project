import { Pressable, Text, View } from 'react-native';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Props<K extends string> {
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}

export function SegmentedControl<K extends string>({ options, value, onChange }: Props<K>) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 4, gap: 4, borderRadius: 16, backgroundColor: c.border }}>
      {options.map((o) => {
        const selected = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.key)}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? c.surface : 'transparent',
            }}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
