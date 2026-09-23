import { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../hooks/useAppTranslation';
import { usePlanLayout } from '../../../../../hooks/usePlanLayout';
import { useTabBarClearance } from '../../../../../hooks/useTabBarClearance';
import { LoadingSpinner } from '../../../../../components/loading';
import type { BusinessPlan } from '../../../../../util/types/business.types';
import type { BusinessPlanStepProps } from '../../../../../util/types/component.types';
import {
  fetchBusinessPlans, selectBusinessPlan, extendBusinessPlan,
} from '../../../../../actions/categories/businessPlan.actions';
import { createStyles, PLAN_FOOTER_HEIGHT } from '../../../../../util/styles/newAd/stepPlan.styles';
import { getApiErrorMessage } from '../../helpers/business.helpers';
import { BusinessPlanCard } from './BusinessPlanCard';
import { bottomOffset, spacerHeight } from '../../../../../util/styles/common/dynamic.styles';

export function PlanStep({
  business,
  onSelected,
}: BusinessPlanStepProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const { wide, compact, gridCardWidth } = usePlanLayout();
  const insets = useSafeAreaInsets();
  const clearance = useTabBarClearance() - insets.bottom;
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BusinessPlan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBusinessPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  const maxPrice = useMemo(
    () => (plans.length > 0 ? Math.max(...plans.map((p) => p.price)) : 0),
    [plans],
  );

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

  const selectedId = selected ? (selected._id || selected.id) : null;

  return (
    <View style={s.root}>
      <ScrollView overScrollMode="never" contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={wide && s.wideContent}>
          <View style={s.header}>
            <View style={s.headerIcon}>
              <MaterialCommunityIcons name="briefcase-outline" size={28} color={Colors.primary} />
            </View>
            <Text style={s.title}>
              {!business
                ? t('mine.businesses.prePlanTitle')
                : business.planId ? t('mine.businesses.renewPlan') : t('mine.businesses.selectPlanTitle')}
            </Text>
            <Text style={s.sub}>
              {!business
                ? t('mine.businesses.prePlanDesc')
                : t('mine.businesses.selectPlanDesc', { name: business.name })}
            </Text>
          </View>

          <View style={wide ? s.cardsGrid : s.cardsCol}>
            {plans.map((plan) => {
              const planId = plan._id || plan.id;
              return (
                <BusinessPlanCard
                  key={planId}
                  plan={plan}
                  selected={selectedId === planId}
                  isBestValue={maxPrice > 0 && plan.price === maxPrice}
                  onSelect={setSelected}
                  compact={compact}
                  width={gridCardWidth}
                />
              );
            })}
          </View>
        </View>

        <View style={spacerHeight(clearance + PLAN_FOOTER_HEIGHT)} />
      </ScrollView>

      <View style={[s.footer, bottomOffset(clearance)]}>
        <View style={wide && s.footerWide}>
          {selected ? (
            <TouchableOpacity
              style={s.continueBtn}
              onPress={handleConfirm}
              disabled={submitting}
              activeOpacity={0.88}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Text style={s.continueBtnText}>
                    {!business ? t('mine.businesses.continueToApply') : t('mine.businesses.confirmPlan')}
                  </Text>
                  <MaterialCommunityIcons name="arrow-right" size={14} color={Colors.white} />
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={s.continueBtnOff}>
              <MaterialCommunityIcons name="gesture-tap" size={16} color={Colors.textMuted} />
              <Text style={s.continueBtnOffText}>{t('postAd.selectPlanToContinue')}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
