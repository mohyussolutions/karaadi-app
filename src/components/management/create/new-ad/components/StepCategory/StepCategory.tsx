import { useCallback } from "react";
import type { MainCategoryRenderInfo, StepCategoryProps } from "../../../../../../utils/types";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useThemeColors,
  useThemedStyles,
} from "../../../../../../hooks/app/useTheme";
import { useAppTranslation } from "../../../../../../hooks/app/useAppTranslation";
import { useTabBarClearance } from "../../../../../../hooks/app/useResponsive";
import { MAIN_CATEGORIES, STEP_CATEGORY_NUM_COLUMNS } from "../../../../../../actions/constants";
import { createStyles } from "../../../../../../utils/styles/new-ad/stepCategory.styles";
import { CategoryCard } from "./CategoryCard";
import { spacerHeight } from '../../../../../../utils/styles/common/dynamic.styles';

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
    ({ item }: MainCategoryRenderInfo) => (
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
      <View style={spacerHeight(clearance)} />
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
      <FlashList overScrollMode="never"
        data={MAIN_CATEGORIES}
        keyExtractor={(item) => item.key}
        numColumns={STEP_CATEGORY_NUM_COLUMNS}
        renderItem={renderItem}
        style={s.list}
        ListFooterComponent={footer}
        contentContainerStyle={s.content}
      />
    </View>
  );
}
