import React, { memo, useCallback } from "react";
import type { StepCategoryProps } from "../../../utils/types";
import type { MainCategory } from "../../../constants/categories";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { MAIN_CATEGORIES } from "../../../constants/categories";
import { createStyles } from "../../../utils/styles/new-ad/stepCategory.styles";

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
        <View style={[s.icon, { backgroundColor: category.color + "20" }]}>
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
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MainCategory>) => (
      <CategoryCard category={item} selected={selected === item.key} onPress={onSelect} />
    ),
    [selected, onSelect],
  );

  const header = (
    <Text style={s.title}>{t('postAd.selectCategoryTitle')}</Text>
  );

  const footer = (
    <View>
      {selected && (
        <TouchableOpacity style={s.btn} onPress={onNext}>
          <Text style={s.btnText}>{t('common.continue')}</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={s.back} onPress={onBack}>
        <Text style={s.backText}>{'← ' + t('common.back')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlashList
      data={MAIN_CATEGORIES}
      keyExtractor={(item) => item.key}
      numColumns={NUM_COLUMNS}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      contentContainerStyle={s.content}
    />
  );
}
