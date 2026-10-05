import { useCallback } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../hooks/app/useTheme";
import { useAppTranslation } from "../../../hooks/app/useAppTranslation";
import { ThemedIcon } from "../../shared";
import type { NestedSubCategoryRenderInfo, SidebarNestedProps } from "../../../utils/types";
import { createStyles } from "../../../utils/styles/browse/subcategoryBrowse.styles";
import { NestedItem } from "./NestedItem";

export function SidebarNested({ items, selectedKey, counts, onPress, subLabel, subIcon, onPost, onFilterPress, hasLocationFilter }: SidebarNestedProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const renderItem = useCallback(
    ({ item }: NestedSubCategoryRenderInfo) => (
      <NestedItem item={item} active={selectedKey === item.key} count={counts[item.key] ?? 0} onPress={onPress} />
    ),
    [selectedKey, counts, onPress],
  );

  const header = (
    <View>
      <View style={styles.sidebarHeader}>
        <ThemedIcon name={subIcon} size={18} color={Colors.primary} />
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
    <FlashList overScrollMode="never"
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
    />
  );
}
