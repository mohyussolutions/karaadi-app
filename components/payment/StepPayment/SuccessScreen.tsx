import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import SocialPostCard from '../../cards/SocialPostCard';
import { getListingShareUrl } from '../../../constants';
import type { SuccessScreenProps } from '../../../util/types';
import { createStyles } from '../../../util/styles/payment/successScreen.styles';

export function SuccessScreen({ plan, listingTitle, listingId, createdItem, onDone }: SuccessScreenProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const listingUrl = getListingShareUrl(listingId);
  const checklist = [
    t('postAd.checklistPaymentConfirmed'),
    t('postAd.checklistListingPaid'),
    t('postAd.checklistVisibleToBuyers'),
  ];

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.iconCircle}>
        <MaterialCommunityIcons name="check-circle" size={72} color={Colors.success} />
      </View>
      <Text style={s.title}>{t('postAd.paymentSuccessTitle')}</Text>
      <Text style={s.sub}>
        {t('postAd.paymentSuccessSub', { plan: plan.label, days: plan.days })}
      </Text>

      <View style={s.checkCard}>
        {checklist.map((l) => (
          <View key={l} style={s.checkRow}>
            <View style={s.checkDot}>
              <MaterialCommunityIcons name="check" size={14} color={Colors.success} />
            </View>
            <Text style={s.checkLabel}>{l}</Text>
          </View>
        ))}
      </View>

      <SocialPostCard
        title={listingTitle || createdItem?.title || ''}
        description={createdItem?.description}
        price={createdItem?.price}
        images={createdItem?.images}
        listingUrl={listingUrl}
      />

      <TouchableOpacity style={s.viewBtn} onPress={() => Linking.openURL(listingUrl).catch(() => {})} activeOpacity={0.88}>
        <MaterialCommunityIcons name="open-in-new" size={15} color={Colors.primary} />
        <Text style={s.viewBtnText}>{t('postAd.viewListing')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.doneBtn} onPress={onDone} activeOpacity={0.88}>
        <Text style={s.doneBtnText}>{t('postAd.viewMyAds')}</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
      </TouchableOpacity>
      <View style={s.bottomSpacer} />
    </ScrollView>
  );
}
