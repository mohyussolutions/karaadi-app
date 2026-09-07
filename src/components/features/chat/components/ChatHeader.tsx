import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { createStyles } from '../../../../util/styles/profile/chat.styles';
import type { ChatHeaderProps } from '../../../../util/types';

export function ChatHeader({ username, userId, onBack, onBlockPress }: ChatHeaderProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const initial = (username?.[0] ?? '?').toUpperCase();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} hitSlop={10} style={styles.backBtn}>
        <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.primary} />
      </TouchableOpacity>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <Text style={[styles.headerName, { flex: 1 }]} numberOfLines={1}>
        {username || t('chats.chatFallback')}
      </Text>
      {!!userId && (
        <TouchableOpacity onPress={onBlockPress} hitSlop={10} style={styles.blockBtn}>
          <MaterialCommunityIcons name="block-helper" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}
