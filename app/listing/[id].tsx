import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity,
  FlatList, Dimensions, Linking, Modal, StatusBar, ActivityIndicator, Share, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../src/constants/colors';
import { apiClient } from '../../src/api/client';
import { addFavorite, removeFavorite, checkFavorite } from '../../src/api/favorites';
import { useAuthStore } from '../../src/store/authStore';
import { getCategoryByKey } from '../../src/constants/categories';
import { getImageUrl, formatPrice, formatDate } from '../../src/components/format';
import type { ListingBase } from '../../src/utils/types';

const { width, height } = Dimensions.get('window');
const IMG_H = Math.round(width * 0.88);
const PLACEHOLDER = 'https://placehold.co/800x560/e5e7eb/9ca3af?text=No+Image';

const CATEGORY_ENDPOINTS: Record<string, string> = {
  cars: '/api/cars',
  boats: '/api/boats',
  motorcycles: '/api/motorcycles',
  'real-estate': '/api/real-estate',
  'farm-equipment': '/api/traktor',
  marketplace: '/api/marketplace',
  jobs: '/api/jobs',
  items: '/api/items',
  wanted: '/api/wanted',
};

type FieldDef = { key: string; labelKey: string; format?: (v: any) => string };

const FIELD_CONFIGS: Record<string, FieldDef[]> = {
  cars: [
    { key: 'brand', labelKey: 'Brand' },
    { key: 'model', labelKey: 'Model' },
    { key: 'type', labelKey: 'Type' },
    { key: 'year', labelKey: 'Year' },
    { key: 'mileage', labelKey: 'Mileage', format: (v) => `${Number(v).toLocaleString()} km` },
    { key: 'transmission', labelKey: 'Transmission' },
    { key: 'fuelType', labelKey: 'Fuel Type' },
    { key: 'color', labelKey: 'Color' },
  ],
  motorcycles: [
    { key: 'brand', labelKey: 'Brand' },
    { key: 'model', labelKey: 'Model' },
    { key: 'year', labelKey: 'Year' },
    { key: 'mileage', labelKey: 'Mileage', format: (v) => `${Number(v).toLocaleString()} km` },
  ],
  boats: [
    { key: 'brand', labelKey: 'Brand' },
    { key: 'model', labelKey: 'Model' },
    { key: 'year', labelKey: 'Year' },
    { key: 'length', labelKey: 'Length', format: (v) => `${v} ft` },
  ],
  'farm-equipment': [
    { key: 'brand', labelKey: 'Brand' },
    { key: 'model', labelKey: 'Model' },
    { key: 'year', labelKey: 'Year' },
  ],
  'real-estate': [
    { key: 'propertyType', labelKey: 'Property Type' },
    { key: 'bedrooms', labelKey: 'Bedrooms' },
    { key: 'bathrooms', labelKey: 'Bathrooms' },
    { key: 'area', labelKey: 'Area', format: (v) => `${v} sqm` },
    { key: 'furnished', labelKey: 'Furnished', format: (v) => (v ? 'Yes' : 'No') },
  ],
  jobs: [
    { key: 'company', labelKey: 'Company' },
    { key: 'jobType', labelKey: 'Job Type' },
  ],
  marketplace: [{ key: 'condition', labelKey: 'Condition' }],
  items: [{ key: 'condition', labelKey: 'Condition' }],
  wanted: [],
};

const AMENITY_ICONS: Record<string, string> = {
  swimmingPool: 'pool',
  gym: 'dumbbell',
  security: 'shield-check-outline',
  elevator: 'elevator',
  generator: 'lightning-bolt',
  waterSupply: 'water',
  airConditioning: 'snowflake',
  garden: 'flower-outline',
  balcony: 'home-outline',
  parking: 'parking',
};
const AMENITY_LABELS: Record<string, string> = {
  swimmingPool: 'Swimming Pool', gym: 'Gym', security: 'Security',
  elevator: 'Elevator', generator: 'Generator', waterSupply: 'Water Supply',
  airConditioning: 'Air Conditioning', garden: 'Garden', balcony: 'Balcony', parking: 'Parking',
};
const RE_AMENITY_KEYS = Object.keys(AMENITY_ICONS) as (keyof typeof AMENITY_ICONS)[];

function getPriceLabel(item: any, category: string): string {
  if (category === 'jobs') {
    const min = Number(item.salaryMin) || 0;
    const max = Number(item.salaryMax) || 0;
    if (!min && !max) return 'Negotiable';
    if (min && max) return `${formatPrice(min)} – ${formatPrice(max)}`;
    return min ? `From ${formatPrice(min)}` : `Up to ${formatPrice(max)}`;
  }
  return item.price > 0 ? formatPrice(item.price) : 'Price on request';
}

function ImageGallery({
  images,
  activeIndex,
  onActiveChange,
  onZoom,
  isFavorite,
  onFavorite,
  onShare,
  badge,
  isSold,
}: {
  images: string[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
  onZoom: () => void;
  isFavorite: boolean;
  onFavorite: () => void;
  onShare: () => void;
  badge: { label: string; color: string } | null;
  isSold: boolean;
}) {
  const flatRef = useRef<FlatList>(null);

  function goTo(i: number) {
    const next = Math.max(0, Math.min(i, images.length - 1));
    onActiveChange(next);
    flatRef.current?.scrollToIndex({ index: next, animated: true });
  }

  return (
    <View style={ig.wrapper}>
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        pagingEnabled
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.92}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => `img-${i}`}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) =>
          onActiveChange(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item: img }) => (
          <Image source={{ uri: img }} style={ig.image} resizeMode="cover" />
        )}
      />

      {images.length > 1 && (
        <>
          <TouchableOpacity style={[ig.arrow, ig.arrowL]} onPress={() => goTo(activeIndex - 1)} activeOpacity={0.8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[ig.arrow, ig.arrowR]} onPress={() => goTo(activeIndex + 1)} activeOpacity={0.8}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      <View style={ig.topRow}>
        {images.length > 1 && (
          <View style={ig.counter}>
            <Text style={ig.counterText}>{activeIndex + 1} / {images.length}</Text>
          </View>
        )}
        <View style={ig.actions}>
          <TouchableOpacity style={ig.actionBtn} onPress={onFavorite} activeOpacity={0.85}>
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#EF4444' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={ig.actionBtn} onPress={onShare} activeOpacity={0.85}>
            <MaterialCommunityIcons name="share-variant-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={ig.actionBtn} onPress={onZoom} activeOpacity={0.85}>
            <MaterialCommunityIcons name="magnify-plus-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {isSold && (
        <View style={StyleSheet.absoluteFill}>
          <View style={ig.soldOverlay}>
            <Text style={ig.soldText}>WAA LA GATAY</Text>
          </View>
        </View>
      )}

      {images.length > 1 && (
        <View style={ig.dotsOverlay}>
          {images.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)} hitSlop={8}>
              <View style={[ig.dot, i === activeIndex && ig.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {images.length > 1 && (
        <FlatList
          data={images}
          horizontal
          keyExtractor={(_, i) => `thumb-${i}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={ig.thumbStrip}
          renderItem={({ item: img, index }) => (
            <TouchableOpacity onPress={() => goTo(index)} activeOpacity={0.75}>
              <Image
                source={{ uri: img }}
                style={[ig.thumb, index === activeIndex && ig.thumbActive]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const ig = StyleSheet.create({
  wrapper: { backgroundColor: '#111' },
  image: { width, height: IMG_H },
  arrow: {
    position: 'absolute',
    top: IMG_H / 2 - 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowL: { left: 10 },
  arrowR: { right: 10 },
  topRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  dotsOverlay: {
    position: 'absolute',
    bottom: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive: { width: 18, backgroundColor: '#fff', borderRadius: 3 },
  thumbStrip: { paddingHorizontal: 10, paddingBottom: 10, paddingTop: 6, gap: 6, backgroundColor: '#111' },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  thumbActive: { borderColor: '#3B82F6', opacity: 1 },
});

function ZoomModal({
  visible,
  images,
  startIndex,
  title,
  onClose,
}: {
  visible: boolean;
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (visible) {
      setCurrent(startIndex);
      setTimeout(
        () => flatRef.current?.scrollToIndex({ index: startIndex, animated: false }),
        50,
      );
    }
  }, [visible, startIndex]);

  function goTo(i: number) {
    const next = Math.max(0, Math.min(i, images.length - 1));
    setCurrent(next);
    flatRef.current?.scrollToIndex({ index: next, animated: true });
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={zm.root}>
        <FlatList
          ref={flatRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => `zoom-${i}`}
          initialScrollIndex={startIndex}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) =>
            setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item: img }) => (
            <View style={zm.imageWrapper}>
              <Image source={{ uri: img }} style={zm.image} resizeMode="contain" />
            </View>
          )}
        />

        <SafeAreaView style={zm.topOverlay} edges={['top']}>
          <View style={zm.topBar}>
            {images.length > 1 ? (
              <View style={zm.counter}>
                <Text style={zm.counterText}>{current + 1} / {images.length}</Text>
              </View>
            ) : <View />}
            <TouchableOpacity
              style={zm.closeBtn}
              onPress={onClose}
              hitSlop={16}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {images.length > 1 && (
          <>
            <TouchableOpacity
              style={[zm.arrow, zm.arrowL]}
              onPress={() => goTo(current - 1)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[zm.arrow, zm.arrowR]}
              onPress={() => goTo(current + 1)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="chevron-right" size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {images.length > 1 && (
          <View style={[zm.thumbBar, { paddingBottom: insets.bottom + 10 }]}>
            <FlatList
              data={images}
              horizontal
              keyExtractor={(_, i) => `zt-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
              renderItem={({ item: img, index }) => (
                <TouchableOpacity onPress={() => goTo(index)} activeOpacity={0.8}>
                  <Image
                    source={{ uri: img }}
                    style={[zm.thumb, index === current && zm.thumbActive]}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const zm = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  imageWrapper: { width, flex: 1, justifyContent: 'center' },
  image: { width, height: height * 0.72 },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  counter: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  counterText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -28,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowL: { left: 10 },
  arrowR: { right: 10 },
  thumbBar: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingTop: 10,
  },
  thumb: {
    width: 52, height: 52, borderRadius: 8,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    opacity: 0.55,
  },
  thumbActive: { borderColor: '#fff', opacity: 1 },
});

export default function ListingDetailScreen() {
  const { id, category, subCategory } = useLocalSearchParams<{
    id: string; category: string; subCategory?: string;
  }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [item, setItem] = useState<ListingBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const categoryMeta = getCategoryByKey(category);
  const subCategoryMeta = categoryMeta?.subCategories.find((s) => s.key === subCategory);

  useEffect(() => {
    async function load() {
      try {
        const endpoint = CATEGORY_ENDPOINTS[category] || `/api/${category}`;
        const { data } = await apiClient.get(`${endpoint}/${id}`);
        const normalized = { ...data, id: data.id || data._id, _id: data._id || data.id };
        setItem(normalized);
        if (user) {
          const fav = await checkFavorite(id, normalized.mainCategory || category);
          setIsFavorite(fav);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id, category]);

  async function toggleFavorite() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (isFavorite) {
      setIsFavorite(false);
      await removeFavorite(id).catch(() => setIsFavorite(true));
    } else {
      setIsFavorite(true);
      await addFavorite(id, item?.mainCategory || category).catch(() => setIsFavorite(false));
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

  if (loading) {
    return (
      <View style={s.skeletonRoot}>
        <View style={s.skeletonImage} />
        <View style={s.skeletonBody}>
          <View style={[s.skeletonLine, { width: '70%', height: 22 }]} />
          <View style={[s.skeletonLine, { width: '40%', height: 28, marginTop: 8 }]} />
          <View style={[s.skeletonLine, { width: '55%', height: 16, marginTop: 12 }]} />
          <View style={[s.skeletonLine, { width: '100%', height: 14, marginTop: 24 }]} />
          <View style={[s.skeletonLine, { width: '90%', height: 14, marginTop: 8 }]} />
          <View style={[s.skeletonLine, { width: '80%', height: 14, marginTop: 8 }]} />
        </View>
        <ActivityIndicator style={s.skeletonSpinner} size="small" color={Colors.primary} />
      </View>
    );
  }
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
  const avatarInitial = item.user?.username?.[0]?.toUpperCase() ?? '?';
  const avatarFallback = `https://placehold.co/80x80/3B82F6/ffffff?text=${avatarInitial}`;

  const badge = item.maGaday
    ? { label: t('realEstateDetail.waaLaGatay'), color: Colors.error }
    : null;

  const fieldConfig = FIELD_CONFIGS[category] ?? [];
  const fields = fieldConfig
    .map(({ key, labelKey, format }) => {
      const v = (item as any)[key];
      if (v === null || v === undefined || v === '') return null;
      return { label: labelKey, value: format ? format(v) : String(v) };
    })
    .filter((f): f is { label: string; value: string } => f !== null);

  const isJob = category === 'jobs';
  const isWanted = category === 'wanted' || category === 'items';
  const isRealEstate = category === 'real-estate';
  const amenities = isRealEstate ? RE_AMENITY_KEYS.filter((k) => (item as any)[k] === true) : [];

  const desc = item.description || '';
  const TRUNCATE = 300;
  const descText = expanded || desc.length <= TRUNCATE ? desc : `${desc.slice(0, TRUNCATE)}...`;

  const contactLabel = isJob
    ? t('realEstateDetail.sendMessage')
    : isWanted ? 'I Have This'
    : t('realEstateDetail.sendMessage');
  const contactIcon = isJob ? 'send-outline' : isWanted ? 'hand-wave-outline' : 'message-outline';

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery
          images={images}
          activeIndex={activeImage}
          onActiveChange={setActiveImage}
          onZoom={() => setZoomed(true)}
          isFavorite={isFavorite}
          onFavorite={toggleFavorite}
          onShare={handleShare}
          badge={badge}
          isSold={Boolean(item.maGaday)}
        />

        <View style={s.breadcrumb}>
          <TouchableOpacity style={s.breadcrumbItem} onPress={() => router.push('/(tabs)')}>
            <MaterialCommunityIcons name="home-outline" size={13} color={Colors.primary} />
            <Text style={s.breadcrumbLink}>{t('nav.home')}</Text>
          </TouchableOpacity>
          {categoryMeta && (
            <>
              <MaterialCommunityIcons name="chevron-right" size={13} color={Colors.textMuted} />
              <TouchableOpacity
                style={s.breadcrumbItem}
                onPress={() => router.push({ pathname: '/browse/[category]', params: { category: categoryMeta.key } })}
              >
                <Text style={s.breadcrumbLink}>{categoryMeta.name}</Text>
              </TouchableOpacity>
            </>
          )}
          {subCategoryMeta && (
            <>
              <MaterialCommunityIcons name="chevron-right" size={13} color={Colors.textMuted} />
              <Text style={[s.breadcrumbLink, s.breadcrumbCurrent]}>{subCategoryMeta.name}</Text>
            </>
          )}
        </View>

        <View style={s.body}>
          <Text style={s.title}>{item.title}</Text>

          <View style={s.priceBox}>
            <Text style={s.priceText}>{getPriceLabel(item, category)}</Text>
          </View>

          <View style={s.metaRow}>
            <View style={s.locPill}>
              <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.primary} />
              <Text style={s.locText}>
                {[item.city, item.region].filter(Boolean).join(', ') || 'Somalia'}
              </Text>
            </View>
            {item.createdAt && (
              <Text style={s.dateText}>{formatDate(item.createdAt)}</Text>
            )}
          </View>

          {fields.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>Details</Text>
              <View style={s.specsGrid}>
                {fields.map(({ label, value }) => (
                  <View key={label} style={s.specCell}>
                    <Text style={s.specKey}>{label}</Text>
                    <Text style={s.specVal}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {desc.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('realEstateDetail.descriptionLabel')}</Text>
              <Text style={s.description}>{descText}</Text>
              {desc.length > TRUNCATE && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={s.readMoreBtn}>
                  <Text style={s.readMore}>
                    {expanded ? t('realEstateDetail.showLess') : t('realEstateDetail.readMore')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {isRealEstate && amenities.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('realEstateDetail.amenitiesLabel')}</Text>
              <View style={s.pillWrap}>
                {amenities.map((k) => (
                  <View key={k} style={s.pill}>
                    <MaterialCommunityIcons name={AMENITY_ICONS[k] as any} size={13} color={Colors.primary} />
                    <Text style={s.pillText}>{AMENITY_LABELS[k]}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {isJob && (item as any).requirements && (
            <View style={s.card}>
              <Text style={s.cardTitle}>Requirements</Text>
              <Text style={s.description}>{(item as any).requirements}</Text>
            </View>
          )}

          {item.user && (
            <View style={s.sellerCard}>
              <Text style={s.cardTitle}>
                {isJob ? 'Employer' : isWanted ? 'Posted by' : t('realEstateDetail.activeSeller')}
              </Text>
              <View style={s.sellerRow}>
                <Image source={{ uri: item.user.profileImage || avatarFallback }} style={s.avatar} />
                <View style={s.sellerMeta}>
                  <Text style={s.sellerName}>{item.user.username}</Text>
                  <View style={s.activeBadge}>
                    <View style={s.activeDot} />
                    <Text style={s.activeText}>{t('realEstateDetail.activeSeller')}</Text>
                  </View>
                </View>
                {item.user.phone && !isJob && (
                  <TouchableOpacity style={s.callCircle} onPress={handleCall}>
                    <MaterialCommunityIcons name="phone" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View style={{ height: 12 }} />
        </View>
      </ScrollView>

      <View style={s.actions}>
        <TouchableOpacity style={s.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <MaterialCommunityIcons name="share-variant-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        {item.user?.phone && !isJob && (
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

  floatBack: {
    position: 'absolute',
    top: 52,
    left: 14,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },

  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  breadcrumbItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  breadcrumbLink: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  breadcrumbCurrent: { color: Colors.textSecondary },

  body: { padding: 16 },

  title: { fontSize: 20, fontWeight: '800', color: '#111827', lineHeight: 28, marginBottom: 10 },

  priceBox: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignSelf: 'flex-start',
    minWidth: 120,
  },
  priceText: { fontSize: 22, fontWeight: '900', color: '#fff' },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  locPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  locText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  dateText: { fontSize: 11, color: Colors.textMuted },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
  specCell: {
    width: '50%',
    paddingVertical: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  specKey: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginBottom: 2 },
  specVal: { fontSize: 14, fontWeight: '700', color: '#111827' },

  description: { fontSize: 14, color: '#374151', lineHeight: 22 },
  readMoreBtn: { marginTop: 8 },
  readMore: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },

  sellerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.border },
  sellerMeta: { flex: 1 },
  sellerName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E' },
  activeText: { fontSize: 11, color: '#22C55E', fontWeight: '600' },
  callCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  shareBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
  },
  callText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  msgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
  },
  msgBtnDisabled: { backgroundColor: Colors.textMuted },
  msgBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  skeletonRoot: { flex: 1, backgroundColor: Colors.white },
  skeletonImage: { width: '100%', height: 280, backgroundColor: Colors.gray200 },
  skeletonBody: { padding: 16 },
  skeletonLine: { borderRadius: 6, backgroundColor: Colors.gray200 },
  skeletonSpinner: { position: 'absolute', bottom: 120, alignSelf: 'center' },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorTitle: { fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
  errorBack: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12, marginTop: 8,
  },
  errorBackText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
