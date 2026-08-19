import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../../components/hooks/useTheme';
import { useAppTranslation } from '../../../../../../components/hooks/useAppTranslation';
import SocialPostCard from '../../../../../../components/cards/SocialPostCard';
import { getListingShareUrl } from '../../../../../../constants';
import type { SuccessScreenProps } from '../../../../../../util/types';
import { createStyles } from '../../../../../../util/styles/payment/successScreen.styles';

export function SuccessScreen({ plan, listingTitle, listingId, createdItem, onDone, isPremium90 }: SuccessScreenProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const listingUrl = getListingShareUrl(listingId);
  const title = listingTitle || createdItem?.title || '';
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
        title={title}
        description={createdItem?.description}
        price={createdItem?.price}
        images={createdItem?.images}
        listingUrl={listingUrl}
        isPremium90={isPremium90 ?? plan.days >= 90}
      />

      <TouchableOpacity style={s.doneBtn} onPress={onDone} activeOpacity={0.88}>
        <Text style={s.doneBtnText}>{t('postAd.viewMyAds')}</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
      </TouchableOpacity>
      <View style={s.bottomSpacer} />
    </ScrollView>
  );
}
