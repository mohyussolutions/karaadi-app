import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../src/constants/colors';
import { LoadingSpinner } from '../../../src/components/shared';
import { apiClient } from '../../../src/api/client';
import { MARKETPLACE_ENDPOINTS } from '../../../src/constants/endpoints';
import { addFavorite, removeFavorite, checkFavorite } from '../../../src/api/favorites';
import { useAuthStore } from '../../../src/store/authStore';
import { getImageUrl, formatPrice, formatDate } from '../../../src/components/format';
import ImageGallery from '../../../src/components/detail/ImageGallery';
import ZoomModal from '../../../src/components/detail/ZoomModal';
import SellerCard from '../../../src/components/detail/SellerCard';

const PLACEHOLDER = 'https://placehold.co/800x560/e5e7eb/9ca3af?text=No+Image';

const CONDITION_COLORS: Record<string, string> = {
  new: '#16A34A',
  used: '#D97706',
  refurbished: '#2563EB',
};

export default function MarketplaceDetailScreen() {
  const { id, category } = useLocalSearchParams<{ id: string; category: string }>();
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
        const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.BY_ID(id));
        setItem({ ...data, id: data.id || data._id, _id: data._id || data.id });
        if (user) {
          const fav = await checkFavorite(id, 'marketplace');
          setIsFavorite(fav);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  async function toggleFav() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (isFavorite) {
      setIsFavorite(false);
      await removeFavorite(id).catch(() => setIsFavorite(true));
    } else {
      setIsFavorite(true);
      await addFavorite(id, 'marketplace').catch(() => setIsFavorite(false));
    }
  }

  function handleContact() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (item?.userId) {
      router.push({
        pathname: '/profile/chat',
        params: { userId: item.userId, username: item.user?.username || 'Seller', listingId: id },
      });
    }
  }

  function handleCall() {
    const phone = item?.user?.phone;
    if (phone) Linking.openURL(`tel:${phone}`);
  }

  async function handleShare() {
    if (!item) return;
    try {
      const priceStr = item.price > 0 ? formatPrice(item.price) : 'Price on request';
      await Share.share({
        title: item.title,
        message: `${item.title}\n${priceStr}\n${[item.city, item.region].filter(Boolean).join(', ')}\n\nKaraadi Marketplace`,
      });
    } catch {}
  }

  if (loading) return <LoadingSpinner fullScreen={false} size="large" />;
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

  const badge = item.maGaday
    ? { label: t('realEstateDetail.waaLaGatay'), color: Colors.error }
    : item.isPremium90 ? { label: 'PREMIUM', color: Colors.premium }
    : item.isStandard60 ? { label: 'STANDARD', color: Colors.standard }
    : item.isBasic30 ? { label: 'BASIC', color: Colors.basic }
    : null;

  const conditionColor = item.condition ? (CONDITION_COLORS[item.condition.toLowerCase()] ?? Colors.textMuted) : null;

  const metaItems: { icon: string; label: string; value: string }[] = [
    item.condition && { icon: 'tag-outline', label: 'Condition', value: item.condition },
    item.subcategory && { icon: 'shape-outline', label: 'Subcategory', value: item.subcategory },
    item.nestedSubcategory && { icon: 'dots-horizontal-circle-outline', label: 'Type', value: item.nestedSubcategory },
  ].filter(Boolean) as any[];

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery
          images={images}
          activeIndex={activeImage}
          onActiveChange={setActiveImage}
          onZoom={() => setZoomed(true)}
          isFavorite={isFavorite}
          onFavorite={toggleFav}
          badge={badge}
          isSold={Boolean(item.maGaday)}
        />

        <View style={s.body}>
          <View style={s.titleRow}>
            <Text style={s.title} numberOfLines={3}>{item.title}</Text>
            {conditionColor && (
              <View style={[s.conditionBadge, { backgroundColor: conditionColor + '20', borderColor: conditionColor }]}>
                <Text style={[s.conditionText, { color: conditionColor }]}>{item.condition}</Text>
              </View>
            )}
          </View>

          <Text style={s.price}>{item.price > 0 ? formatPrice(item.price) : 'Price on request'}</Text>

          <View style={s.metaRow}>
            <View style={s.locPill}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
              <Text style={s.locText}>{[item.city, item.region].filter(Boolean).join(', ') || 'Somalia'}</Text>
            </View>
            {item.createdAt && <Text style={s.dateText}>{formatDate(item.createdAt)}</Text>}
          </View>

          {metaItems.length > 0 && (
            <View style={s.metaChips}>
              {metaItems.map(({ icon, label, value }) => (
                <View key={label} style={s.metaChip}>
                  <MaterialCommunityIcons name={icon as any} size={13} color={Colors.primary} />
                  <Text style={s.metaChipText}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {desc.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('realEstateDetail.descriptionLabel')}</Text>
              <Text style={s.description}>
                {expanded || desc.length <= TRUNCATE ? desc : `${desc.slice(0, TRUNCATE)}...`}
              </Text>
              {desc.length > TRUNCATE && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={s.readMoreBtn}>
                  <Text style={s.readMore}>
                    {expanded ? t('realEstateDetail.showLess') : t('realEstateDetail.readMore')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {item.user && (
            <SellerCard
              username={item.user.username}
              profileImage={item.user.profileImage}
              phone={item.user.phone}
              subtitle={t('realEstateDetail.activeSeller')}
              onCall={handleCall}
            />
          )}

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>

      <View style={s.actions}>
        <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
          <MaterialCommunityIcons name="share-variant-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        {item.user?.phone && (
          <TouchableOpacity style={[s.callBtn, { flex: 1 }]} onPress={handleCall}>
            <MaterialCommunityIcons name="phone" size={20} color={Colors.primary} />
            <Text style={s.callText}>{t('realEstateDetail.showPhone')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ZoomModal
        visible={zoomed}
        images={images}
        startIndex={activeImage}
        title={item.title}
        onClose={() => setZoomed(false)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  body: { padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: '#111827', lineHeight: 30 },
  conditionBadge: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4,
  },
  conditionText: { fontSize: 12, fontWeight: '700' },
  price: { fontSize: 26, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14, flexWrap: 'wrap', gap: 8,
  },
  locPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  locText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  dateText: { fontSize: 12, color: Colors.textMuted },
  metaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#EFF6FF', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  metaChipText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  cardTitle: {
    fontSize: 12, fontWeight: '700', color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
  },
  description: { fontSize: 15, color: '#374151', lineHeight: 24 },
  readMoreBtn: { marginTop: 8 },
  readMore: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  actions: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  shareBtn: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 2, borderColor: Colors.primary, borderRadius: 14,
    paddingVertical: 13, paddingHorizontal: 18,
  },
  callText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  msgBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14,
  },
  msgBtnDisabled: { backgroundColor: Colors.textMuted },
  msgBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorTitle: { fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
  errorBack: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  errorBackText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
