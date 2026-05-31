import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';
import { NOTIFICATIONS_ENDPOINTS } from '../../src/api/urls';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import EmptyState from '../../src/components/shared/EmptyState';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import type { Notification } from '../../src/types';

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiClient.get(NOTIFICATIONS_ENDPOINTS.LIST)
      .then(({ data }) => setNotifications(Array.isArray(data) ? data : data?.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  async function markAllRead() {
    await apiClient.post(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (loading) return <LoadingSpinner fullScreen />;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
          <Text style={styles.markAllText}>Mark all as read ({unreadCount})</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[styles.list, notifications.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="bell-off-outline" title="No notifications" message="You're all caught up!" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.read && styles.unread]}
            onPress={() => {
              if (!item.read) {
                apiClient.post(NOTIFICATIONS_ENDPOINTS.MARK_READ(item._id)).catch(() => {});
                setNotifications((prev) =>
                  prev.map((n) => (n._id === item._id ? { ...n, read: true } : n))
                );
              }
            }}
          >
            <View style={[styles.iconBg, !item.read && styles.iconBgUnread]}>
              <MaterialCommunityIcons
                name="bell"
                size={20}
                color={!item.read ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, !item.read && styles.itemTitleBold]}>{item.title}</Text>
              <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text>
              <Text style={styles.itemDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  markAllBtn: {
    backgroundColor: Colors.white, padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  markAllText: { color: Colors.primary, fontWeight: '600', fontSize: 14, textAlign: 'right' },
  list: { flexGrow: 1 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, padding: 16,
  },
  unread: { backgroundColor: Colors.primaryLight + '30' },
  iconBg: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center',
  },
  iconBgUnread: { backgroundColor: Colors.primaryLight },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, color: Colors.text, fontWeight: '500', marginBottom: 2 },
  itemTitleBold: { fontWeight: '700' },
  itemBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  itemDate: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.primary },
  separator: { height: 1, backgroundColor: Colors.border },
});
