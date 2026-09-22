import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/loading';
import ListingCard from '../../components/cards/ListingCard/ListingCard';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useFavoritesData } from '../../hooks/useFavoritesData';
import type { Favorite } from '../../util/types';
import type { ListingBase } from '../../util/types/listing.types';
import { createStyles } from '../../util/styles/profile/favorites.styles';
import { ROUTES, FAVORITES_H_PAD, FAVORITES_COL_GAP } from '../../constants/constants';

const NUM_COLUMNS = 2;

function toListingItem(fav: Favorite): ListingBase {
  return {
    _id: fav.itemId,
    id: fav.itemId,
    userId: fav.userId || '',
    title: fav.title,
    description: fav.description || '',
    price: fav.price ? Number(fav.price) : 0,
    region: '',
    city: '',
    images: fav.image ? [fav.image] : [],
    mainCategory: fav.category || '',
    createdAt: fav.createdAt,
    updatedAt: fav.createdAt,
  };
}

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    user,
    favorites,
    loading,
    refreshing,
    removing,
    error,
    onRefresh,
    handleRemove,
    handleCardPress,
  } = useFavoritesData();

  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  if (!user) {
    return (
      <View style={s.guestWrap}>
        <MaterialCommunityIcons name="heart-off-outline" size={64} color={Colors.gray300} />
        <Text style={s.guestTitle}>{t('mine.favorites.guestTitle')}</Text>
        <Text style={s.guestSub}>{t('mine.favorites.guestSub')}</Text>
        <TouchableOpacity style={s.signInBtn} onPress={() => router.push(ROUTES.login)}>
          <Text style={s.signInText}>{t('auth.login.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <View style={s.guestWrap}>
        <MaterialCommunityIcons name="wifi-off" size={64} color={Colors.gray300} />
        <Text style={s.guestTitle}>{t('mine.favorites.loadError')}</Text>
        <Text style={s.guestSub}>{t('mine.favorites.checkConnection')}</Text>
        <TouchableOpacity style={s.signInBtn} onPress={onRefresh}>
          <Text style={s.signInText}>{t('mine.favorites.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <FlashList
        data={favorites}
        keyExtractor={(fav) => fav.id || fav.itemId}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 84 }, favorites.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          favorites.length > 0 ? (
            <View style={s.listHeader}>
              <Text style={s.countText}>
                {t('mine.favorites.savedCount', { count: favorites.length })}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <View style={s.emptyIconCircle}>
              <MaterialCommunityIcons name="heart-outline" size={52} color={Colors.gray300} />
            </View>
            <Text style={s.emptyTitle}>{t('mine.favorites.emptyTitle')}</Text>
            <Text style={s.emptySub}>{t('mine.favorites.emptySub')}</Text>
            <TouchableOpacity
              style={s.browseBtn}
              onPress={() => router.push(ROUTES.home as any)}
            >
              <Text style={s.browseBtnText}>{t('mine.favorites.browseListings')}</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: fav, index }) => (
          <View
            style={{
              paddingLeft: index % NUM_COLUMNS === 0 ? FAVORITES_H_PAD : FAVORITES_COL_GAP / 2,
              paddingRight: (index + 1) % NUM_COLUMNS === 0 ? FAVORITES_H_PAD : FAVORITES_COL_GAP / 2,
              paddingBottom: FAVORITES_COL_GAP,
            }}
          >
            <ListingCard
              item={toListingItem(fav)}
              removing={removing.has(fav.itemId)}
              onPress={() => handleCardPress(fav)}
              onDelete={() => handleRemove(fav)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
