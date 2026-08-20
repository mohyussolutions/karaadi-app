import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { useGlobal } from '../../components/hooks/useGlobal';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/loading';
import { EmptyState } from '../../components/shared';
import ListingCard from '../../components/cards/ListingCard';
import { useThemedStyles } from '../../components/hooks/useTheme';
import { createSubscriptionListStyles } from '../../util/styles/profile/profileSubscription.styles';
import { fetchMySubscriptions, deleteSubscription } from '../../actions/categories/subscription.actions';
import { subscriptionToListingItem, subscriptionPriceLabel } from '../../util/helpers';
import type { Subscription } from '../../util/types/listing.types';

const COLUMN_GAP = 10;
const H_PAD = 14;

export default function SubscriptionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { twoColCardW } = useGlobal();
  const CARD_WIDTH = twoColCardW(H_PAD, COLUMN_GAP);
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
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH }}>
            <ListingCard
              item={subscriptionToListingItem(item)}
              priceLabel={subscriptionPriceLabel(item, t('priceOnRequest'))}
              onDelete={() => handleDelete(item)}
              onPress={() => router.push({ pathname: '/listing/subscription/[id]', params: { id: item.id || item._id || '' } })}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
