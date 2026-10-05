import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useGlobal } from '../../../hooks/app/useResponsive';
import { useTabBarClearance } from '../../../hooks/app/useResponsive';
import { useMyAdManage } from '../../../hooks/auth/useAccount';
import { formatPrice, getImageUrl, getListingDetailRoute, getListingExpiryInfo } from '../../../lib/helpers';
import { PLACEHOLDER_IMAGE, MY_AD_GALLERY_H_PAD } from '../../../actions/constants';
import { LoadingSpinner } from '../../../components/loading';
import { EmptyState } from '../../../components/shared';
import MyAdGallery from '../../../components/detail/MyAdGallery/MyAdGallery';
import { createStyles } from '../../../utils/styles/profile/myAdManage.styles';
import { paddingBottomOf } from '../../../utils/styles/common/dynamic.styles';
import type { IdParams } from '../../../utils/types';

export default function MyAdManageScreen() {
  const { id } = useLocalSearchParams<IdParams>();
  const router = useRouter();
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { width } = useGlobal();
  const clearance = useTabBarClearance();
  const { ad, loading, notFound, toggling, toggleSold } = useMyAdManage(id);

  if (loading) return <LoadingSpinner fullScreen />;

  if (notFound || !ad) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.center}>
          <EmptyState
            icon="clipboard-text-off-outline"
            title={t('mine.myAds.notFoundTitle')}
            message={t('mine.myAds.notFoundMessage')}
          />
          <TouchableOpacity style={styles.backLinkBtn} onPress={() => router.back()}>
            <Text style={styles.backLinkText}>{t('mine.myAds.backToMyAds')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = (ad.images || []).map(getImageUrl).filter(Boolean);
  const galleryImages = images.length ? images : [PLACEHOLDER_IMAGE];
  const galleryWidth = width - MY_AD_GALLERY_H_PAD * 2 - 2;
  const expiryInfo = getListingExpiryInfo(ad.expiryDate, t);

  const planKey = ad.isPremium90
    ? 'tierPremium'
    : ad.isStandard60
      ? 'tierStandard'
      : ad.isBasic30
        ? 'tierBasic'
        : '';

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView
        overScrollMode="never"
        contentContainerStyle={[styles.content, paddingBottomOf(clearance + 16)]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>{t('mine.myAds.manageTitle')}</Text>

        {!!planKey && (
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>{t(`mine.myAds.${planKey}`)}</Text>
          </View>
        )}

        <View style={styles.card}>
          <MyAdGallery
            images={galleryImages}
            width={galleryWidth}
            sold={!!ad.maGaday}
            soldLabel={t('common.sold')}
          />

          <View style={styles.body}>
            <Text style={styles.title}>{ad.title || t('mine.myAds.untitled')}</Text>
            {!!ad.description && <Text style={styles.description}>{ad.description}</Text>}
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {ad.price > 0 ? formatPrice(ad.price) : t('priceOnRequest')}
              </Text>
              {!!(ad.category || ad.mainCategory) && (
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{ad.category || ad.mainCategory}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {expiryInfo && (
          <View style={styles.expiryRow}>
            <Text style={styles.expiryLabel}>{t('mine.myAds.expires')}</Text>
            <Text
              style={[
                styles.expiryValue,
                expiryInfo.isExpired
                  ? styles.expiryValueDanger
                  : expiryInfo.urgent
                    ? styles.expiryValueWarning
                    : null,
              ]}
            >
              {expiryInfo.status}
            </Text>
          </View>
        )}

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextWrap}>
            <Text style={styles.toggleTitle}>{t('mine.myAds.soldToggleTitle')}</Text>
            <Text style={styles.toggleDesc}>
              {ad.maGaday ? t('mine.myAds.soldToggleOnDesc') : t('mine.myAds.soldToggleOffDesc')}
            </Text>
          </View>
          <Switch
            value={!!ad.maGaday}
            onValueChange={toggleSold}
            disabled={toggling}
            trackColor={{ false: Colors.gray300, true: Colors.success }}
            ios_backgroundColor={Colors.gray300}
            thumbColor={Colors.white}
            accessibilityLabel={t('mine.myAds.soldToggleTitle')}
          />
        </View>

        <TouchableOpacity
          style={styles.viewAdBtn}
          onPress={() => router.push(getListingDetailRoute(ad, ad.mainCategory) as never)}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="eye-outline" size={18} color={Colors.white} />
          <Text style={styles.viewAdBtnText}>{t('mine.myAds.viewAd')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
