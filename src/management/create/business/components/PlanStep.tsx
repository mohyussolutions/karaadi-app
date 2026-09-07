import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { LoadingSpinner } from '../../../../components/loading';
import type { BusinessPlan } from '../../../../util/types/business.types';
import type { BusinessPlanStepProps } from '../../../../util/types/component.types';
import {
  fetchBusinessPlans, selectBusinessPlan, extendBusinessPlan,
} from '../../../../actions/categories/businessPlan.actions';
import { createStyles } from '../../../../util/styles/business/businessCreate.styles';
import { getApiErrorMessage } from '../business.helpers';

export function PlanStep({
  business,
  onSelected,
}: BusinessPlanStepProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BusinessPlan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBusinessPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  function tierFor(plan: BusinessPlan): { label: string; color: string } {
    if (plan.durationDays >= 90) return { label: t('mine.businesses.tierPremium'), color: Colors.primary };
    if (plan.durationDays >= 60) return { label: t('mine.businesses.tierStandard'), color: Colors.success };
    return { label: t('mine.businesses.tierBasic'), color: Colors.textSecondary };
  }

  async function handleConfirm() {
    if (!selected) return;
    if (!business) {
      onSelected(selected);
      return;
    }
    setSubmitting(true);
    try {
      const id = business._id || business.id || '';
      const planId = selected._id || selected.id;
      const action = business.planId ? extendBusinessPlan : selectBusinessPlan;
      const updated = await action(id, planId);
      onSelected(updated?._id || updated?.id ? updated : { ...business, planId });
    } catch (err) {
      Alert.alert(t('auth.common.error'), getApiErrorMessage(err) || t('mine.businesses.planError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 84 }]} keyboardShouldPersistTaps="handled">
      <Text style={s.heading}>
        {!business
          ? t('mine.businesses.prePlanTitle')
          : business.planId ? t('mine.businesses.renewPlan') : t('mine.businesses.selectPlanTitle')}
      </Text>
      <Text style={s.statusMessage}>
        {!business
          ? t('mine.businesses.prePlanDesc')
          : t('mine.businesses.selectPlanDesc', { name: business.name })}
      </Text>

      {plans.map((plan) => {
        const tier = tierFor(plan);
        const planId = plan._id || plan.id;
        const selectedId = selected ? (selected._id || selected.id) : null;
        const active = selectedId === planId;
        return (
          <TouchableOpacity
            key={planId}
            style={[s.planCard, active && s.planCardActive]}
            onPress={() => setSelected(plan)}
            activeOpacity={0.85}
          >
            <View style={s.planHeader}>
              <Text style={s.planName}>{plan.name}</Text>
              <View style={[s.tierBadge, { backgroundColor: tier.color + '18' }]}>
                <Text style={[s.tierBadgeText, { color: tier.color }]}>{tier.label}</Text>
              </View>
            </View>
            <Text style={s.planPrice}>
              ${plan.price} <Text style={s.planDuration}>/ {plan.durationDays} {t('mine.businesses.days')}</Text>
            </Text>
            <Text style={s.planMeta}>{t('mine.businesses.upToListings', { count: plan.maxListings })}</Text>
            {plan.features?.map((f, i) => (
              <View key={i} style={s.featureRow}>
                <MaterialCommunityIcons name="check" size={14} color={Colors.success} />
                <Text style={s.featureText}>{f}</Text>
              </View>
            ))}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[s.submitBtn, (!selected || submitting) && s.submitBtnDisabled]}
        onPress={handleConfirm}
        disabled={!selected || submitting}
        activeOpacity={0.88}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <>
            <Text style={s.submitText}>
              {!business ? t('mine.businesses.continueToApply') : t('mine.businesses.confirmPlan')}
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
          </>
        )}
      </TouchableOpacity>

      <View style={s.spacer40} />
    </ScrollView>
  );
}
