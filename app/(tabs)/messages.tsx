import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { getConversations } from '../../src/api/messages';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import EmptyState from '../../src/components/shared/EmptyState';
import { Colors } from '../../src/constants/colors';
import type { Conversation } from '../../src/types';

const AVATAR = 'https://placehold.co/48x48/9ca3af/ffffff?text=?';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
        <EmptyState icon="lock-outline" title="Sign in required" message="Sign in to view your messages." />
        <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={conversations.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <EmptyState icon="message-off-outline" title="No conversations yet" message="When you contact a seller, your chat will appear here." />
        }
        renderItem={({ item }) => {
          const other = item.otherUser;
          const avatar = other?.profileImage || AVATAR;
          const name = other?.username || 'Unknown';
          const lastMsg = item.lastMessage?.content || '';
          const unread = (item.unreadCount || 0) > 0;
          const time = item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString()
            : '';

          return (
            <TouchableOpacity
              style={[styles.convoItem, unread && styles.convoUnread]}
              onPress={() =>
                router.push({
                  pathname: '/profile/chat',
                  params: { userId: other?._id, username: name },
                })
              }
            >
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <View style={styles.convoInfo}>
                <View style={styles.convoHeader}>
                  <Text style={[styles.convoName, unread && styles.bold]}>{name}</Text>
                  <Text style={styles.convoTime}>{time}</Text>
                </View>
                <Text style={[styles.convoMsg, unread && styles.bold]} numberOfLines={1}>
                  {lastMsg || 'No messages yet'}
                </Text>
              </View>
              {unread && <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View>}
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
