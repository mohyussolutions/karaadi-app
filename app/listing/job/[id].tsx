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
import { JOBS_ENDPOINTS, DETAIL_PLACEHOLDER, DESCRIPTION_TRUNCATE } from '../../../constants';
import { getImageUrl, formatPrice, formatDate } from '../../../utils/helpers';
import { useJobDetail, formatSalary } from '../../../hooks/useJobDetail';
import ImageGallery from '../../../components/detail/ImageGallery';
import ZoomModal from '../../../components/detail/ZoomModal';
import { SpecGrid } from '../../../components/detail/DetailCard';
import SellerCard from '../../../components/detail/SellerCard';
import RecommendedSection from '../../../components/detail/RecommendedSection';
import { SocialShareSheet } from '../../../components/social';
import DetailNotFound from '../../../components/detail/DetailNotFound';
import DetailActionBar from '../../../components/detail/DetailActionBar';
import { createStyles } from '../../../utils/styles/listing/job.styles';
import { createTabletSplitStyles } from '../../../utils/styles/listing/tabletSplit.styles';
import { useResponsive } from '../../../hooks/useResponsive';

export default function JobDetailScreen() {
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
    toggleFav, handleContact: handleApply, handleCall, handleShare,
  } = useJobDetail(id);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const tabletSplit = useThemedStyles(createTabletSplitStyles);

  if (loading) return <DetailSkeleton />;
  if (!item) return <DetailNotFound icon="briefcase-outline" message={t('jobsPage.backLabel') || 'Job not found'} onBack={() => router.back()} />;

  const rawImages: string[] = [];
  if (item.companyLogo) rawImages.push(item.companyLogo);
  if (item.images?.length) rawImages.push(...item.images);
  const images = rawImages.length ? rawImages.map(getImageUrl) : [DETAIL_PLACEHOLDER];

  const desc = item.description || '';
  const TRUNCATE = DESCRIPTION_TRUNCATE;
  const salary = formatSalary(item.salaryMin, item.salaryMax);

  const poster = item.user;
  const posterName = typeof poster === 'object' ? poster?.username || 'Employer' : 'Employer';
  const posterAvatar = typeof poster === 'object' ? poster?.profileImage || null : null;

  const specItems: { label: string; value: string }[] = [
    item.company && { label: 'Company', value: item.company },
    (item.employmentType || item.type) && { label: 'Job Type', value: item.employmentType || item.type },
    salary !== 'Negotiable' && { label: 'Salary', value: salary },
    item.location && { label: 'Location', value: item.location },
    item.createdAt && { label: 'Posted', value: formatDate(item.createdAt) },
  ].filter(Boolean) as { label: string; value: string }[];

  const locationLabel = [item.city, item.region].filter(Boolean).join(', ') || item.location || 'Somalia';

  const galleryContent = (
    <ImageGallery
      images={images} activeIndex={activeImage}
      onActiveChange={setActiveImage} onImagePress={() => setZoomed(true)}
      isFavorite={isFavorite} onFavorite={toggleFav} onShare={handleShare}
    />
  );

  const bodyContent = (
    <View style={styles.body}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.salary}>{salary}</Text>
      <View style={styles.metaRow}>
        <View style={styles.locPill}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
          <Text style={styles.locText}>{locationLabel}</Text>
        </View>
        {item.createdAt && <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>}
      </View>
      <SellerCard
        username={posterName}
        profileImage={posterAvatar}
        userId={item?.userId || item?.user?._id || item?.user?.id || null}
        phone={item.user?.phone}
        subtitle={item.company || t('realEstateDetail.activeSeller')}
        onCall={handleCall}
        onMessage={handleApply}
        messageBtnLabel={t('realEstateDetail.sendMessage')}
      />
      {specItems.length > 0 && <SpecGrid title="Job Details" items={specItems} />}
      {desc.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('jobsPage.jobDescription') || 'Description'}</Text>
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
      {item.requirements && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Requirements</Text>
          <Text style={styles.description}>{item.requirements}</Text>
        </View>
      )}
      <RecommendedSection endpoint={JOBS_ENDPOINTS.LIST} excludeId={id} />
      <View style={styles.bottomSpacer} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
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
        priceLabel={salary}
        titleLabel={item.title}
        onMessage={handleApply}
        messageLabel={t('jobsPage.applyNow') || 'Apply'}
        messageIcon="send-outline"
      />

      <ZoomModal visible={zoomed} images={images} startIndex={activeImage} title={item.title} onClose={() => setZoomed(false)} />
      <SocialShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        title={item.title}
        message={`${item.title}\n${formatSalary(item.salaryMin, item.salaryMax)}\n📍 ${locationLabel}\n\nKaraadi`}
      />
    </SafeAreaView>
  );
}
