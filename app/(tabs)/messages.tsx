import { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import { useThemedStyles } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useChatsData } from '../../hooks/useChatsData';
import { useAppSelector } from '../../store/store';
import { placeholderAvatar } from '../../constants';
import { createStyles } from '../../utils/styles/tabs/messages.styles';
import type { Chat } from '../../utils/types';

const AVATAR = placeholderAvatar(48, '9ca3af', '?');

export default function MessagesScreen() {
  const router = useRouter();
  const { user, chats, loaded } = useChatsData();
  const authLoading = useAppSelector((s) => s.auth.loading);
  const { isTablet } = useResponsive();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user]);

  if (!user) return <LoadingSpinner fullScreen />;

  if (!loaded) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={[styles.header, isTablet && styles.tabletHeader]}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.center} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={[styles.header, isTablet && styles.tabletHeader]}><Text style={styles.title}>Messages</Text></View>
      <FlatList
        style={isTablet && styles.tabletList}
        data={chats}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={chats.length === 0 ? styles.listFlex : undefined}
        ListEmptyComponent={
          <EmptyState icon="message-off-outline" title="No conversations yet" message="When you contact a seller, your chat will appear here." />
        }
        renderItem={({ item }: { item: Chat }) => {
          const other = item.senderId === user.id ? item.receiver : item.sender;
          const lastMsg = item.messages?.[0]?.content || '';
          const unreadCount = item._count?.messages ?? 0;
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
                    chatId: String(item.id),
                    userId: other?.id,
                    username: other?.username || 'Unknown',
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
                    {other?.username || 'Unknown'}
                  </Text>
                  <Text style={styles.convoTime}>{time}</Text>
                </View>
                <Text style={[styles.convoMsg, unread && styles.bold]} numberOfLines={1}>
                  {lastMsg || 'No messages yet'}
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
