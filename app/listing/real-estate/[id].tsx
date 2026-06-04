import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../src/constants/colors';
import { LoadingSpinner } from '../../../src/components/shared';
import { apiClient } from '../../../src/api/client';
import { REAL_ESTATE_ENDPOINTS } from '../../../src/constants/endpoints';
import { addFavorite, removeFavorite, checkFavorite } from '../../../src/api/favorites';
import { useAuthStore } from '../../../src/store/authStore';
import { getImageUrl, formatPrice, formatDate } from '../../../src/components/format';
import ImageGallery from '../../../src/components/detail/ImageGallery';
import ZoomModal from '../../../src/components/detail/ZoomModal';
import SellerCard from '../../../src/components/detail/SellerCard';
import { SpecGrid } from '../../../src/components/detail/DetailCard';

const PLACEHOLDER = 'https://placehold.co/800x560/e5e7eb/9ca3af?text=No+Image';

const AMENITY_ICONS: Record<string, string> = {
  swimmingPool: 'pool', gym: 'dumbbell', security: 'shield-check-outline',
  elevator: 'elevator', generator: 'lightning-bolt', waterSupply: 'water',
  airConditioning: 'snowflake', garden: 'flower-outline', balcony: 'home-outline', parking: 'parking',
};
const AMENITY_KEYS = Object.keys(AMENITY_ICONS);

export default function RealEstateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.BY_ID(id));
        setItem({ ...data, id: data.id || data._id });
        if (user) {
          const fav = await checkFavorite(id, 'real-estate');
          setIsFavorite(fav);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  async function toggleFav() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (isFavorite) { setIsFavorite(false); await removeFavorite(id).catch(() => setIsFavorite(true)); }
    else { setIsFavorite(true); await addFavorite(id, 'real-estate').catch(() => setIsFavorite(false)); }
  }

  function handleContact() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (item?.userId) {
      router.push({ pathname: '/profile/chat', params: { userId: item.userId, username: item.user?.username || 'Seller', listingId: id } });
    }
  }

  function handleCall() {
    const phone = item?.user?.phone;
    if (phone) Linking.openURL(`tel:${phone}`);
  }

  if (loading) return <LoadingSpinner fullScreen />;
  if (!item) {
    return (
      <View style={s.errorWrap}>
        <MaterialCommunityIcons name="alert-circle-outline" size={52} color={Colors.textMuted} />
        <Text style={s.errorTitle}>{t('realEstateDetail.listingNotFound')}</Text>
        <TouchableOpacity style={s.errorBack} onPress={() => router.back()}>
          <Text style={s.errorBackText}>{t('report.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = item.images?.length ? item.images.map(getImageUrl) : [PLACEHOLDER];
  const desc = item.description || '';
  const TRUNCATE = 300;
  const badge = item.maGaday ? { label: t('realEstateDetail.waaLaGatay'), color: Colors.error }
    : item.isPremium90 ? { label: 'PREMIUM', color: Colors.premium }
    : null;

  const specItems: { label: string; value: string }[] = [
    item.propertyType && { label: t('realEstateDetail.propertyTypeLabel'), value: item.propertyType },
    item.category && { label: t('realEstateDetail.categoryLabel'), value: item.category },
    item.subcategory && { label: t('realEstateDetail.subcategoryLabel'), value: item.subcategory },
    item.bedrooms != null && { label: t('realEstateDetail.bedroomsLabel'), value: String(item.bedrooms) },
    item.bathrooms != null && { label: t('realEstateDetail.bathroomsLabel'), value: String(item.bathrooms) },
    item.area && { label: t('realEstateDetail.sizeSqmLabel'), value: `${item.area} ${t('realEstateDetail.sqm')}` },
    item.floor != null && { label: t('realEstateDetail.floorLabel'), value: String(item.floor) },
    item.totalFloors != null && { label: t('realEstateDetail.totalFloorsLabel'), value: String(item.totalFloors) },
    item.furnished != null && { label: t('realEstateDetail.furnished'), value: item.furnished ? 'Yes' : 'No' },
  ].filter(Boolean) as { label: string; value: string }[];

  const amenities = AMENITY_KEYS.filter((k) => item[k] === true);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery
          images={images} activeIndex={activeImage}
          onActiveChange={setActiveImage} onZoom={() => setZoomed(true)}
          isFavorite={isFavorite} onFavorite={toggleFav}
          badge={badge} isSold={Boolean(item.maGaday)}
        />

        <View style={s.body}>
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.price}>{item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}</Text>

          <View style={s.metaRow}>
            <View style={s.locPill}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
              <Text style={s.locText}>{[item.city, item.region].filter(Boolean).join(', ') || 'Somalia'}</Text>
            </View>
            {item.createdAt && <Text style={s.dateText}>{formatDate(item.createdAt)}</Text>}
          </View>

          {specItems.length > 0 && (
            <SpecGrid title={t('realEstateDetail.propertyDetails')} items={specItems} />
          )}

          {amenities.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('realEstateDetail.amenitiesLabel')}</Text>
              <View style={s.pillWrap}>
                {amenities.map((k) => (
                  <View key={k} style={s.pill}>
                    <MaterialCommunityIcons name={AMENITY_ICONS[k] as any} size={13} color={Colors.primary} />
                    <Text style={s.pillText}>{t(`realEstateDetail.${k}` as any) || k}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {item.features?.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('realEstateDetail.featuresLabel')}</Text>
              <View style={s.pillWrap}>
                {item.features.map((f: string) => (
                  <View key={f} style={s.pill}>
                    <MaterialCommunityIcons name="check-circle-outline" size={13} color={Colors.primary} />
                    <Text style={s.pillText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {desc.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('realEstateDetail.descriptionLabel')}</Text>
              <Text style={s.description}>
                {expanded || desc.length <= TRUNCATE ? desc : `${desc.slice(0, TRUNCATE)}...`}
              </Text>
              {desc.length > TRUNCATE && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ marginTop: 8 }}>
                  <Text style={s.readMore}>
                    {expanded ? t('realEstateDetail.showLess') : t('realEstateDetail.readMore')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {item.user && (
            <SellerCard
              username={item.user.username} profileImage={item.user.profileImage}
              phone={item.user.phone} subtitle={t('realEstateDetail.activeSeller')}
              onCall={handleCall}
            />
          )}
          <View style={{ height: 8 }} />
        </View>
      </ScrollView>

      <View style={s.actions}>
        {item.user?.phone && (
          <TouchableOpacity style={s.callBtn} onPress={handleCall}>
            <MaterialCommunityIcons name="phone" size={20} color={Colors.primary} />
            <Text style={s.callText}>{t('realEstateDetail.showPhone')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[s.msgBtn, item.maGaday && s.msgBtnDisabled]}
          onPress={handleContact}
          disabled={Boolean(item.maGaday)}
        >
          <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
          <Text style={s.msgBtnText}>{t('realEstateDetail.sendMessage')}</Text>
        </TouchableOpacity>
      </View>

      <ZoomModal visible={zoomed} images={images} startIndex={activeImage} title={item.title} onClose={() => setZoomed(false)} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  floatBack: {
    position: 'absolute', top: 50, left: 12, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 5, elevation: 5,
  },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', lineHeight: 30, marginBottom: 6 },
  price: { fontSize: 26, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 },
  locPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  locText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  dateText: { fontSize: 12, color: Colors.textMuted },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  description: { fontSize: 15, color: '#374151', lineHeight: 24 },
  readMore: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: Colors.primary, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 18 },
  callText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  msgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14 },
  msgBtnDisabled: { backgroundColor: Colors.textMuted },
  msgBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorTitle: { fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
  errorBack: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  errorBackText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
