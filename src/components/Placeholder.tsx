import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Temporary Phase 1.1 screen body. Delete once every screen is built.
export function Placeholder({ title, lines = [], links = [] }: { title: string; lines?: string[]; links?: string[] }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {lines.map((line) => (
        <Text key={line}>{line}</Text>
      ))}
      {links.map((href) => (
        <Link key={href} href={href as never} style={styles.link}>
          {href}
        </Link>
      ))}
      {router.canGoBack() && (
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#F3F5F9' },
  title: { fontSize: 24, fontWeight: '700', color: '#101828' },
  link: { fontSize: 16, color: '#2F5BEA', padding: 8 },
  back: { minHeight: 44, justifyContent: 'center' },
});
