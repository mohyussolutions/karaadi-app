import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/loading';
import { EmptyState } from '../../components/shared';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createSubscriptionListStyles } from '../../util/styles/profile/profileSubscription.styles';
import { fetchMySubscriptions, deleteSubscription } from '../../api/categories/subscription.actions';
import type { Subscription } from '../../util/types/listing.types';

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createSubscriptionListStyles);

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchMySubscriptions();
    setSubs(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleDelete(item: Subscription) {
    Alert.alert(
      t('mine.subscriptions.deleteTitle', 'Delete subscription'),
      t('mine.subscriptions.deleteConfirm', 'Are you sure you want to delete this subscription?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('common.delete', 'Delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteSubscription(item.id || item._id || '');
            setSubs(prev => prev.filter(s => (s.id || s._id) !== (item.id || item._id)));
          },
        },
      ],
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={subs}
        keyExtractor={(item) => item.id || item._id || ''}
        contentContainerStyle={[styles.content, subs.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="bell-outline"
            title={t('mine.subscriptions.noSubscriptions', 'No subscriptions yet')}
            message={t('mine.subscriptions.noSubscriptionsSub', 'Your saved search alerts will appear here')}
          />
        }
        renderItem={({ item }) => {
          const isActive = item.isActive ?? (item.status === 'active');
          const priceRange = item.priceMin && item.priceMax
            ? `${item.priceMin} – ${item.priceMax}`
            : item.priceMax ? `≤ ${item.priceMax}`
            : item.priceMin ? `≥ ${item.priceMin}`
            : null;

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/listing/subscription/[id]', params: { id: item.id || item._id || '' } })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <MaterialCommunityIcons name="bell-outline" size={18} color={Colors.primary} />
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                </View>
                <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
                  <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextInactive]}>
                    {isActive ? t('mine.subscriptions.status.active', 'Active') : t('mine.subscriptions.status.expired', 'Expired')}
                  </Text>
                </View>
              </View>

              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons name="tag-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.metaText} numberOfLines={1}>{item.category}</Text>
                </View>
                {!!item.region && (
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.metaText} numberOfLines={1}>{item.region}</Text>
                  </View>
                )}
                {!!priceRange && (
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="currency-usd" size={13} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{priceRange}</Text>
                  </View>
                )}
                {!!item.notificationCount && (
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="bell-ring-outline" size={13} color={Colors.primary} />
                    <Text style={[styles.metaText, { color: Colors.primary }]}>{item.notificationCount} matches</Text>
                  </View>
                )}
              </View>

              {Array.isArray(item.cities) && item.cities.length > 0 && (
                <Text style={styles.cities} numberOfLines={1}>
                  {item.cities.join(' · ')}
                </Text>
              )}

              <View style={styles.cardFooter}>
                {!!item.createdAt && (
                  <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                )}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item)}
                  hitSlop={8}
                >
                  <MaterialCommunityIcons name="delete-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
