import { View } from 'react-native';

interface Props {
  /** 0..1 */
  progress: number;
  color: string;
  trackColor: string;
  height?: number;
}

export function ProgressBar({ progress, color, trackColor, height = 8 }: Props) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(p * 100) }}
      style={{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: 'hidden' }}
    >
      <View style={{ width: `${p * 100}%`, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}
