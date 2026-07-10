import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
import { getCategoryByKey, SUB_I18N_GROUP } from '../../../constants';

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
  if (!item) return (
    <SwipeDownToClose>
      <DetailNotFound icon="bell-outline" message={t('subscriptionDetail.notFound')} onBack={() => router.back()} />
    </SwipeDownToClose>
  );

  const isActive = item.isActive ?? (item.status === 'active');

  const categoryDef = item.category ? getCategoryByKey(item.category) : undefined;
  const categoryLabel = item.category
    ? t(`categories.${item.category}`, { defaultValue: categoryDef?.name ?? item.category })
    : null;
  const i18nGroup = item.category ? (SUB_I18N_GROUP[item.category] ?? item.category.toLowerCase()) : '';
  const subCategoryDef = categoryDef?.subCategories.find((s) => s.key === item.subCategory);
  const subCategoryLabel = item.subCategory
    ? t(`subcategories.${i18nGroup}.${item.subCategory}`, { defaultValue: subCategoryDef?.name ?? item.subCategory })
    : null;

  const priceLabel = item.priceMin && item.priceMax
    ? `${formatPrice(item.priceMin)} – ${formatPrice(item.priceMax)}`
    : item.priceMax ? `${t('subscriptionDetail.priceUpTo')} ${formatPrice(item.priceMax)}`
    : item.priceMin ? `${t('subscriptionDetail.priceFrom')} ${formatPrice(item.priceMin)}`
    : t('priceOnRequest');

  const infoRows: { icon: string; label: string; value: string }[] = [
    categoryLabel       && { icon: 'tag-outline',          label: t('subscriptionDetail.category'),    value: categoryLabel },
    subCategoryLabel    && { icon: 'tag-multiple-outline', label: t('subscriptionDetail.subCategory'), value: subCategoryLabel },
    item.condition     && { icon: 'check-circle-outline', label: t('subscriptionDetail.condition'),   value: item.condition },
    item.brand         && { icon: 'shield-star-outline',  label: t('subscriptionDetail.brand'),       value: item.brand },
    item.expiryDate    && { icon: 'calendar-end',         label: t('subscriptionDetail.expires'),     value: formatDate(item.expiryDate) },
    item.createdAt     && { icon: 'calendar-plus',        label: t('subscriptionDetail.posted'),      value: formatDate(item.createdAt) },
    item.notificationCount != null && item.notificationCount > 0
      && { icon: 'bell-ring-outline', label: t('subscriptionDetail.matches'), value: String(item.notificationCount) },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  const heroPanel = (
    <View style={styles.hero}>
      <View style={styles.heroIcon}>
        <MaterialCommunityIcons name="bell-ring-outline" size={56} color={Colors.primary} />
      </View>
      <View style={styles.statusRow}>
        {categoryLabel && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryLabel}</Text>
          </View>
        )}
        <View style={[styles.statusBadge, isActive ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
          <Text style={[styles.statusBadgeText, isActive ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
            {isActive ? t('mine.subscriptions.status.active') : t('mine.subscriptions.status.expired')}
          </Text>
        </View>
      </View>
    </View>
  );

  const bodyContent = (
    <View style={styles.body}>
      <Text style={styles.title}>{item.title || categoryLabel || t('subscriptionDetail.titleFallback')}</Text>
      <Text style={styles.price}>{priceLabel}</Text>

      {(item.cities?.length || item.region) && (
        <View style={styles.locRow}>
          <View style={styles.pillsWrap}>
            {item.region && (
              <View style={styles.locPill}>
                <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.primary} />
                <Text style={styles.locText}>{item.region}</Text>
              </View>
            )}
            {item.cities?.filter(c => c !== item.region).map(city => (
              <View key={city} style={styles.pill}>
                <MaterialCommunityIcons name="city-variant-outline" size={13} color={Colors.primary} />
                <Text style={styles.pillText}>{city}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {infoRows.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('subscriptionDetail.detailsTitle')}</Text>
          {infoRows.map(({ icon, label, value }, i) => (
            <View key={label} style={[styles.infoRow, i === infoRows.length - 1 && styles.infoRowLast]}>
              <View style={styles.infoLeft}>
                <MaterialCommunityIcons name={icon as never} size={17} color={Colors.primary} />
                <Text style={styles.infoLabel}>{label}</Text>
              </View>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      {!!item.description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('subscriptionDetail.description')}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}

      <SellerCard
        username={ownerName}
        profileImage={ownerAvatar}
        userId={item?.userId || item?.user?._id || item?.user?.id || null}
        phone={ownerPhone}
        subtitle={t('realEstateDetail.activeSeller')}
        onMessage={handleMessage}
        messageBtnLabel={t('realEstateDetail.sendMessage')}
      />

      <ReportLink itemId={id} itemType="SUBSCRIPTION" />
      <RecommendedSection endpoint={SUBSCRIPTION_ENDPOINTS.MY} excludeId={id} />
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
          title={item.title || categoryLabel || t('subscriptionDetail.titleFallback')}
          message={`${item.title || categoryLabel}\n📍 ${[...(item.cities ?? []), item.region].filter(Boolean).join(', ') || t('vehicleDetail.locationFallback')}\n\nKaraadi`}
        />
      </SafeAreaView>
    </SwipeDownToClose>
  );
}
