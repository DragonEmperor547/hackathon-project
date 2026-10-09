import { Pressable, Text, View } from 'react-native';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Props {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
}

export function SectionHeader({ title, linkLabel, onLinkPress }: Props) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text accessibilityRole="header" style={[type.section, { color: c.text }]}>
        {title}
      </Text>
      {linkLabel ? (
        <Pressable accessibilityRole="link" onPress={onLinkPress} hitSlop={12}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: c.link }}>{linkLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
