import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/store/authStore';
import { getMyChats } from '../../src/api/messages';
import { getSocket } from '../../src/services/socketService';
import { LoadingSpinner, EmptyState } from '../../src/components/shared';
import { Colors } from '../../src/constants/colors';
import type { Chat } from '../../src/utils/types';

const AVATAR = 'https://placehold.co/48x48/9ca3af/ffffff?text=?';

export default function MessagesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChats = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const data = await getMyChats(user.id);
      setChats(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => {
    setLoading(true);
    loadChats();
  }, [loadChats]));

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = () => loadChats();
    socket.on('newMessage', handler);
    socket.on('unreadCountUpdate', handler);
    return () => {
      socket.off('newMessage', handler);
      socket.off('unreadCountUpdate', handler);
    };
  }, [loadChats]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
        <EmptyState icon="lock-outline" title={t('signInRequired')} message={t('signInToView')} />
        <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
      <FlatList
        data={chats}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={chats.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <EmptyState icon="message-off-outline" title="No conversations yet" message="When you contact a seller, your chat will appear here." />
        }
        renderItem={({ item }) => {
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  convoItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    backgroundColor: Colors.white, gap: 12,
  },
  convoUnread: { backgroundColor: Colors.primaryLight + '40' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.border },
  convoInfo: { flex: 1 },
  convoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  convoName: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  convoTime: { fontSize: 12, color: Colors.textMuted },
  convoMsg: { fontSize: 13, color: Colors.textSecondary },
  bold: { fontWeight: '700', color: Colors.text },
  badge: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  separator: { height: 1, backgroundColor: Colors.border },
  signInBtn: {
    margin: 24, backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  signInText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
