import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/useTheme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  /** Vertical gap between direct children (Home uses 20, most screens 16). */
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

/** Safe-area screen with the app background and 20px side padding. */
export function Screen({ children, scroll, gap = 16, style }: Props) {
  const { c } = useTheme();
  const inner: ViewStyle = { paddingHorizontal: 20, paddingTop: 12, gap };
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={[inner, { paddingBottom: 24 }, style]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, inner, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
