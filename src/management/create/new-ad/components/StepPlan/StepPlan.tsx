import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../../../hooks/useTheme";
import { useAppTranslation } from "../../../../../hooks/useAppTranslation";
import { useTabBarClearance } from "../../../../../hooks/useTabBarClearance";
import { useMaxPlanPrice } from "../../../../../hooks/useMaxPlanPrice";
import { LoadingSpinner } from "../../../../../components/loading";
import type { StepPlanProps } from "../../../../../util/types";
import { createStyles } from "../../../../../util/styles/newAd/stepPlan.styles";
import { PlanCard } from "./PlanCard";

const FOOTER_HEIGHT = 108;
export function StepPlan({
  plans,
  loading,
  selected,
  onSelect,
  onNext,
  onBack,
}: StepPlanProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const clearance = useTabBarClearance();
  const maxPrice = useMaxPlanPrice(plans);

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.headerIcon}>
            <MaterialCommunityIcons
              name="star-circle-outline"
              size={28}
              color={Colors.primary}
            />
          </View>
          <Text style={s.title}>{t("postAd.boostListing")}</Text>
          <Text style={s.sub}>{t("postAd.boostListingSub")}</Text>
        </View>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <View style={s.cardsCol}>
            {plans.map((plan) => (
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
          <TouchableOpacity
            style={s.continueBtn}
            onPress={onNext}
            activeOpacity={0.88}
          >
            <MaterialCommunityIcons
              name="lock-outline"
              size={14}
              color={Colors.white}
            />
            <Text style={s.continueBtnText}>
              {t("postAd.continueToPayment", { price: selected.price })}
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={14}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : (
          <View style={s.continueBtnOff}>
            <MaterialCommunityIcons
              name="gesture-tap"
              size={16}
              color={Colors.textMuted}
            />
            <Text style={s.continueBtnOffText}>
              {t("postAd.selectPlanToContinue")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
