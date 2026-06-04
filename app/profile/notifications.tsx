import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../src/api/client';
import { NOTIFICATIONS_ENDPOINTS } from '../../src/constants/endpoints';
import { LoadingSpinner, EmptyState } from '../../src/components/shared';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import type { Notification } from '../../src/utils/types';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function load() {
    if (!user) { setLoading(false); return; }
    apiClient.get(NOTIFICATIONS_ENDPOINTS.LIST)
      .then(({ data }) => setNotifications(Array.isArray(data) ? data : data?.notifications || []))
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }

  useEffect(() => { load(); }, [user]);

  function onRefresh() { setRefreshing(true); load(); }

  async function markAllRead() {
    await apiClient.post(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function markOneRead(id: string) {
    await apiClient.post(NOTIFICATIONS_ENDPOINTS.MARK_READ(id)).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  }

  if (loading) return <LoadingSpinner fullScreen />;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      {unreadCount > 0 && (
        <TouchableOpacity style={s.markAllBtn} onPress={markAllRead}>
          <Text style={s.markAllText}>{t('notifications.card.markRead')} ({unreadCount})</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[s.list, notifications.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title={t('notifications.empty.all')}
            message={t('notifications.title')}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.item, !item.read && s.unread]}
            onPress={() => { if (!item.read) markOneRead(item._id); }}
            activeOpacity={0.85}
          >
            <View style={[s.iconBg, !item.read && s.iconBgUnread]}>
              <MaterialCommunityIcons
                name="bell"
                size={20}
                color={!item.read ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={s.itemContent}>
              <Text style={[s.itemTitle, !item.read && s.itemTitleBold]}>{item.title}</Text>
              <Text style={s.itemBody} numberOfLines={2}>{item.body}</Text>
              <Text style={s.itemDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            {!item.read && <View style={s.dot} />}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={s.separator} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  markAllBtn: {
    backgroundColor: Colors.white, padding: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  markAllText: { color: Colors.primary, fontWeight: '600', fontSize: 14, textAlign: 'right' },
  list: { flexGrow: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, padding: 16 },
  unread: { backgroundColor: Colors.primaryLight + '25' },
  iconBg: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  iconBgUnread: { backgroundColor: Colors.primaryLight },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, color: Colors.text, fontWeight: '500', marginBottom: 2 },
  itemTitleBold: { fontWeight: '700' },
  itemBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  itemDate: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.primary },
  separator: { height: 1, backgroundColor: Colors.border },
});
