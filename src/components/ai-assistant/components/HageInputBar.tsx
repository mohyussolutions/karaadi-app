import React from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../../util/styles/layout/hage.styles';
import type { HageInputBarProps } from '../../../util/types';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../common/common-for-ios-andriod';

export function HageInputBar({ value, onChangeText, onSend, loading, placeholder, insets }: HageInputBarProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <KeyboardAvoidingView behavior={KEYBOARD_AVOIDING_BEHAVIOR}>
      <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          onSubmitEditing={onSend}
          returnKeyType="send"
          editable={!loading}
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!value.trim() || loading) && styles.sendBtnDisabled]}
          onPress={onSend}
          disabled={!value.trim() || loading}
        >
          <MaterialCommunityIcons
            name="send"
            size={18}
            color={value.trim() && !loading ? Colors.white : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
