import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useResponsive } from '../../../hooks/useResponsive';
import { useMyAdManage } from '../../../hooks/useMyAdManage';
import { formatPrice, getImageUrl, getListingDetailRoute, getListingExpiryInfo } from '../../../util/helpers';
import { PLACEHOLDER_IMAGE, GRID_COLUMNS, GRID_H_PAD, MY_ADS_GRID_GAP } from '../../../constants';
import { LoadingSpinner } from '../../../components/loading';
import { EmptyState } from '../../../components/shared';
import RemoteImage from '../../../components/shared/RemoteImage/RemoteImage';
import { createStyles } from '../../../util/styles/profile/myAdManage.styles';

export default function MyAdManageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { gridCellWidth } = useResponsive();
  const { ad, loading, notFound, toggling, toggleSold } = useMyAdManage(id);

  if (loading) return <LoadingSpinner fullScreen />;

  if (notFound || !ad) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
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

  const mainImage = getImageUrl(ad.images?.[0]) || PLACEHOLDER_IMAGE;
  const restImages = (ad.images || []).slice(1);
  const gridWidth = gridCellWidth(GRID_COLUMNS, GRID_H_PAD, MY_ADS_GRID_GAP);
  const expiryInfo = getListingExpiryInfo(ad.expiryDate, t);

  const planKey = ad.isPremium90
    ? 'tierPremium'
    : ad.isStandard60
      ? 'tierStandard'
      : ad.isBasic30
        ? 'tierBasic'
        : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView overScrollMode="never" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('mine.myAds.manageTitle')}</Text>
        </View>

        {!!planKey && (
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>{t(`mine.myAds.${planKey}`)}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.mainImageWrap}>
            <RemoteImage source={{ uri: mainImage }} style={styles.mainImage} contentFit="contain" />
            {ad.maGaday && (
              <View style={styles.soldOverlay}>
                <Text style={styles.soldOverlayText}>{t('mine.myAds.sold')}</Text>
              </View>
            )}
          </View>

          {restImages.length > 0 && (
            <View style={styles.gridWrap}>
              {restImages.map((img, i) => (
                <RemoteImage
                  key={i}
                  source={{ uri: getImageUrl(img) }}
                  style={[styles.gridItem, { width: gridWidth, height: gridWidth }]}
                  contentFit="cover"
                />
              ))}
            </View>
          )}

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
            trackColor={{ false: Colors.gray100, true: Colors.primary }}
            thumbColor={Colors.white}
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
