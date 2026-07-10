import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { planStyle, PLAN_CARD_COLORS } from '../constants/config';
import type { Plan, StepPlanProps } from '../../../util/types';
import { createStyles, createPlanCardStyles } from '../../../util/styles/new-ad/stepPlan.styles';

function PlanCard({
  plan, selected, isBestValue, onSelect,
}: {
  plan: Plan; selected: boolean; isBestValue: boolean; onSelect: (p: Plan) => void;
}) {
  const Colors = useThemeColors();
  const { t } = useAppTranslation();
  const ps = planStyle(plan, Colors);
  const showPopular = !!plan.popular && !isBestValue;

  const pc = useThemedStyles(createPlanCardStyles);

  return (
    <TouchableOpacity
      style={[pc.card, selected && { borderColor: ps.color, borderWidth: 2 }]}
      onPress={() => onSelect(plan)}
      activeOpacity={0.88}
    >
      <View style={[pc.stripe, { backgroundColor: ps.color }]} />

      {isBestValue && (
        <View style={[pc.badge, { backgroundColor: ps.color }]}>
          <MaterialCommunityIcons name="star" size={10} color={Colors.white} />
          <Text style={pc.badgeText}>{t('postAd.bestValue')}</Text>
        </View>
      )}
      {showPopular && (
        <View style={[pc.badge, { backgroundColor: PLAN_CARD_COLORS.popularBadge }]}>
          <MaterialCommunityIcons name="lightning-bolt" size={10} color={Colors.white} />
          <Text style={pc.badgeText}>{t('postAd.popular')}</Text>
        </View>
      )}

      <View style={pc.inner}>
        <View style={pc.topRow}>
          <View style={[pc.iconBox, { backgroundColor: selected ? ps.color : ps.bg }]}>
            <MaterialCommunityIcons name={ps.icon as any} size={22} color={selected ? Colors.white : ps.color} />
          </View>
          <View style={pc.meta}>
            <Text style={[pc.name, { color: ps.color }]}>{plan.label}</Text>
            <Text style={pc.dur}>{plan.days} {t('plan.days')}</Text>
            <Text style={pc.exp}>
              {t('postAd.expiresOn', { date: new Date(Date.now() + plan.days * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) })}
            </Text>
          </View>
          <View style={pc.priceBox}>
            <Text style={[pc.price, { color: ps.color }]}>
              {plan.price === 0 ? t('postAd.free') : `$${plan.price}`}
            </Text>
            {plan.price > 0 && <Text style={pc.priceSub}>{t('plan.currency')}</Text>}
          </View>
        </View>

        <View style={pc.divider} />

        <View style={pc.features}>
          {(plan.features || []).map((f, i) => (
            <View key={i} style={pc.featureRow}>
              <View style={pc.checkCircle}>
                <MaterialCommunityIcons name="check" size={11} color={Colors.successDark} />
              </View>
              <Text style={pc.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={[pc.btn, { backgroundColor: selected ? ps.color : PLAN_CARD_COLORS.unselectedBtn }]}>
          {selected && <MaterialCommunityIcons name="check-circle" size={14} color={Colors.white} />}
          <Text style={pc.btnText}>{selected ? t('postAd.selectedPlan') : t('postAd.choosePlan')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function StepPlan({ plans, loading, selected, onSelect, onNext, onBack }: StepPlanProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();
  const maxPrice = plans.length > 0 ? Math.max(...plans.map((p) => p.price)) : 0;

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{t('postAd.choosePlanTitle')}</Text>
        <View style={s.topBarSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={s.headerIcon}>
            <MaterialCommunityIcons name="star-circle-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={s.title}>{t('postAd.boostListing')}</Text>
          <Text style={s.sub}>{t('postAd.boostListingSub')}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={s.loadingIndicator} />
        ) : (
          <View style={s.cards}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.key}
                plan={plan}
                selected={selected?._id === plan._id}
                isBestValue={maxPrice > 0 && plan.price === maxPrice}
                onSelect={onSelect}
              />
            ))}
          </View>
        )}

        <View style={s.bottomSpacer} />
      </ScrollView>

      <View style={[s.footer, { bottom: insets.bottom + 84 }]}>
        {selected ? (
          <TouchableOpacity style={s.continueBtn} onPress={onNext} activeOpacity={0.88}>
            <MaterialCommunityIcons name="lock-outline" size={18} color={Colors.white} />
            <Text style={s.continueBtnText}>{t('postAd.continueToPayment', { price: selected.price })}</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={s.continueBtnOff}>
            <Text style={s.continueBtnOffText}>{t('postAd.selectPlanToContinue')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
