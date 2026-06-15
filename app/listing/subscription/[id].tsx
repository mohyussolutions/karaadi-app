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
import { SUBSCRIPTION_ENDPOINTS } from '../../../constants';
import { formatPrice, formatDate } from '../../../util/helpers';
import { useSubscriptionDetail } from '../../../hooks/useSubscriptionDetail';
import SellerCard from '../../../components/cards/SellerCard';
import ReportLink from '../../../components/detail/ReportLink';
import RecommendedSection from '../../../components/detail/RecommendedSection';
import { SocialShareSheet } from '../../../components/social';
import DetailNotFound from '../../../components/detail/DetailNotFound';
import DetailActionBar from '../../../components/detail/DetailActionBar';
import SwipeDownToClose from '../../../components/detail/SwipeDownToClose';
import { createStyles } from '../../../util/styles/listing/subscription.styles';
import { createTabletSplitNarrowStyles, createTabletPortraitStyles } from '../../../util/styles/listing/tabletSplit.styles';
import { useResponsive } from '../../../hooks/useResponsive';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isTablet, isTabletLandscape } = useResponsive();
  const {
    item, loading,
    showPhone, setShowPhone,
    shareVisible, setShareVisible,
    ownerName, ownerPhone, ownerAvatar,
    handleMessage, handleCall, handleShare,
  } = useSubscriptionDetail(id);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const tabletSplitNarrow = useThemedStyles(createTabletSplitNarrowStyles);
  const tabletPortrait = useThemedStyles(createTabletPortraitStyles);

  if (loading) return <SwipeDownToClose><DetailSkeleton /></SwipeDownToClose>;
  if (!item) return <SwipeDownToClose><DetailNotFound icon="bell-outline" message="Subscription not found" onBack={() => router.back()} /></SwipeDownToClose>;

  const priceLabel = item.priceMin && item.priceMax
    ? `${formatPrice(item.priceMin)} – ${formatPrice(item.priceMax)}`
    : item.priceMax ? `Up to ${formatPrice(item.priceMax)}`
    : item.priceMin ? `From ${formatPrice(item.priceMin)}`
    : t('priceOnRequest');

  const city = item.cities?.[0];

  const infoRows: { icon: string; label: string; value: string }[] = [
    item.category && { icon: 'tag-outline', label: 'Category', value: item.category },
    item.subCategory && { icon: 'tag-multiple-outline', label: 'Sub-category', value: item.subCategory },
    item.region && { icon: 'map-marker-outline', label: 'Region', value: [city, item.region].filter(Boolean).join(', ') },
    item.expiryDate && { icon: 'calendar-end', label: 'Expires', value: formatDate(item.expiryDate) },
    item.createdAt && { icon: 'calendar-plus', label: 'Posted', value: formatDate(item.createdAt) },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  const heroPanel = (
    <View style={styles.hero}>
      <View style={styles.heroIcon}>
        <MaterialCommunityIcons name="bell-ring-outline" size={48} color={Colors.primary} />
      </View>
      {item.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      )}
    </View>
  );

  const bodyContent = (
    <View style={styles.body}>
      <Text style={styles.title}>{item.title || item.category || 'Subscription'}</Text>
      <Text style={styles.price}>{priceLabel}</Text>
      {(city || item.region) && (
        <View style={styles.locRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
          <Text style={styles.locText}>{[city, item.region].filter(Boolean).join(', ')}</Text>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription Details</Text>
        {infoRows.map(({ icon, label, value }, i) => (
          <View key={label} style={[styles.infoRow, i === infoRows.length - 1 && styles.infoRowLast]}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name={icon as never} size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>{label}</Text>
            </View>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>
      {item.description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
      <SellerCard
        username={ownerName} profileImage={ownerAvatar}
        userId={item?.userId || item?.user?._id || item?.user?.id || null}
        phone={ownerPhone} subtitle={t('realEstateDetail.activeSeller')}
        onMessage={handleMessage}
        messageBtnLabel={t('realEstateDetail.sendMessage')}
      />
      <ReportLink itemId={id} itemType="SUBSCRIPTION" />

      <RecommendedSection endpoint={SUBSCRIPTION_ENDPOINTS.PLANS} excludeId={id} />
      <View style={styles.bottomSpacer} />
    </View>
  );

  return (
    <SwipeDownToClose>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {isTabletLandscape ? (
          <View style={tabletSplitNarrow.row}>
            <ScrollView style={tabletSplitNarrow.leftCol} showsVerticalScrollIndicator={false}>
              {heroPanel}
            </ScrollView>
            <ScrollView style={tabletSplitNarrow.rightCol} showsVerticalScrollIndicator={false}>
              {bodyContent}
            </ScrollView>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isTablet ? [styles.scroll, tabletPortrait.scrollContent] : styles.scroll}
          >
            <View style={isTablet ? tabletPortrait.inner : undefined}>
              {heroPanel}
              {bodyContent}
            </View>
          </ScrollView>
        )}

        <DetailActionBar
          extra={
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <MaterialCommunityIcons name="share-variant-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          }
          onCall={ownerPhone ? (showPhone ? handleCall : () => setShowPhone(true)) : undefined}
          callLabel={showPhone ? ownerPhone! : t('realEstateDetail.showPhone')}
          onMessage={handleMessage}
          messageLabel={t('realEstateDetail.sendMessage')}
        />
        <SocialShareSheet
          visible={shareVisible}
          onClose={() => setShareVisible(false)}
          title={item.title || item.category || 'Subscription'}
          message={`${item.title || item.category}\n📍 ${[city, item.region].filter(Boolean).join(', ') || 'Somalia'}\n\nKaraadi`}
        />
      </SafeAreaView>
    </SwipeDownToClose>
  );
}
