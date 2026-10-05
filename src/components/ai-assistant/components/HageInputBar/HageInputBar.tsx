import { View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/app/useTheme';
import { createStyles } from '../../../../utils/styles/layout/hageAssistant.styles';
import type { HageInputBarProps } from '../../../../utils/types';
import { KEYBOARD_AVOIDING_BEHAVIOR } from "../../../../lib/platform/platform";
import { paddingBottomOf } from '../../../../utils/styles/common/dynamic.styles';
import { INPUT_LIMITS } from '../../../../actions/constants';

export function HageInputBar({ value, onChangeText, onSend, loading, placeholder, insets }: HageInputBarProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <KeyboardAvoidingView behavior={KEYBOARD_AVOIDING_BEHAVIOR}>
      <View style={[styles.inputRow, paddingBottomOf(Math.max(insets.bottom, 12))]}>
        <TextInput
          style={styles.input}
          value={value}
          maxLength={INPUT_LIMITS.longText}
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
