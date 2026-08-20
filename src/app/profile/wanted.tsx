import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import ListingCard from '../../components/cards/ListingCard';
import { WantedAlertForm } from '../../management/create/new-ad/components/WantedAlertForm';
import { useAuthStore } from '../../store/hooks/authStore';
import { useAppTranslation } from '../../components/hooks/useAppTranslation';
import { useGlobal } from '../../components/hooks/useGlobal';
import { fetchMySubscriptions, deleteSubscription } from '../../actions/categories/subscription.actions';
import { useThemeColors, useThemedStyles } from '../../components/hooks/useTheme';
import { createStyles, createSheetInlineStyles } from '../../util/styles/profile/wanted.styles';
import { subscriptionToListingItem, subscriptionPriceLabel } from '../../util/helpers';
import type { Subscription } from '../../util/types';

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

  function handleDelete(id: string) {
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
  }

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

      <FlatList
        data={subs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 84 }, subs.length === 0 && styles.flexFull]}
        ListEmptyComponent={
          <EmptyState
            icon="bell-alert-outline"
            title={t('subscription.noAlerts')}
            message={t('subscription.myAlertsEmpty')}
          />
        }
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH }}>
            <ListingCard
              item={subscriptionToListingItem(item)}
              priceLabel={subscriptionPriceLabel(item, t('priceOnRequest'))}
              onDelete={() => handleDelete(item.id)}
              onPress={() => router.push({ pathname: '/listing/subscription/[id]', params: { id: item.id || item._id || '' } })}
            />
          </View>
        )}
      />

      <WantedAlertForm
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onCreated={(created) => setSubs((prev) => [created, ...prev])}
      />
    </SafeAreaView>
  );
}
