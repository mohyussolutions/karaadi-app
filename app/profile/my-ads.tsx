import React from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MyAdCard, EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../utils/styles/profile/myAds.styles';
import { useMyAds } from '../../hooks/useMyAds';
import { useAppDispatch } from '../../store';
import { prefillForPayment } from '../../store/slices/newAdSlice';
import type { ListingBase } from '../../utils/types';

export default function MyAdsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, ads, loading, refreshing, error, deletingId, onRefresh, retry, handleDelete } = useMyAds();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  function handlePayNow(item: ListingBase) {
    dispatch(prefillForPayment({
      categoryKey: item.mainCategory,
      createdId: item._id || item.id,
      createdTitle: item.title,
      createdItem: {
        title: item.title,
        price: item.price,
        images: item.images,
        categoryTag: item.category || item.mainCategory,
        mainCategory: item.mainCategory,
        region: item.region || undefined,
        city: item.city || undefined,
        description: item.description || undefined,
      },
    }));
    router.push('/(tabs)/new-ad');
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <EmptyState icon="lock-outline" title={t('signInRequired')} message={t('signInToView')} />
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.btnText}>{t('auth.login.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !refreshing) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="wifi-off"
          title={t('mine.myAds.loadError')}
          message={t('mine.myAds.checkConnection')}
        />
        <TouchableOpacity style={styles.btn} onPress={retry}>
          <Text style={styles.btnText}>{t('mine.myAds.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={ads}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, ads.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          ads.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.countText}>
                {t('mine.myAds.listingsCount', { count: ads.length })}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-off-outline"
            title={t('mine.myAds.empty')}
            message={t('mine.myAds.emptyHint')}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <MyAdCard
              item={item}
              deleting={deletingId === (item._id || item.id)}
              onDelete={handleDelete}
              onPayNow={handlePayNow}
            />
          </View>
        )}
      />
      <TouchableOpacity style={styles.postBtn} onPress={() => router.push('/(tabs)/new-ad')}>
        <Text style={styles.postBtnText}>+ {t('postNewAd')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
