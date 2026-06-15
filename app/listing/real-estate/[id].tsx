import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { DetailSkeleton } from '../../../components/loading';
import { getImageUrl, formatPrice, formatDate } from '../../../util/helpers';
import { REAL_ESTATE_ENDPOINTS, DETAIL_PLACEHOLDER, DESCRIPTION_TRUNCATE } from '../../../constants';
import { AMENITY_ICONS, AMENITY_KEYS } from '../../../util/icons/icons';
import { useRealEstateDetail } from '../../../hooks/useRealEstateDetail';
import ImageGallery from '../../../components/detail/ImageGallery';
import ZoomModal from '../../../components/modals/ZoomModal';
import SellerCard from '../../../components/cards/SellerCard';
import ReportLink from '../../../components/detail/ReportLink';
import { SpecGrid } from '../../../components/cards/DetailCard';
import RecommendedSection from '../../../components/detail/RecommendedSection';
import { SocialShareSheet } from '../../../components/social';
import DetailNotFound from '../../../components/detail/DetailNotFound';
import SwipeDownToClose from '../../../components/detail/SwipeDownToClose';
import { createStyles } from '../../../util/styles/listing/realEstate.styles';
import { createTabletSplitStyles, createTabletPortraitStyles } from '../../../util/styles/listing/tabletSplit.styles';
import { useResponsive } from '../../../hooks/useResponsive';

export default function RealEstateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isTablet, isTabletLandscape } = useResponsive();
  const {
    item, loading, isFavorite,
    activeImage, setActiveImage,
    zoomed, setZoomed,
    expanded, setExpanded,
    shareVisible, setShareVisible,
    toggleFav, handleContact, handleCall, handleShare,
  } = useRealEstateDetail(id);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const tabletSplit = useThemedStyles(createTabletSplitStyles);
  const tabletPortrait = useThemedStyles(createTabletPortraitStyles);

  if (loading) return <SwipeDownToClose><DetailSkeleton /></SwipeDownToClose>;
  if (!item) return <SwipeDownToClose><DetailNotFound onBack={() => router.back()} /></SwipeDownToClose>;

  const images = item.images?.length ? item.images.map(getImageUrl) : [DETAIL_PLACEHOLDER];
  const desc = item.description || '';
  const TRUNCATE = DESCRIPTION_TRUNCATE;
  const badge = item.maGaday ? { label: t('realEstateDetail.waaLaGatay'), color: Colors.error } : null;

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

  const itemRecord = item as unknown as Record<string, unknown>;
  const amenities = AMENITY_KEYS.filter((k) => itemRecord[k] === true);

  const locationStr = [item.city, item.region].filter(Boolean).join(', ') || 'Somalia';

  const leftContent = (
    <>
      <ImageGallery
        images={images} activeIndex={activeImage}
        onActiveChange={setActiveImage} onImagePress={() => setZoomed(true)}
        isFavorite={isFavorite} onFavorite={toggleFav} onShare={handleShare}
        badge={badge} isSold={Boolean(item.maGaday)}
      />
      {specItems.length > 0 && (
        <View style={styles.specWrap}>
          <SpecGrid title={t('realEstateDetail.propertyDetails')} items={specItems} />
        </View>
      )}
      {amenities.length > 0 && (
        <View style={[styles.card, styles.amenitiesCard]}>
          <Text style={styles.cardTitle}>{t('realEstateDetail.amenitiesLabel')}</Text>
          <View style={styles.pillWrap}>
            {amenities.map((k) => (
              <View key={k} style={styles.pill}>
                <MaterialCommunityIcons name={AMENITY_ICONS[k] as never} size={13} color={Colors.primary} />
                <Text style={styles.pillText}>{t(`realEstateDetail.${k}` as never) || k}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );

  const rightContent = (
    <View style={styles.body}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}</Text>
      <View style={styles.metaRow}>
        <View style={styles.locPill}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
          <Text style={styles.locText}>{locationStr}</Text>
        </View>
        {item.createdAt && <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>}
      </View>

      {!isTabletLandscape && specItems.length > 0 && (
        <SpecGrid title={t('realEstateDetail.propertyDetails')} items={specItems} />
      )}

      {!isTabletLandscape && amenities.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('realEstateDetail.amenitiesLabel')}</Text>
          <View style={styles.pillWrap}>
            {amenities.map((k) => (
              <View key={k} style={styles.pill}>
                <MaterialCommunityIcons name={AMENITY_ICONS[k] as never} size={13} color={Colors.primary} />
                <Text style={styles.pillText}>{t(`realEstateDetail.${k}` as never) || k}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {(item.features?.length ?? 0) > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('realEstateDetail.featuresLabel')}</Text>
          <View style={styles.pillWrap}>
            {(item.features ?? []).map((f: string) => (
              <View key={f} style={styles.pill}>
                <MaterialCommunityIcons name="check-circle-outline" size={13} color={Colors.primary} />
                <Text style={styles.pillText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <SellerCard
        username={item.user?.username} profileImage={item.user?.profileImage}
        userId={item?.userId || item?.user?._id || item?.user?.id || null}
        phone={item.user?.phone} subtitle={t('realEstateDetail.activeSeller')}
        onMessage={item.maGaday ? undefined : handleContact}
        disabled={Boolean(item.maGaday)}
      />

      {item.maGaday && (
        <View style={styles.soldBanner}>
          <Text style={styles.soldBannerText}>{t('realEstateDetail.waaLaGatay')}</Text>
        </View>
      )}

      <ReportLink itemId={id} itemType="REAL_ESTATE" />

      {desc.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('realEstateDetail.descriptionLabel')}</Text>
          <Text style={styles.description}>
            {expanded || desc.length <= TRUNCATE ? desc : `${desc.slice(0, TRUNCATE)}...`}
          </Text>
          {desc.length > TRUNCATE && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.readMoreBtn}>
              <Text style={styles.readMore}>
                {expanded ? t('realEstateDetail.showLess') : t('realEstateDetail.readMore')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <RecommendedSection endpoint={REAL_ESTATE_ENDPOINTS.LIST} excludeId={id} />
      <View style={styles.bottomSpacer} />
    </View>
  );

  return (
    <SwipeDownToClose>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {isTabletLandscape ? (
          <View style={tabletSplit.row}>
            <ScrollView style={tabletSplit.leftCol} showsVerticalScrollIndicator={false}>
              {leftContent}
            </ScrollView>
            <ScrollView style={tabletSplit.rightCol} showsVerticalScrollIndicator={false}>
              {rightContent}
            </ScrollView>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isTablet ? tabletPortrait.scrollContent : undefined}
          >
            <View style={isTablet ? tabletPortrait.inner : undefined}>
              <ImageGallery
                images={images} activeIndex={activeImage}
                onActiveChange={setActiveImage} onImagePress={() => setZoomed(true)}
                isFavorite={isFavorite} onFavorite={toggleFav} onShare={handleShare}
                badge={badge} isSold={Boolean(item.maGaday)}
              />
              {rightContent}
            </View>
          </ScrollView>
        )}

        <ZoomModal visible={zoomed} images={images} startIndex={activeImage} title={item.title} onClose={() => setZoomed(false)} />
        <SocialShareSheet
          visible={shareVisible}
          onClose={() => setShareVisible(false)}
          title={item.title}
          message={`${item.title}\n${item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}\n📍 ${locationStr}\n\nKaraadi`}
        />
      </SafeAreaView>
    </SwipeDownToClose>
  );
}
