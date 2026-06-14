import React, { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { AppIcon } from "../../../components/shared";
import type { NestedSubCategory } from "../../../constants";
import type { NestedChipsProps, ChipItemProps } from "../../../util/types";
import { createStyles } from "../../../util/styles/browse/subcategory.styles";

const ChipItem = memo(function ChipItem({ item, active, onPress }: ChipItemProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const handlePress = useCallback(() => onPress(active ? null : item), [onPress, active, item]);

  return (
    <Pressable onPress={handlePress} style={[styles.chip, active && styles.chipActive]} hitSlop={4}>
      <AppIcon name={item.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]} numberOfLines={1}>
        {t(item.labelKey)}
      </Text>
    </Pressable>
  );
});

export function NestedChips({ items, selectedKey, onPress }: NestedChipsProps) {
  const styles = useThemedStyles(createStyles);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NestedSubCategory>) => (
      <ChipItem item={item} active={selectedKey === item.key} onPress={onPress} />
    ),
    [selectedKey, onPress],
  );

  return (
    <View style={styles.chipsScroll}>
      <FlashList
        horizontal
        data={items}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        renderItem={renderItem}
      />
    </View>
  );
}
