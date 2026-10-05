import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../../../../../hooks/app/useTheme";
import { useAppTranslation } from "../../../../../../../hooks/app/useAppTranslation";
import { useTabBarClearance } from "../../../../../../../hooks/app/useResponsive";
import { useMaxPlanPrice } from "../../../../../../../hooks/listings/useNewAd";
import { usePlanLayout } from "../../../../../../../hooks/listings/useNewAd";
import { LoadingSpinner } from "../../../../../../loading";
import type { StepPlanProps } from "../../../../../../../utils/types";
import { createStyles, PLAN_FOOTER_HEIGHT } from "../../../../../../../utils/styles/new-ad/stepPlan.styles";
import { PlanCard } from "./PlanCard";
import { bottomOffset, spacerHeight } from "../../../../../../../utils/styles/common/dynamic.styles";

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
  const { wide, compact, gridCardWidth } = usePlanLayout();

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

      <ScrollView overScrollMode="never"
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={wide && s.wideContent}>
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
            <View style={wide ? s.cardsGrid : s.cardsCol}>
              {plans.map((plan) => (
                <PlanCard
                  key={plan.key}
                  plan={plan}
                  selected={selected?.key === plan.key}
                  isBestValue={maxPrice > 0 && plan.price === maxPrice}
                  onSelect={onSelect}
                  compact={compact}
                  width={gridCardWidth}
                />
              ))}
            </View>
          )}
        </View>

        <View style={spacerHeight(clearance + PLAN_FOOTER_HEIGHT)} />
      </ScrollView>

      <View style={[s.footer, bottomOffset(clearance)]}>
        <View style={wide && s.footerWide}>
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
    </View>
  );
}
