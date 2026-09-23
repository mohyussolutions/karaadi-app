import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../hooks/useAppTranslation';
import { planStyle, getPlanCardColors } from '../../constants/plan';
import type { PlanCardProps } from '../../../../../util/types/new-ad.types';
import { createPlanCardStyles } from '../../../../../util/styles/newAd/stepPlan.styles';

export function PlanCard({
  plan, selected, isBestValue, onSelect, compact = false, width,
}: PlanCardProps) {
  const Colors = useThemeColors();
  const { t } = useAppTranslation();
  const ps = planStyle(plan, Colors);
  const planCardColors = getPlanCardColors(Colors);
  const showPopular = !!plan.popular && !isBestValue;

  const pc = useThemedStyles(createPlanCardStyles, compact);

  return (
    <TouchableOpacity
      style={[
        pc.card,
        !!plan.popular && !selected && pc.cardRecommended,
        selected && { borderColor: ps.color, borderWidth: 2, backgroundColor: ps.bg },
        width !== undefined && { width },
      ]}
      onPress={() => onSelect(plan)}
      activeOpacity={0.88}
    >
      {(isBestValue || showPopular) && (
        <View style={[pc.badge, { backgroundColor: isBestValue ? ps.color : planCardColors.popularBadge }]}>
          <MaterialCommunityIcons name={isBestValue ? 'star' : 'lightning-bolt'} size={11} color={Colors.white} />
          <Text style={pc.badgeText}>{isBestValue ? t('postAd.bestValue') : t('postAd.popular')}</Text>
        </View>
      )}

      <View style={pc.inner}>
        <View style={pc.topRow}>
          <View style={[pc.iconBox, { backgroundColor: selected ? ps.color : ps.bg }]}>
            <MaterialCommunityIcons name={ps.icon} size={compact ? 20 : 24} color={selected ? Colors.white : ps.color} />
          </View>
          <View style={pc.meta}>
            <Text style={[pc.name, { color: ps.color }]}>{plan.label}</Text>
            <Text style={pc.dur} numberOfLines={1}>
              {plan.days} {t('plan.days')} · {t('postAd.expiresOn', { date: new Date(Date.now() + plan.days * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) })}
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
          <View style={[pc.radio, selected && { borderColor: ps.color, backgroundColor: ps.color }]}>
            {selected && <MaterialCommunityIcons name="check" size={compact ? 13 : 15} color={Colors.white} />}
          </View>
        </View>

        <View style={pc.features}>
          {(plan.features || []).map((f, i) => (
            <View key={i} style={pc.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={compact ? 14 : 16} color={Colors.successDark} />
              <Text style={pc.featureText} numberOfLines={1}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
