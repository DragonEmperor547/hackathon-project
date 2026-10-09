import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Props {
  eyebrow: string;
  title: string;
  meta: { icon: ComponentProps<typeof Feather>['name']; label: string }[];
  onPress: () => void;
  accessibilityLabel: string;
}

/** Home "next class" hero: primary card with the ring + highlight-circle graphic (mockups 01 / 11). */
export function HeroCard({ eyebrow, title, meta, onPress, accessibilityLabel }: Props) {
  const { c, scheme } = useTheme();
  const dark = scheme === 'dark';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        overflow: 'hidden',
        gap: 10,
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: c.heroBorder,
        backgroundColor: c.heroBg,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Svg width={200} height={200} viewBox="0 0 200 200" style={{ position: 'absolute', right: -56, top: -44 }}>
        <Circle cx={100} cy={100} r={78} fill="none" stroke={c.heroDecor} strokeOpacity={dark ? 0.18 : 0.12} strokeWidth={22} />
        <Circle cx={100} cy={100} r={34} fill={c.highlight} />
        <Circle cx={100} cy={100} r={12} fill={c.heroBg} />
        <Path
          d="M22 100a78 78 0 0 1 78-78"
          fill="none"
          stroke={c.heroDecor}
          strokeOpacity={dark ? 0.7 : 0.5}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.heroPill }}>
        <Text style={[type.pill, { color: c.heroPillInk, letterSpacing: 0.66 }]}>{eyebrow}</Text>
      </View>
      <Text style={[type.hero, { color: c.onInverse, maxWidth: 220 }]}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 8 }}>
        {meta.map((m) => (
          <View key={m.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather name={m.icon} size={16} color={c.heroInk} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: c.heroInk }}>{m.label}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}
