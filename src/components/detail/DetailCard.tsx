import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface SpecRow { label: string; value: string }

interface Props {
  title: string;
  rows: SpecRow[];
  children?: React.ReactNode;
}

export function DetailCard({ title, rows, children }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      {rows.map(({ label, value }, i) => (
        <View key={label} style={[s.row, i === rows.length - 1 && !children && s.rowLast]}>
          <Text style={s.key}>{label}</Text>
          <Text style={s.val}>{value}</Text>
        </View>
      ))}
      {children}
    </View>
  );
}

export function SpecGrid({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      <View style={s.grid}>
        {items.map(({ label, value }) => (
          <View key={label} style={s.gridItem}>
            <Text style={s.gridLabel}>{label}</Text>
            <Text style={s.gridValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  cardTitle: {
    fontSize: 12, fontWeight: '700', color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  key: { fontSize: 14, color: '#6B7280' },
  val: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'right', flex: 1, marginLeft: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: { width: '45%' },
  gridLabel: { fontSize: 10, fontWeight: '800', color: '#3B82F6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  gridValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
});
