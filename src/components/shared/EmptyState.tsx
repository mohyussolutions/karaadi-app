import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

interface Props {
  icon?: string;
  title: string;
  message?: string;
}

export default function EmptyState({ icon = 'inbox-outline', title, message }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon as any} size={56} color={COLORS.gray300} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'center' },
  message: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
});
