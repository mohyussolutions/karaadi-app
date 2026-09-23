import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../../../shared';
import { LoadingSpinner } from '../../../../loading';
import { useThemeColors, useThemedStyles } from '../../../../../hooks/useTheme';
import { createStyles } from '../../../../../util/styles/profile/notifications.styles';
import { useNotificationsData } from '../../../../../hooks/useNotificationsData';
import { useUnreadCount } from '../../../../../hooks/useUnreadCount';
import { useAuthStore } from '../../../../../store/hooks/authStore';
import { handleNotificationData } from '../../../../../hooks/useNotificationTap';
import type { Notification, NotificationFilter } from '../../../../../util/types';
import { FILTERS, ICON_BY_TYPE } from "../../../../../constants";
const NotificationRow = memo(function NotificationRow({
  item, onPress,
}: {
  item: Notification;
  onPress: (item: Notification) => void;
}) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      style={[styles.item, !item.read && styles.unread]}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={[styles.iconBg, !item.read && styles.iconBgUnread]}>
        <MaterialCommunityIcons
          name={ICON_BY_TYPE[item.type] ?? 'bell'}
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
  );
});

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuthStore();
  const { notifications, loading, refreshing, onRefresh, markAllRead, markOneRead } = useNotificationsData();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user]);

  const [filter, setFilter] = useState<NotificationFilter>('all');

  const handleItemPress = useCallback((item: Notification) => {
    if (!item.read) markOneRead(item._id);
    const data = item.data ?? {};
    if (data.chatId || data.listingId) handleNotificationData(router, data);
  }, [markOneRead, router]);

  const unreadCount = useUnreadCount(notifications);
  const readCount = notifications.length - unreadCount;

  const visible = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const countFor = (f: NotificationFilter) =>
    f === 'unread' ? unreadCount : f === 'read' ? readCount : notifications.length;

  const renderItem = useCallback(({ item }: { item: Notification }) => (
    <NotificationRow item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  if (!user || (loading && notifications.length === 0)) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.toolbar}>
        <View style={styles.tabs}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setFilter(f)}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>
                  {t(`notifications.tabs.${f}`)} ({countFor(f)})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} hitSlop={8}>
            <Text style={styles.markAllText}>{t('notifications.card.markRead')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList overScrollMode="never"
        data={visible}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 84 }, visible.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title={t(`notifications.empty.${filter}`)}
            message={filter === 'all' ? t('notifications.empty.allSub') : undefined}
          />
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
