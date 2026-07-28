import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useTabBarClearance } from '../../../hooks/useTabBarClearance';
import { planStyle, PLAN_CARD_COLORS } from '../constants/config';
import type { Plan, StepPlanProps } from '../../../util/types';
import { createStyles, createPlanCardStyles } from '../../../util/styles/new-ad/stepPlan.styles';

const FOOTER_HEIGHT = 108;

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
      style={[
        pc.card,
        !!plan.popular && !selected && pc.cardRecommended,
        selected && { borderColor: ps.color, borderWidth: 2 },
      ]}
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
            {plan.price > 0 && (
              <Text style={pc.priceSub}>{t('plan.perDay', { price: (plan.price / plan.days).toFixed(2) })}</Text>
            )}
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
  const clearance = useTabBarClearance();
  const maxPrice = plans.length > 0 ? Math.max(...plans.map((p) => p.price)) : 0;
  const sortedPlans = [...plans].sort((a, b) => a.days - b.days);

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
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
          <View style={s.cardsCol}>
            {sortedPlans.map((plan) => (
              <PlanCard
                key={plan.key}
                plan={plan}
                selected={selected?.key === plan.key}
                isBestValue={maxPrice > 0 && plan.price === maxPrice}
                onSelect={onSelect}
              />
            ))}
          </View>
        )}

        <View style={{ height: clearance + FOOTER_HEIGHT }} />
      </ScrollView>

      <View style={[s.footer, { bottom: clearance }]}>
        <View style={s.footerHandle} />
        {selected ? (
          <TouchableOpacity style={s.continueBtn} onPress={onNext} activeOpacity={0.88}>
            <MaterialCommunityIcons name="lock-outline" size={18} color={Colors.white} />
            <Text style={s.continueBtnText}>{t('postAd.continueToPayment', { price: selected.price })}</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={s.continueBtnOff}>
            <MaterialCommunityIcons name="gesture-tap" size={16} color={Colors.textMuted} />
            <Text style={s.continueBtnOffText}>{t('postAd.selectPlanToContinue')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
