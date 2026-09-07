import { useCallback, useEffect, useMemo, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../../shared';
import { LoadingSpinner } from '../../../loading';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { createStyles } from '../../../../util/styles/profile/notifications.styles';
import { useNotificationsData } from '../../../../hooks/useNotificationsData';
import { useAuthStore } from '../../../../store/hooks/authStore';
import type { Notification } from '../../../../util/types';

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

  const handleItemPress = useCallback((item: Notification) => {
    if (!item.read) markOneRead(item._id);
  }, [markOneRead]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const renderItem = useCallback(({ item }: { item: Notification }) => (
    <NotificationRow item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  if (!user || loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
          <Text style={styles.markAllText}>{t('notifications.card.markRead')} ({unreadCount})</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 84 }, notifications.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title={t('notifications.empty.all')}
            message={t('notifications.empty.allSub')}
          />
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
