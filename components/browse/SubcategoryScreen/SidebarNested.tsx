import React, { memo, useCallback } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { AppIcon } from "../../../components/shared";
import type { NestedSubCategory } from "../../../constants";
import type { SidebarNestedProps, NestedItemProps } from "../../../util/types";
import { createStyles } from "../../../util/styles/browse/subcategory.styles";

const NestedItem = memo(function NestedItem({ item, active, count, onPress }: NestedItemProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const handlePress = useCallback(() => onPress(active ? null : item), [onPress, active, item]);

  return (
    <Pressable onPress={handlePress} style={[styles.nestedItem, active && styles.nestedItemActive]}>
      <View style={[styles.nestedIconWrap, active && styles.nestedIconActive]}>
        <AppIcon name={item.icon} size={18} color={active ? Colors.primary : Colors.textPrimary} />
      </View>
      <Text style={[styles.nestedLabel, active && styles.nestedLabelActive]} numberOfLines={2}>
        {t(item.labelKey)}
      </Text>
      {count > 0 && (
        <Text style={[styles.nestedCount, active && styles.nestedCountActive]}>{count}</Text>
      )}
    </Pressable>
  );
});

export function SidebarNested({ items, selectedKey, counts, onPress, subLabel, subIcon, onPost, onFilterPress, hasLocationFilter }: SidebarNestedProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NestedSubCategory>) => (
      <NestedItem item={item} active={selectedKey === item.key} count={counts[item.key] ?? 0} onPress={onPress} />
    ),
    [selectedKey, counts, onPress],
  );

  const header = (
    <View>
      <View style={styles.sidebarHeader}>
        <AppIcon name={subIcon} size={18} color={Colors.primary} />
        <Text style={styles.sidebarTitle} numberOfLines={2}>{subLabel}</Text>
        <Pressable
          style={[styles.filterIconBtn, hasLocationFilter && styles.filterIconBtnActive]}
          onPress={onFilterPress}
          hitSlop={6}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={16}
            color={hasLocationFilter ? Colors.white : Colors.primary}
          />
        </Pressable>
      </View>

      {selectedKey && (
        <Pressable style={styles.clearRow} onPress={() => onPress(null)}>
          <MaterialCommunityIcons name="filter-remove-outline" size={16} color={Colors.primary} />
          <Text style={styles.clearText}>{t("common.clearFilter") || "Clear filter"}</Text>
        </Pressable>
      )}
    </View>
  );

  const footer = (
    <TouchableOpacity style={styles.postBtn} onPress={onPost} activeOpacity={0.88}>
      <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
      <Text style={styles.postBtnText}>{t("wantSell.title")}</Text>
      <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.white} />
    </TouchableOpacity>
  );

  return (
    <FlashList
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
    />
  );
}
