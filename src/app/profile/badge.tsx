import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import RemoteImage from '../../components/shared/RemoteImage/RemoteImage';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useMyAds } from '../../hooks/useMyAds';
import { usePayForAd } from '../../hooks/usePayForAd';
import { createStyles } from '../../util/styles/profile/profileBadge.styles';
import { formatPrice, getImageUrl } from '../../util/helpers';
import { PLACEHOLDER_IMAGE, ROUTES } from '../../constants';
import type { ListingBase } from '../../util/types';

const adId = (ad: ListingBase) => ad._id || ad.id;
const isUnpaid = (ad: ListingBase) => !ad.isPaid && !ad.maGaday && !ad.expiryDate;

export default function BadgeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const { width } = useResponsive();
  const s = useThemedStyles(createStyles, width);
  const insets = useSafeAreaInsets();
  const { user, ads, loading, refreshing, error, deletingId, onRefresh, retry, handleDelete } = useMyAds();
  const payForAd = usePayForAd();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => ads.filter(isUnpaid), [ads]);
  const active = items.find((ad) => adId(ad) === selectedId) ?? items[0];
  const activeId = active ? adId(active) : null;

  if (!user) {
    return (
      <View style={s.center}>
        <EmptyState icon="lock-outline" title={t('signInRequired')} message={t('signInToView')} />
        <TouchableOpacity style={s.primaryBtn} onPress={() => router.push(ROUTES.login)}>
          <Text style={s.primaryBtnText}>{t('auth.login.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !refreshing) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <View style={s.center}>
        <EmptyState icon="wifi-off" title={t('mine.myAds.loadError')} message={t('mine.myAds.checkConnection')} />
        <TouchableOpacity style={s.primaryBtn} onPress={retry}>
          <Text style={s.primaryBtnText}>{t('mine.myAds.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={s.safe} edges={['bottom']}>
        <ScrollView overScrollMode="never" contentContainerStyle={s.emptyContent} refreshControl={refreshControl}>
          <View style={s.emptyIcon}>
            <MaterialCommunityIcons name="inbox-outline" size={44} color={Colors.textDisabled} />
          </View>
          <Text style={s.emptyTitle}>{t('mine.cart.empty')}</Text>
          <Text style={s.emptyDesc}>{t('mine.cart.emptyDesc')}</Text>
          <TouchableOpacity style={s.primaryBtn} onPress={() => router.push(ROUTES.newAd)}>
            <Text style={s.primaryBtnText}>{t('mine.cart.createAd')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView overScrollMode="never"
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <View style={s.hero}>
          <Text style={s.heroLabel}>{t('mine.cart.draftBadge')}</Text>
          <Text style={s.heroTitle}>{t('mine.cart.itemsCount', { count: items.length })}</Text>
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionTitleRow}>
              <MaterialCommunityIcons name="package-variant-closed" size={13} color={Colors.textSecondary} />
              <Text style={s.sectionTitle}>{t('mine.cart.yourItems')}</Text>
            </View>
            <TouchableOpacity style={s.linkBtn} onPress={() => router.push(ROUTES.newAd)}>
              <MaterialCommunityIcons name="plus" size={14} color={Colors.primary} />
              <Text style={s.linkText}>{t('mine.cart.addAnother')}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.itemsList}>
            {items.map((item) => {
              const id = adId(item);
              const selected = id === activeId;
              const images = (item.images ?? []).map(getImageUrl).filter(Boolean);
              const thumb = images[0] || PLACEHOLDER_IMAGE;
              const place = [item.city, item.region].filter(Boolean).join(', ');
              const category = item.category || item.mainCategory;

              return (
                <TouchableOpacity
                  key={id}
                  style={[s.item, selected && s.itemSelected]}
                  onPress={() => setSelectedId(id)}
                  activeOpacity={0.85}
                >
                  <View style={s.itemMain}>
                    <View style={s.thumbWrap}>
                      <RemoteImage source={{ uri: thumb }} style={s.thumb} contentFit="cover" />
                      {images.length > 1 && (
                        <Text style={s.thumbCount}>+{images.length - 1}</Text>
                      )}
                    </View>

                    <View style={s.itemBody}>
                      <View style={s.itemTop}>
                        <View style={s.itemInfo}>
                          <Text style={s.itemTitle} numberOfLines={1}>
                            {item.title || t('mine.myAds.untitled')}
                          </Text>
                          {!!category && (
                            <View style={s.metaRow}>
                              <MaterialCommunityIcons name="tag-outline" size={10} color={Colors.primary} />
                              <Text style={s.metaCategory} numberOfLines={1}>
                                {category}{item.subcategory ? ` › ${item.subcategory}` : ''}
                              </Text>
                            </View>
                          )}
                          {!!place && (
                            <View style={s.metaRow}>
                              <MaterialCommunityIcons name="map-marker-outline" size={10} color={Colors.textMuted} />
                              <Text style={s.metaPlace} numberOfLines={1}>{place}</Text>
                            </View>
                          )}
                        </View>

                        <View style={s.itemRight}>
                          <Text style={s.itemPrice}>
                            {item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}
                          </Text>
                          <View style={[s.radio, selected && s.radioOn]}>
                            {selected && <MaterialCommunityIcons name="check" size={12} color={Colors.white} />}
                          </View>
                        </View>
                      </View>

                      {!!item.description && (
                        <Text style={s.itemDesc} numberOfLines={selected ? 3 : 1}>{item.description}</Text>
                      )}
                    </View>
                  </View>

                  {selected && images.length > 1 && (
                    <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.gallery}>
                      {images.map((uri, idx) => (
                        <RemoteImage key={`${uri}-${idx}`} source={{ uri }} style={s.galleryImg} contentFit="cover" />
                      ))}
                    </ScrollView>
                  )}

                  <View style={s.itemFooter}>
                    <View style={s.pendingPill}>
                      <Text style={s.pendingText}>{t('mine.myAds.pending')}</Text>
                    </View>
                    <TouchableOpacity
                      style={s.removeBtn}
                      onPress={() => handleDelete(item)}
                      disabled={deletingId === id}
                    >
                      {deletingId === id ? (
                        <ActivityIndicator size="small" color={Colors.error} />
                      ) : (
                        <>
                          <MaterialCommunityIcons name="trash-can-outline" size={13} color={Colors.error} />
                          <Text style={s.removeText}>{t('mine.cart.remove')}</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {!!active && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('mine.cart.summary')}</Text>
            </View>
            <View style={s.summaryBody}>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>{t('mine.cart.selectedItem')}</Text>
                <Text style={s.summaryValue} numberOfLines={1}>{active.title || t('mine.myAds.untitled')}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>{t('mine.cart.itemPrice')}</Text>
                <Text style={s.summaryValue}>
                  {active.price > 0 ? formatPrice(active.price) : t('priceOnRequest')}
                </Text>
              </View>
              <View style={s.planNote}>
                <Text style={s.planNoteText}>{t('mine.cart.noPlanSelected')}</Text>
              </View>
              <TouchableOpacity style={s.payBtn} onPress={() => payForAd(active)} activeOpacity={0.85}>
                <Text style={s.payBtnText}>{t('mine.cart.selectPlanAndPay')}</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
