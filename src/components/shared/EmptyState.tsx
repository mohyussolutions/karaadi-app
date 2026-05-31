import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface Props {
  icon?: string;
  title: string;
  message?: string;
}

export default function EmptyState({ icon = 'inbox-outline', title, message }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon as any} size={56} color={Colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
