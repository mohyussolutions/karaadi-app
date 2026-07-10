import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useGlobal } from '../../hooks/useGlobal';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/loading';
import { EmptyState } from '../../components/shared';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createSubscriptionListStyles } from '../../util/styles/profile/profileSubscription.styles';
import { fetchMySubscriptions, deleteSubscription } from '../../api/categories/subscription.actions';
import type { Subscription } from '../../util/types/listing.types';

const COLUMN_GAP = 10;
const H_PAD = 14;

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { twoColCardW } = useGlobal();
  const CARD_WIDTH = twoColCardW(H_PAD, COLUMN_GAP);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createSubscriptionListStyles);
  const insets = useSafeAreaInsets();

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
      t('mine.subscriptions.deleteConfirm', 'Remove this subscription alert?'),
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
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 84 }, subs.length === 0 && { flex: 1 }]}
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
              style={[styles.card, { width: CARD_WIDTH }]}
              activeOpacity={0.82}
              onPress={() => router.push({ pathname: '/listing/subscription/[id]', params: { id: item.id || item._id || '' } })}
            >
              {/* top: icon + delete */}
              <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="bell-outline" size={26} color={Colors.primary} />
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item)}
                  hitSlop={10}
                >
                  <MaterialCommunityIcons name="delete-outline" size={22} color={Colors.error} />
                </TouchableOpacity>
              </View>

              {/* title */}
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

              {/* category + region */}
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="tag-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.metaText} numberOfLines={1}>{item.category}</Text>
              </View>
              {!!item.region && (
                <View style={styles.metaRow}>
                  <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText} numberOfLines={1}>{item.region}</Text>
                </View>
              )}
              {!!priceRange && (
                <View style={styles.metaRow}>
                  <MaterialCommunityIcons name="currency-usd" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{priceRange}</Text>
                </View>
              )}

              {/* footer: status badge + date */}
              <View style={styles.cardFooter}>
                <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
                  <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextInactive]}>
                    {isActive ? t('mine.subscriptions.status.active') : t('mine.subscriptions.status.expired')}
                  </Text>
                </View>
                {!!item.createdAt && (
                  <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
