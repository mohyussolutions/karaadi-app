import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/loading';
import RemoteImage from '../../components/shared/RemoteImage';
import { useThemeColors, useThemedStyles } from '../../components/hooks/useTheme';
import { formatPrice, getImageUrl } from '../../util/helpers';
import { useFavoritesData, CATEGORY_LABELS, CATEGORY_COLOR_KEYS } from '../../components/hooks/useFavoritesData';
import type { Favorite } from '../../util/types';
import { createStyles, createCardStyles, H_PAD, COL_GAP } from '../../util/styles/profile/favorites.styles';

const NUM_COLUMNS = 2;

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
        <TouchableOpacity style={s.signInBtn} onPress={() => router.push('/(auth)/login')}>
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
              onPress={() => router.push('/(tabs)/home' as any)}
            >
              <Text style={s.browseBtnText}>{t('mine.favorites.browseListings')}</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: fav, index }) => (
          <View
            style={{
              paddingLeft: index % NUM_COLUMNS === 0 ? H_PAD : COL_GAP / 2,
              paddingRight: (index + 1) % NUM_COLUMNS === 0 ? H_PAD : COL_GAP / 2,
              paddingBottom: COL_GAP,
            }}
          >
            <FavCard
              fav={fav}
              isRemoving={removing.has(fav.itemId)}
              onPress={() => handleCardPress(fav)}
              onRemove={() => handleRemove(fav)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const FavCard = React.memo(
  ({
    fav,
    isRemoving,
    onPress,
    onRemove,
  }: {
    fav: Favorite;
    isRemoving: boolean;
    onPress: () => void;
    onRemove: () => void;
  }) => {
    const { t } = useTranslation();
    const Colors = useThemeColors();
    const s = useThemedStyles(createCardStyles);

    const catKey = String(fav.category || '').toLowerCase();
    const catLabel = CATEGORY_LABELS[catKey] || catKey;
    const catColor = Colors[CATEGORY_COLOR_KEYS[catKey]] || Colors.primary;
    const imageUri = getImageUrl(fav.image);
    const price = fav.price ? Number(fav.price) : 0;

    return (
      <TouchableOpacity
        style={[s.card, isRemoving && s.cardRemoving]}
        onPress={onPress}
        activeOpacity={0.88}
        disabled={isRemoving}
      >
        <View style={s.imgWrap}>
          {!!imageUri && (
            <RemoteImage source={{ uri: imageUri }} style={s.img} contentFit="cover" recyclingKey={fav.itemId} />
          )}

          {!!catLabel && (
            <View style={[s.catBadge, { backgroundColor: catColor }]}>
              <Text style={s.catLabel}>{catLabel}</Text>
            </View>
          )}

          <TouchableOpacity
            style={s.heartBtn}
            onPress={onRemove}
            disabled={isRemoving}
            hitSlop={6}
            activeOpacity={0.8}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color={Colors.favorite} />
            ) : (
              <MaterialCommunityIcons name="heart" size={16} color={Colors.favorite} />
            )}
          </TouchableOpacity>
        </View>

        <View style={s.body}>
          <Text style={s.title} numberOfLines={1}>
            {fav.title}
          </Text>
          {!!fav.description && (
            <Text style={s.description} numberOfLines={2}>
              {fav.description}
            </Text>
          )}
          <Text style={s.price} numberOfLines={1}>
            {price > 0 ? formatPrice(price) : t('priceOnRequest')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
