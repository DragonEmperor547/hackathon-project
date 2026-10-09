import Feather from '@expo/vector-icons/Feather';
import { Text, View } from 'react-native';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SegmentedControl } from '@/components/SegmentedControl';
import { STUDENT } from '@/data/student';
import { confirm } from '@/lib/confirm';
import { useAppStore } from '@/store/useAppStore';
import { fonts, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function SettingsScreen() {
  const { c } = useTheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const resetDemo = useAppStore((s) => s.resetDemo);

  return (
    <Screen scroll>
      <BackButton />
      <Text accessibilityRole="header" style={[type.display, { color: c.text }]}>
        Settings
      </Text>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: c.inverse }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: c.onInverse }}>{STUDENT.initials}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: c.text }}>{STUDENT.name}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: c.textMuted }}>
            {STUDENT.program} · Semester {STUDENT.semester}
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>Roll no. {STUDENT.rollNo}</Text>
        </View>
      </Card>

      <View style={{ gap: 10 }}>
        <Text style={[type.section, { fontSize: 17, color: c.text }]}>Appearance</Text>
        <SegmentedControl
          options={[
            { key: 'system', label: 'System' },
            { key: 'light', label: 'Light' },
            { key: 'dark', label: 'Dark' },
          ]}
          value={themeMode}
          onChange={setThemeMode}
        />
      </View>

      <Card
        onPress={() =>
          confirm('Reset demo data?', 'Tasks and read notices go back to the original sample data.', 'Reset', resetDemo)
        }
        accessibilityLabel="Reset demo data"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
      >
        <Feather name="rotate-ccw" size={20} color={c.danger} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.danger }}>Reset demo data</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMuted }}>Restores the sample tasks and notices.</Text>
        </View>
      </Card>

      <Text style={{ textAlign: 'center', fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>
        Campus Companion 1.0 · Loopverse 3.0 · Fonts: Google Fonts (OFL) · Icons: Feather
      </Text>
    </Screen>
  );
}
