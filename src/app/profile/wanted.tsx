import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import ListingCard from '../../components/cards/ListingCard/ListingCard';
import { WantedAlertForm } from '../../components/management/create/new-ad/components/WantedAlertForm/WantedAlertForm';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { useAppTranslation } from '../../hooks/app/useAppTranslation';
import { useGlobal } from '../../hooks/app/useResponsive';
import { useSubscriptionRows } from '../../hooks/business/usePayments';
import { fetchMySubscriptions, deleteSubscription } from '../../actions/categories/subscription.actions';
import { useThemeColors, useThemedStyles } from '../../hooks/app/useTheme';
import { createStyles, createSheetInlineStyles } from '../../utils/styles/profile/wantedAlerts.styles';
import type { Subscription, SubscriptionRow, SubscriptionRowRenderInfo } from '../../utils/types';
import { ROUTES } from '../../actions/constants';
import { fixedWidth, paddingBottomOf } from '../../utils/styles/common/dynamic.styles';

export default function WantedScreen() {
  const { t } = useAppTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const sheetInline = useThemedStyles(createSheetInlineStyles);
  const insets = useSafeAreaInsets();
  const { twoColCardW } = useGlobal();
  const CARD_WIDTH = twoColCardW(16, 12);

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const data = await fetchMySubscriptions();
    setSubs(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      t('subscription.deleteAlertTitle'),
      t('subscription.deleteAlertMessage'),
      [
        { text: t('mine.businesses.cancel'), style: 'cancel' },
        {
          text: t('subscription.actions.delete'),
          style: 'destructive',
          onPress: () => {
            setSubs((prev) => prev.filter((s) => s.id !== id));
            deleteSubscription(id);
          },
        },
      ],
    );
  }, [t]);

  const rows = useSubscriptionRows(subs);

  const keyExtractor = useCallback((row: SubscriptionRow) => row.sub.id, []);

  const renderItem = useCallback(({ item }: SubscriptionRowRenderInfo) => (
    <View style={fixedWidth(CARD_WIDTH)}>
      <ListingCard
        item={item.listingItem}
        priceLabel={item.priceLabel}
        onDelete={() => handleDelete(item.sub.id)}
        onPress={() => router.push({ pathname: ROUTES.subscriptionDetail, params: { id: item.sub.id || item.sub._id || '' } })}
      />
    </View>
  ), [CARD_WIDTH, handleDelete, router]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="account-outline"
          title={t('subscription.signInPromptTitle')}
          message={t('subscription.signInPromptMsg')}
        />
      </SafeAreaView>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => setShowSheet(true)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="bell-plus-outline" size={20} color={Colors.white} />
        <Text style={styles.createBtnText}>{t('subscription.createNewAlert')}</Text>
      </TouchableOpacity>

      <Text style={sheetInline.hint}>{t('subscription.notifyHint')}</Text>

      <FlatList overScrollMode="never"
        data={rows}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, paddingBottomOf(insets.bottom + 84), subs.length === 0 && styles.flexFull]}
        ListEmptyComponent={
          <EmptyState
            icon="bell-alert-outline"
            title={t('subscription.noAlerts')}
            message={t('subscription.myAlertsEmpty')}
          />
        }
        renderItem={renderItem}
      />

      <WantedAlertForm
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onCreated={(created) => setSubs((prev) => [created, ...prev])}
      />
    </SafeAreaView>
  );
}
