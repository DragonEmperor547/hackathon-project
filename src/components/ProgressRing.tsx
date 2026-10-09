import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/theme/useTheme';

interface Props {
  size: number;
  stroke: number;
  /** 0..1 */
  progress: number;
  color: string;
  trackColor?: string;
  /** Centred label. */
  children?: ReactNode;
}

export function ProgressRing({ size, stroke, progress, color, trackColor, children }: Props) {
  const { c } = useTheme();
  const r = (size - stroke) / 2;
  const mid = size / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={mid} cy={mid} r={r} fill="none" stroke={trackColor ?? c.border} strokeWidth={stroke} />
        {p > 0 ? (
          <Circle
            cx={mid}
            cy={mid}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            strokeDashoffset={circ * (1 - p)}
            transform={`rotate(-90 ${mid} ${mid})`}
          />
        ) : null}
      </Svg>
      {children}
    </View>
  );
}
