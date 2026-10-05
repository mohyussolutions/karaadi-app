import { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useGlobal } from '../../hooks/app/useResponsive';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../components/shared';
import MyAdCard from '../../components/cards/MyAdCard/MyAdCard';
import { LoadingSpinner } from '../../components/loading';
import { useThemeColors, useThemedStyles } from '../../hooks/app/useTheme';
import { createStyles } from '../../utils/styles/profile/myAds.styles';
import { useMyAds } from '../../hooks/auth/useAccount';
import { usePayForAd } from '../../hooks/business/usePayments';
import type { ListingBase, ListingFlatListRenderInfo } from '../../utils/types';
import { ROUTES } from '../../actions/constants';
import { fill, marginBottomOf } from '../../utils/styles/common/dynamic.styles';

export default function MyAdsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useGlobal();
  const { user, ads, loading, refreshing, error, deletingId, onRefresh, retry, handleDelete } = useMyAds();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles, width);
  const insets = useSafeAreaInsets();

  const handlePayNow = usePayForAd();

  const keyExtractor = useCallback((item: ListingBase) => item._id || item.id, []);

  const renderItem = useCallback(({ item }: ListingFlatListRenderInfo) => (
    <View style={styles.cardWrap}>
      <MyAdCard
        item={item}
        deleting={deletingId === (item._id || item.id)}
        onDelete={handleDelete}
        onPayNow={handlePayNow}
      />
    </View>
  ), [styles.cardWrap, deletingId, handleDelete, handlePayNow]);

  if (!user) {
    return (
      <View style={styles.center}>
        <EmptyState icon="lock-outline" title={t('signInRequired')} message={t('signInToView')} />
        <TouchableOpacity style={styles.btn} onPress={() => router.push(ROUTES.login)}>
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
      <FlatList overScrollMode="never"
        data={ads}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, ads.length === 0 && fill]}
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
        renderItem={renderItem}
      />
      <TouchableOpacity style={[styles.postBtn, marginBottomOf(insets.bottom + 84)]} onPress={() => router.push(ROUTES.newAd)}>
        <Text style={styles.postBtnText}>+ {t('postNewAd')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
