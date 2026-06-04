import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import COLORS from '../../constants/colors';
import { formatPrice, getImageUrl } from '../format';
import { addFavorite, removeFavorite } from '../../api/favorites';
import { useAppSelector } from '../../store';
import { PLACEHOLDER_IMAGE } from '../../constants/endpoints';
import type { ListingBase } from '../../utils/types/listing.types';

const { width } = Dimensions.get('window');
const CARD_IMG_H = Math.round((width / 2 - 20) * 0.72);

interface Props {
  item: ListingBase;
  onPress?: () => void;
}

const ListingCard = React.memo(function ListingCard({ item, onPress }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const image = getImageUrl(item.images?.[0]) || PLACEHOLDER_IMAGE;
  const [fav, setFav] = useState(false);

  function handlePress() {
    if (onPress) { onPress(); return; }
    const cat = (item.mainCategory || item.category || '').toLowerCase();
    const itemId = item.id || item._id;
    if (cat === 'marketplace') {
      router.push({ pathname: '/listing/marketplace/[id]' as any, params: { id: itemId, category: cat } });
    } else if (['cars', 'motorcycles', 'boats', 'farm-equipment', 'farmequipment'].includes(cat)) {
      router.push({ pathname: '/listing/vehicle/[id]' as any, params: { id: itemId, category: cat } });
    } else if (cat === 'real-estate' || cat === 'realestate') {
      router.push({ pathname: '/listing/real-estate/[id]' as any, params: { id: itemId, category: cat } });
    } else if (cat === 'jobs') {
      router.push({ pathname: '/listing/job/[id]' as any, params: { id: itemId, category: cat } });
    } else {
      router.push({ pathname: '/listing/marketplace/[id]' as any, params: { id: itemId, category: cat } });
    }
  }

  async function toggleFav(e: any) {
    e.stopPropagation();
    if (!user) { router.push('/(auth)/login'); return; }
    const next = !fav;
    setFav(next);
    if (next) {
      await addFavorite(item.id || item._id, (item as any).mainCategory || '').catch(() => setFav(false));
    } else {
      await removeFavorite(item.id || item._id).catch(() => setFav(true));
    }
  }

  return (
    <TouchableOpacity style={s.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={s.imgWrap}>
        <Image source={{ uri: image }} style={[s.img, { height: CARD_IMG_H }]} resizeMode="cover" />

        {item.maGaday && (
          <View style={s.soldOverlay}>
            <Text style={s.soldText}>{t('realEstateDetail.waaLaGatay')}</Text>
          </View>
        )}

        <TouchableOpacity style={s.heartBtn} onPress={toggleFav} hitSlop={10}>
          <MaterialCommunityIcons
            name={fav ? 'heart' : 'heart-outline'}
            size={16}
            color={fav ? '#EF4444' : COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <View style={s.body}>
        <Text style={s.price} numberOfLines={1}>
          {item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}
        </Text>
        <Text style={s.title} numberOfLines={2}>{item.title}</Text>
        {(item.city || item.region) && (
          <View style={s.locRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={10} color={COLORS.textMuted} />
            <Text style={s.locText} numberOfLines={1}>
              {[item.city, item.region].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

export default ListingCard;

const s = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imgWrap: { position: 'relative', backgroundColor: COLORS.gray100 },
  img: { width: '100%' },
  soldOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.50)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
  heartBtn: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 8, gap: 2 },
  price: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  title: { fontSize: 12, fontWeight: '600', color: '#111827', lineHeight: 17 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  locText: { fontSize: 10, color: COLORS.textMuted, flex: 1 },
});
