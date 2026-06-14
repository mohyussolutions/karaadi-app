import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { formatPrice, getImageUrl, truncate } from '../../util/helpers';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { getListingDetailRoute } from '../../util/helpers';
import { cacheListing } from '../../services/listingCache';
import { showToast } from '../../services/toastService';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import type { ListingCardProps } from '../../util/types';
import { createStyles } from '../../util/styles/shared/listingCard.styles';

const ListingCard = React.memo(function ListingCard({ item, onPress, categoryKey }: ListingCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const listingId = item.id || item._id;
  const image = getImageUrl(item.images?.[0]) || PLACEHOLDER_IMAGE;
  const user = useAppSelector((s) => s.auth.user);
  const isFav = useAppSelector((s) => s.favorites.ids.includes(listingId));

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const category = categoryKey || item.mainCategory || item.category;
  const isWanted = (category || '').toLowerCase() === 'subscription';

  function handlePress() {
    if (onPress) { onPress(); return; }
    cacheListing(listingId, item);
    router.push(getListingDetailRoute(item, categoryKey) as any);
  }

  async function handleHeart(e: any) {
    e.stopPropagation();
    if (!user) { router.push('/(auth)/login'); return; }
    const willSave = !isFav;
    try {
      await dispatch(toggleFavorite({ itemId: listingId, wasFav: isFav, listing: item, categoryHint: categoryKey })).unwrap();
      showToast({
        message: willSave ? 'Saved to favorites' : 'Removed from favorites',
        type: willSave ? 'saved' : 'removed',
        onView: willSave ? () => router.push('/profile/favorites') : undefined,
      });
    } catch {
      showToast({ message: 'Could not update favorites', type: 'removed' });
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.88}>
      <View style={styles.imgWrap}>
        <Image
          source={{ uri: image }}
          style={styles.img}
          resizeMode="cover"
        />

        {item.maGaday ? (
          <View style={[styles.badge, styles.badgeSold]}>
            <Text style={styles.badgeText}>{t('common.sold')}</Text>
          </View>
        ) : isWanted ? (
          <View style={[styles.badge, styles.badgeWanted]}>
            <Text style={styles.badgeText}>{t('subscription.wanted')}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.heartBtn, isFav && styles.heartBtnActive]}
          onPress={handleHeart}
          hitSlop={6}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={isFav ? 'heart' : 'heart-outline'}
            size={16}
            color={isFav ? Colors.favorite : Colors.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        {item.description ? (
          <Text style={styles.description} numberOfLines={1}>{truncate(item.description, 80)}</Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.price} numberOfLines={1}>
            {item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}
          </Text>

          {(item.city || item.region) && (
            <View style={styles.locRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={10} color={Colors.successDark} />
              <Text style={styles.locText} numberOfLines={1}>
                {item.city || item.region}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ListingCard;
