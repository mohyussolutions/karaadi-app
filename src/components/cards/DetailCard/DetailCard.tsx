import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../hooks/useTheme';

import type { DetailCardProps } from '../../../util/types';
import { createStyles } from '../../../util/styles/detail/detailCard.styles';

export function DetailCard({ title, rows, children }: DetailCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {rows.map(({ label, value }, i) => (
        <View key={label} style={[styles.row, i === rows.length - 1 && !children && styles.rowLast]}>
          <Text style={styles.key}>{label}</Text>
          <Text style={styles.val}>{value}</Text>
        </View>
      ))}
      {children}
    </View>
  );
}

export { SpecGrid } from './SpecGrid';
