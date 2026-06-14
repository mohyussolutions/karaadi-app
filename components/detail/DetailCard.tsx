import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../hooks/useTheme';

import type { SpecRow, DetailCardProps } from '../../util/types';
import { createStyles } from '../../util/styles/detail/DetailCard.styles';

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

export function SpecGrid({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.grid}>
        {items.map(({ label, value }) => (
          <View key={label} style={styles.gridCell}>
            <Text style={styles.gridLabel}>{label}</Text>
            <Text style={styles.gridValue} numberOfLines={2}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
