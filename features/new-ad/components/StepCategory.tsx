import React, { memo, useCallback } from "react";
import type { StepCategoryProps } from "../../../util/types";
import type { MainCategory } from "../../../constants/categories";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { MAIN_CATEGORIES } from "../../../constants/categories";
import { createStyles } from "../../../util/styles/new-ad/stepCategory.styles";

const NUM_COLUMNS = 3;

interface CategoryCardProps {
  category: MainCategory;
  selected: boolean;
  onPress: (key: string) => void;
}

const CategoryCard = memo(function CategoryCard({ category, selected, onPress }: CategoryCardProps) {
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const handlePress = useCallback(() => onPress(category.key), [onPress, category.key]);
  return (
    <View style={s.cell}>
      <TouchableOpacity
        style={[
          s.card,
          selected && {
            borderColor: category.color,
            borderWidth: 2,
            backgroundColor: category.color + "10",
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={s.icon}>
          <MaterialCommunityIcons name={category.icon as any} size={26} color={category.color} />
        </View>
        <Text style={[s.label, selected && { color: category.color }]} numberOfLines={2}>
          {t(`categories.${category.key}`, { defaultValue: category.name })}
        </Text>
        {selected && (
          <MaterialCommunityIcons name="check-circle" size={16} color={category.color} style={s.check} />
        )}
      </TouchableOpacity>
    </View>
  );
});

export function StepCategory({ selected, onSelect, onNext, onBack }: StepCategoryProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MainCategory>) => (
      <CategoryCard category={item} selected={selected === item.key} onPress={onSelect} />
    ),
    [selected, onSelect],
  );

  const footer = (
    <View>
      {selected && (
        <TouchableOpacity style={s.btn} onPress={onNext}>
          <Text style={s.btnText}>{t('common.continue')}</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
        </TouchableOpacity>
      )}
      <View style={{ height: insets.bottom + 84 }} />
    </View>
  );

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{t('postAd.selectCategoryTitle')}</Text>
        <View style={s.topBarSpacer} />
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
