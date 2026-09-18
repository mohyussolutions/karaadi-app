import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import RemoteImage from '../../../../shared/RemoteImage/RemoteImage';
import { useThemedStyles } from '../../../../../hooks/useTheme';
import { placeholderAvatar } from '../../../../../constants';
import { createStyles } from '../../../../../util/styles/tabs/messagesTab.styles';
import type { GroupedChat } from '../../../../../util/types';

const AVATAR = placeholderAvatar(48, '9ca3af', '?');

export const ConvoItem = memo(function ConvoItem({
  item, currentUserId, onPress,
}: {
  item: GroupedChat;
  currentUserId: string;
  onPress: (item: GroupedChat) => void;
}) {
  const { t } = useTranslation();
  const styles = useThemedStyles(createStyles);
  const other = item.senderId === currentUserId ? item.receiver : item.sender;
  const lastMsg = item.messages?.[0]?.content || '';
  const unreadCount = item.unreadTotal;
  const unread = unreadCount > 0;
  const time = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString()
    : '';

  return (
    <TouchableOpacity
      style={[styles.convoItem, unread && styles.convoUnread]}
      onPress={() => onPress(item)}
    >
      <RemoteImage
        source={{ uri: other?.profileImage || AVATAR }}
        style={styles.avatar}
        contentFit="cover"
        recyclingKey={String(item.id)}
      />
      <View style={styles.convoInfo}>
        <View style={styles.convoHeader}>
          <Text style={[styles.convoName, unread && styles.bold]}>
            {other?.username || t('messages.unknownSender')}
          </Text>
          <Text style={styles.convoTime}>{time}</Text>
        </View>
        <Text style={[styles.convoMsg, unread && styles.bold]} numberOfLines={1}>
          {lastMsg || t('messages.noMessagesPreview')}
        </Text>
      </View>
      {unread && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});
