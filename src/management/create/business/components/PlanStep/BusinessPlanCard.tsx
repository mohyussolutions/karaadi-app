import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../hooks/useAppTranslation';
import { planStyle } from '../../../new-ad/constants/plan';
import { businessPlanTierKey } from '../../helpers/business.helpers';
import type { BusinessPlanCardProps } from '../../../../../util/types/component.types';
import { createPlanCardStyles } from '../../../../../util/styles/newAd/stepPlan.styles';
import { bgColor, textColor, fixedWidth, planCardSelected, planRadioSelected } from '../../../../../util/styles/common/dynamic.styles';

export function BusinessPlanCard({
  plan, selected, isBestValue, onSelect, compact = false, width,
}: BusinessPlanCardProps) {
  const Colors = useThemeColors();
  const { t } = useAppTranslation();
  const pc = useThemedStyles(createPlanCardStyles, compact);
  const ps = planStyle({ key: businessPlanTierKey(plan.durationDays) }, Colors);

  return (
    <TouchableOpacity
      style={[
        pc.card,
        selected && planCardSelected(ps),
        width !== undefined && fixedWidth(width),
      ]}
      onPress={() => onSelect(plan)}
      activeOpacity={0.88}
    >
      {isBestValue && (
        <View style={[pc.badge, bgColor(ps.color)]}>
          <MaterialCommunityIcons name="star" size={11} color={Colors.white} />
          <Text style={pc.badgeText}>{t('postAd.bestValue')}</Text>
        </View>
      )}

      <View style={pc.inner}>
        <View style={pc.topRow}>
          <View style={[pc.iconBox, bgColor(selected ? ps.color : ps.bg)]}>
            <MaterialCommunityIcons name={ps.icon} size={compact ? 20 : 24} color={selected ? Colors.white : ps.color} />
          </View>
          <View style={pc.meta}>
            <Text style={[pc.name, textColor(ps.color)]} numberOfLines={1}>{plan.name}</Text>
            <Text style={pc.dur} numberOfLines={1}>
              {plan.durationDays} {t('mine.businesses.days')} · {t('mine.businesses.upToListings', { count: plan.maxListings })}
            </Text>
          </View>
          <View style={pc.priceBox}>
            <Text style={[pc.price, textColor(ps.color)]}>
              {plan.price === 0 ? t('postAd.free') : `$${plan.price}`}
            </Text>
            {plan.price > 0 && plan.durationDays > 0 && (
              <Text style={pc.priceSub}>{t('plan.perDay', { price: (plan.price / plan.durationDays).toFixed(2) })}</Text>
            )}
          </View>
          <View style={[pc.radio, selected && planRadioSelected(ps)]}>
            {selected && <MaterialCommunityIcons name="check" size={compact ? 13 : 15} color={Colors.white} />}
          </View>
        </View>

        {!!plan.features?.length && (
          <View style={pc.features}>
            {plan.features.map((f, i) => (
              <View key={i} style={pc.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={compact ? 14 : 16} color={Colors.successDark} />
                <Text style={pc.featureText} numberOfLines={1}>{f}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
