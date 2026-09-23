import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { formatPrice, getImageUrl, getListingDetailRoute, getListingExpiryInfo } from '../../../util/helpers';
import { PLACEHOLDER_IMAGE, ROUTES } from '../../../constants';
import type { MyAdCardProps } from '../../../util/types';
import { createStyles } from '../../../util/styles/shared/myAdCard.styles';
import RemoteImage from '../../shared/RemoteImage/RemoteImage';

function MyAdCard({ item, deleting, onDelete, onPayNow }: MyAdCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  const image = getImageUrl(item.images?.[0]) || PLACEHOLDER_IMAGE;
  const expiryInfo = getListingExpiryInfo(item.expiryDate, t);
  const adId = item._id || item.id;

  const isExpired = !item.isPaid && !!item.expiryDate;
  const isActive = !!item.isPaid && !item.maGaday;
  const isPending = !item.isPaid && !item.maGaday && !item.expiryDate;
  const canPay = !item.isPaid && !item.maGaday;

  const planKey = item.isPremium90
    ? 'tierPremium'
    : item.isStandard60
      ? 'tierStandard'
      : item.isBasic30
        ? 'tierBasic'
        : '';

  function handlePress() {
    router.push(getListingDetailRoute(item, item.mainCategory) as never);
  }

  function handleManage() {
    router.push({ pathname: ROUTES.myAdManage, params: { id: adId } } as never);
  }

  return (
    <TouchableOpacity style={s.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={s.imgWrap}>
        <RemoteImage source={{ uri: image }} style={s.img} contentFit="cover" />
        <View style={s.badgeRow}>
          {item.maGaday && (
            <View style={[s.badge, s.badgeSold]}>
              <Text style={s.badgeText}>{t('mine.myAds.sold')}</Text>
            </View>
          )}
          {isActive && (
            <View style={[s.badge, s.badgeActive]}>
              <Text style={s.badgeText}>{t('mine.myAds.active')}</Text>
            </View>
          )}
          {isExpired && (
            <View style={[s.badge, s.badgeExpired]}>
              <Text style={s.badgeText}>{t('mine.myAds.expired')}</Text>
            </View>
          )}
          {isPending && (
            <View style={[s.badge, s.badgePending]}>
              <Text style={s.badgeText}>{t('mine.myAds.pending')}</Text>
            </View>
          )}
          {!!planKey && (
            <View style={[s.badge, s.badgePlan]}>
              <Text style={s.badgeText}>{t(`mine.myAds.${planKey}`)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={s.body}>
        <Text style={s.title} numberOfLines={1}>{item.title || t('mine.myAds.untitled')}</Text>
        {!!item.description && (
          <Text style={s.description} numberOfLines={2}>{item.description}</Text>
        )}

        <View style={s.infoRow}>
          <View style={s.infoBox}>
            <Text style={s.infoLabel}>{t('mine.myAds.plan')}</Text>
            <Text style={[s.infoValue, !planKey && s.infoValueMuted]} numberOfLines={1}>
              {planKey ? t(`mine.myAds.${planKey}`) : '—'}
            </Text>
          </View>
          <View style={s.infoBox}>
            <Text style={s.infoLabel}>{t('mine.myAds.expires')}</Text>
            {expiryInfo ? (
              <Text
                style={[
                  s.infoValue,
                  expiryInfo.isExpired ? s.infoValueDanger : expiryInfo.urgent ? s.infoValueWarning : null,
                ]}
                numberOfLines={1}
              >
                {expiryInfo.date}
                <Text style={s.infoStatus}> ({expiryInfo.status})</Text>
              </Text>
            ) : (
              <Text style={[s.infoValue, s.infoValueMuted]} numberOfLines={1}>—</Text>
            )}
          </View>
        </View>

        <View style={s.priceRow}>
          <Text style={s.price} numberOfLines={1}>
            {item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}
          </Text>
          {!!(item.category || item.mainCategory) && (
            <View style={s.typeBadge}>
              <Text style={s.typeText} numberOfLines={1}>{item.category || item.mainCategory}</Text>
            </View>
          )}
        </View>

        <View style={s.actions}>
          {canPay ? (
            <TouchableOpacity
              style={[s.actionBtn, isExpired ? s.actionBtnRelist : s.actionBtnPay]}
              onPress={() => onPayNow(item)}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name={isExpired ? 'refresh' : 'credit-card-outline'}
                size={13}
                color={Colors.white}
              />
              <Text style={s.actionBtnText}>
                {isExpired ? t('mine.myAds.relist') : t('mine.myAds.payNow')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[s.actionBtn, s.actionBtnView]} onPress={handleManage} activeOpacity={0.85}>
              <MaterialCommunityIcons name="pencil-outline" size={13} color={Colors.primary} />
              <Text style={[s.actionBtnText, s.actionBtnTextView]}>{t('mine.myAds.edit')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[s.actionBtn, s.actionBtnDelete]}
            onPress={() => onDelete(item)}
            disabled={deleting}
            activeOpacity={0.85}
          >
            {deleting ? (
              <ActivityIndicator size="small" color={Colors.error} />
            ) : (
              <>
                <MaterialCommunityIcons name="trash-can-outline" size={13} color={Colors.error} />
                <Text style={[s.actionBtnText, s.actionBtnTextDelete]}>{t('mine.myAds.delete')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(MyAdCard);
