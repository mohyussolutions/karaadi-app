import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { createStyles } from '../../../../util/styles/profile/chat.styles';
import type { ChatComposerProps } from '../../../../util/types';

export function ChatComposer({ value, onChangeText, onSend, sending }: ChatComposerProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={t('chats.typeMessage')}
        placeholderTextColor={Colors.slate500}
        multiline
        maxLength={500}
        textAlignVertical="top"
        underlineColorAndroid="transparent"
      />
      <TouchableOpacity
        style={[styles.sendBtn, (!value.trim() || sending) && styles.sendBtnOff]}
        onPress={onSend}
        disabled={!value.trim() || sending}
      >
        {sending
          ? <ActivityIndicator size="small" color={Colors.white} />
          : <MaterialCommunityIcons name="send" size={20} color={value.trim() ? Colors.white : Colors.slate500} />
        }
      </TouchableOpacity>
    </View>
  );
}
