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
import { DETAIL_PLACEHOLDER, DESCRIPTION_TRUNCATE, VEHICLE_ENDPOINTS } from '../../../constants';
import { useVehicleDetail } from '../../../hooks/useVehicleDetail';
import ImageGallery from '../../../components/detail/ImageGallery';
import ZoomModal from '../../../components/modals/ZoomModal';
import SellerCard from '../../../components/cards/SellerCard';
import ReportLink from '../../../components/detail/ReportLink';
import { SpecGrid } from '../../../components/cards/DetailCard';
import RecommendedSection from '../../../components/detail/RecommendedSection';
import { SocialShareSheet } from '../../../components/social';
import DetailNotFound from '../../../components/detail/DetailNotFound';
import DetailActionBar from '../../../components/detail/DetailActionBar';
import SwipeDownToClose from '../../../components/detail/SwipeDownToClose';
import { createStyles } from '../../../util/styles/listing/vehicle.styles';
import { createTabletSplitStyles, createTabletPortraitStyles } from '../../../util/styles/listing/tabletSplit.styles';
import { useResponsive } from '../../../hooks/useResponsive';

const VEHICLE_REPORT_TYPES: Record<string, string> = {
  cars: 'CAR',
  boats: 'BOAT',
  motorcycles: 'MOTORCYCLE',
  'farm-equipment': 'TRAKTOR',
  farmequipment: 'TRAKTOR',
  traktor: 'TRAKTOR',
};

export default function VehicleDetailScreen() {
  const { id, category } = useLocalSearchParams<{ id: string; category: string }>();
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
  } = useVehicleDetail(id, category);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const tabletSplit = useThemedStyles(createTabletSplitStyles);
  const tabletPortrait = useThemedStyles(createTabletPortraitStyles);

  if (loading) return <SwipeDownToClose><DetailSkeleton /></SwipeDownToClose>;
  if (!item) return <SwipeDownToClose><DetailNotFound onBack={() => router.back()} /></SwipeDownToClose>;

  const images = item.images?.length ? item.images.map(getImageUrl) : [DETAIL_PLACEHOLDER];
  const desc = item.description || '';
  const TRUNCATE = DESCRIPTION_TRUNCATE;

  const badge = item.maGaday ? { label: t('realEstateDetail.waaLaGatay'), color: Colors.error }
    : item.isPremium90 ? { label: 'PREMIUM', color: Colors.premium }
    : item.isStandard60 ? { label: 'STANDARD', color: Colors.standard }
    : null;

  const specItems: { label: string; value: string }[] = [
    item.brand && { label: 'Make', value: item.brand },
    (item.model || item.vehicleModel || item.modelName || item.boatModel || item.traktortModel) && {
      label: 'Model', value: item.model || item.vehicleModel || item.modelName || item.boatModel || item.traktortModel,
    },
    item.year && { label: 'Year', value: String(item.year) },
    item.mileage && { label: 'Mileage', value: `${Number(item.mileage).toLocaleString()} km` },
    item.hours && { label: 'Hours', value: `${item.hours} h` },
    item.fuelType && { label: 'Fuel Type', value: item.fuelType },
    item.transmission && { label: 'Transmission', value: item.transmission },
    item.color && { label: 'Color', value: item.color },
    item.type && { label: 'Type', value: item.type },
    item.length && { label: 'Length', value: `${item.length} ft` },
  ].filter(Boolean) as { label: string; value: string }[];

  const locationStr = [item.city, item.region].filter(Boolean).join(', ') || 'Somalia';
  const shareMsg = `${item.title}\n${item.price > 0 ? formatPrice(item.price) : 'Price on request'}\n📍 ${locationStr}\n\nKaraadi`;

  const galleryAndSpecs = (
    <>
      <ImageGallery
        images={images} activeIndex={activeImage}
        onActiveChange={setActiveImage} onImagePress={() => setZoomed(true)}
        isFavorite={isFavorite} onFavorite={toggleFav} onShare={handleShare}
        badge={badge} isSold={Boolean(item.maGaday)}
      />
      {specItems.length > 0 && (
        <View style={styles.specWrap}>
          <SpecGrid title="Technical Specifications" items={specItems} />
        </View>
      )}
    </>
  );

  const mainContent = (
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
        <SpecGrid title="Technical Specifications" items={specItems} />
      )}

      {desc.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
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

      <SellerCard
        username={item.user?.username}
        userId={item?.userId || item?.user?._id || item?.user?.id || null}
        profileImage={item.user?.profileImage}
        phone={item.user?.phone}
        subtitle={t('realEstateDetail.activeSeller')}
        onCall={handleCall}
        onMessage={item.maGaday ? undefined : handleContact}
      />

      <ReportLink itemId={id} itemType={VEHICLE_REPORT_TYPES[category?.toLowerCase()] || 'CAR'} />

      <RecommendedSection
        endpoint={VEHICLE_ENDPOINTS[category] || `/api/${category}`}
        excludeId={id}
        categoryKey={category}
      />
      <View style={styles.bottomSpacer} />
    </View>
  );

  const actionBar = (
    <DetailActionBar
      onCall={item.user?.phone ? handleCall : undefined}
      callLabel={t('realEstateDetail.showPhone')}
    />
  );

  return (
    <SwipeDownToClose>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {isTabletLandscape ? (
          <View style={tabletSplit.row}>
            <ScrollView style={tabletSplit.leftCol} showsVerticalScrollIndicator={false}>
              {galleryAndSpecs}
            </ScrollView>
            <ScrollView style={tabletSplit.rightCol} showsVerticalScrollIndicator={false}>
              {mainContent}
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
              {mainContent}
            </View>
          </ScrollView>
        )}

        {actionBar}

        <ZoomModal visible={zoomed} images={images} startIndex={activeImage} title={item.title} onClose={() => setZoomed(false)} />
        <SocialShareSheet
          visible={shareVisible}
          onClose={() => setShareVisible(false)}
          title={item.title}
          message={shareMsg}
        />
      </SafeAreaView>
    </SwipeDownToClose>
  );
}
