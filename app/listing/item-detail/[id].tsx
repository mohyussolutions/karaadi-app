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
import { MARKETPLACE_ENDPOINTS } from '../../../constants';
import { getImageUrl, formatPrice, formatDate } from '../../../utils/helpers';
import { DETAIL_PLACEHOLDER, DESCRIPTION_TRUNCATE, CONDITION_COLORS } from '../../../constants';
import { useItemDetail } from '../../../hooks/useItemDetail';
import ImageGallery from '../../../components/detail/ImageGallery';
import ZoomModal from '../../../components/detail/ZoomModal';
import SellerCard from '../../../components/detail/SellerCard';
import RecommendedSection from '../../../components/detail/RecommendedSection';
import { SocialShareSheet } from '../../../components/social';
import DetailNotFound from '../../../components/detail/DetailNotFound';
import DetailActionBar from '../../../components/detail/DetailActionBar';
import SwipeDownToClose from '../../../components/detail/SwipeDownToClose';
import { createStyles } from '../../../utils/styles/listing/itemDetail.styles';
import { createTabletSplitStyles } from '../../../utils/styles/listing/tabletSplit.styles';
import { useResponsive } from '../../../hooks/useResponsive';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isTabletLandscape } = useResponsive();
  const {
    item, loading, isFavorite,
    activeImage, setActiveImage,
    zoomed, setZoomed,
    expanded, setExpanded,
    shareVisible, setShareVisible,
    toggleFav, handleContact, handleCall, handleShare,
  } = useItemDetail(id);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const tabletSplit = useThemedStyles(createTabletSplitStyles);

  if (loading) return <SwipeDownToClose><DetailSkeleton /></SwipeDownToClose>;
  if (!item) return <SwipeDownToClose><DetailNotFound onBack={() => router.back()} /></SwipeDownToClose>;

  const images = item.images?.length ? item.images.map(getImageUrl) : [DETAIL_PLACEHOLDER];
  const desc = item.description || '';
  const TRUNCATE = DESCRIPTION_TRUNCATE;

  const badge = item.maGaday ? { label: t('realEstateDetail.waaLaGatay'), color: Colors.error } : null;

  const conditionColor = item.condition
    ? (CONDITION_COLORS[item.condition.toLowerCase()] ?? Colors.textMuted)
    : null;

  const metaItems: { icon: string; label: string; value: string }[] = [
    item.condition && { icon: 'tag-outline', label: 'Condition', value: item.condition },
    item.subcategory && { icon: 'shape-outline', label: 'Subcategory', value: item.subcategory },
    item.nestedSubcategory && { icon: 'dots-horizontal-circle-outline', label: 'Type', value: item.nestedSubcategory },
  ].filter(Boolean) as any[];

  const locationStr = [item.city, item.region].filter(Boolean).join(', ') || 'Somalia';

  const galleryContent = (
    <ImageGallery
      images={images} activeIndex={activeImage}
      onActiveChange={setActiveImage} onImagePress={() => setZoomed(true)}
      isFavorite={isFavorite} onFavorite={toggleFav} onShare={handleShare}
      badge={badge} isSold={Boolean(item.maGaday)}
    />
  );

  const bodyContent = (
    <View style={styles.body}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
        {conditionColor && (
          <View style={[styles.conditionBadge, { backgroundColor: conditionColor + '20', borderColor: conditionColor }]}>
            <Text style={[styles.conditionText, { color: conditionColor }]}>{item.condition}</Text>
          </View>
        )}
      </View>
      <Text style={styles.price}>{item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}</Text>
      <View style={styles.metaRow}>
        <View style={styles.locPill}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
          <Text style={styles.locText}>{locationStr}</Text>
        </View>
        {item.createdAt && <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>}
      </View>
      {metaItems.length > 0 && (
        <View style={styles.metaChips}>
          {metaItems.map(({ icon, label, value }) => (
            <View key={label} style={styles.metaChip}>
              <MaterialCommunityIcons name={icon as never} size={13} color={Colors.primary} />
              <Text style={styles.metaChipText}>{value}</Text>
            </View>
          ))}
        </View>
      )}
      {item.user && (
        <SellerCard
          username={item.user.username}
          userId={item?.userId || item?.user?._id || item?.user?.id || null}
          profileImage={item.user.profileImage}
          phone={item.user.phone}
          subtitle={t('realEstateDetail.activeSeller')}
          onMessage={item.maGaday ? undefined : handleContact}
          disabled={Boolean(item.maGaday)}
        />
      )}
      {item.maGaday && (
        <View style={styles.soldBanner}>
          <Text style={styles.soldBannerText}>{t('realEstateDetail.waaLaGatay')}</Text>
        </View>
      )}
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
      <RecommendedSection
        endpoint={MARKETPLACE_ENDPOINTS.LIST}
        excludeId={id}
        categoryKey={item?.mainCategory || item?.category}
      />
      <View style={styles.bottomSpacer} />
    </View>
  );

  return (
    <SwipeDownToClose>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {isTabletLandscape ? (
          <View style={tabletSplit.row}>
            <ScrollView style={tabletSplit.leftCol} showsVerticalScrollIndicator={false}>
              {galleryContent}
            </ScrollView>
            <ScrollView style={tabletSplit.rightCol} showsVerticalScrollIndicator={false}>
              {bodyContent}
            </ScrollView>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {galleryContent}
            {bodyContent}
          </ScrollView>
        )}

        <DetailActionBar
          priceLabel={item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}
          titleLabel={item.title}
        />

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
