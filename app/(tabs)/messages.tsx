import { useEffect, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import { useThemedStyles } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useChatsData } from '../../hooks/useChatsData';
import { useAppSelector } from '../../store/store';
import { placeholderAvatar } from '../../constants';
import { createStyles } from '../../util/styles/tabs/messages.styles';
import type { Chat } from '../../util/types';

const AVATAR = placeholderAvatar(48, '9ca3af', '?');

export default function MessagesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, chats, loaded } = useChatsData();
  const authLoading = useAppSelector((s) => s.auth.loading);
  const { isTablet } = useResponsive();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user]);

  const groupedChats = useMemo(() => {
    if (!user) return [];
    const byUser = new Map<string, Chat & { allIds: number[]; unreadTotal: number }>();
    for (const item of chats) {
      const other = item.senderId === user.id ? item.receiver : item.sender;
      const key = other?.id ? String(other.id) : `chat-${item.id}`;
      const unread = item._count?.messages ?? 0;
      const existing = byUser.get(key);
      if (existing) {
        existing.allIds.push(item.id);
        existing.unreadTotal += unread;
        if (item.updatedAt && (!existing.updatedAt || new Date(item.updatedAt) > new Date(existing.updatedAt))) {
          existing.updatedAt = item.updatedAt;
          if (item.messages?.[0]) existing.messages = item.messages;
        }
      } else {
        byUser.set(key, { ...item, allIds: [item.id], unreadTotal: unread });
      }
    }
    return [...byUser.values()];
  }, [chats, user]);

  if (!user) return <LoadingSpinner fullScreen />;

  if (!loaded) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={[styles.header, isTablet && styles.tabletHeader]}>
          <Text style={styles.title}>{t('messages.title')}</Text>
        </View>
        <View style={styles.center} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={[styles.header, isTablet && styles.tabletHeader]}><Text style={styles.title}>{t('messages.title')}</Text></View>
      <FlatList
        style={isTablet && styles.tabletList}
        data={groupedChats}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={groupedChats.length === 0 ? styles.listFlex : styles.listPadded}
        ListEmptyComponent={
          <EmptyState icon="message-off-outline" title={t('messages.noConversationsTitle')} message={t('messages.noConversationsMessage')} />
        }
        renderItem={({ item }: { item: Chat & { allIds: number[]; unreadTotal: number } }) => {
          const other = item.senderId === user.id ? item.receiver : item.sender;
          const lastMsg = item.messages?.[0]?.content || '';
          const unreadCount = item.unreadTotal;
          const unread = unreadCount > 0;
          const time = item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString()
            : '';

          return (
            <TouchableOpacity
              style={[styles.convoItem, unread && styles.convoUnread]}
              onPress={() =>
                router.push({
                  pathname: '/profile/chat',
                  params: {
                    chatId: item.allIds.join(','),
                    userId: other?.id,
                    username: other?.username || t('messages.unknownSender'),
                  },
                })
              }
            >
              <Image
                source={{ uri: other?.profileImage || AVATAR }}
                style={styles.avatar}
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
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
