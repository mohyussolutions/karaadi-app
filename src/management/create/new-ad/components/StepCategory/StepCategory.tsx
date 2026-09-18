import { useCallback } from "react";
import type { StepCategoryProps } from "../../../../../util/types";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useThemeColors,
  useThemedStyles,
} from "../../../../../hooks/useTheme";
import { useAppTranslation } from "../../../../../hooks/useAppTranslation";
import { useTabBarClearance } from "../../../../../hooks/useTabBarClearance";
import { MAIN_CATEGORIES, type MainCategory } from "../../../../../constants";
import { createStyles } from "../../../../../util/styles/newAd/stepCategory.styles";
import { CategoryCard } from "./CategoryCard";
const NUM_COLUMNS = 3;

export function StepCategory({
  selected,
  onSelect,
  onNext,
  onBack,
}: StepCategoryProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const clearance = useTabBarClearance();
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MainCategory>) => (
      <CategoryCard
        category={item}
        selected={selected === item.key}
        onPress={onSelect}
      />
    ),
    [selected, onSelect],
  );

  const footer = (
    <View>
      {selected && (
        <TouchableOpacity style={s.btn} onPress={onNext}>
          <Text style={s.btnText}>{t("common.continue")}</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={18}
            color={Colors.white}
          />
        </TouchableOpacity>
      )}
      <View style={{ height: clearance }} />
    </View>
  );

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
      <FlashList
        data={MAIN_CATEGORIES}
        keyExtractor={(item) => item.key}
        numColumns={NUM_COLUMNS}
        renderItem={renderItem}
        style={s.list}
        ListFooterComponent={footer}
        contentContainerStyle={s.content}
      />
    </View>
  );
}
