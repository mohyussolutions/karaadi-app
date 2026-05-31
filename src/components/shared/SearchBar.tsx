import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
}

export default function SearchBar({ value, onChangeText, placeholder, onSubmit, onClear }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search listings...'}
        placeholderTextColor={Colors.placeholder}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => { onChangeText(''); onClear?.(); }}>
          <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  icon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
});
