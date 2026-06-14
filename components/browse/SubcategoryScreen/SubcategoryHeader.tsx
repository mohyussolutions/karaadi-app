import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { AppIcon } from "../../../components/shared";
import type { SubcategoryHeaderProps } from "../../../util/types";
import { createStyles } from "../../../util/styles/browse/subcategory.styles";
import { NestedChips } from "./NestedChips";

export function SubcategoryHeader({
  subIcon,
  subLabel,
  categoryLabel,
  hasLocationFilter,
  onFilterPress,
  nestedItems,
  selectedNested,
  onSelectNested,
  selectedRegions,
  selectedCities,
  onClearLocationFilter,
  showPostBtn,
  onPost,
  resultsCount,
}: SubcategoryHeaderProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View>
      <View style={styles.pageHeader}>
        <AppIcon name={subIcon} size={16} color={Colors.primary} />
        <Text style={styles.pageTitle} numberOfLines={1}>{subLabel}</Text>
        <Text style={styles.pageBreadcrumb} numberOfLines={1}>{categoryLabel}</Text>
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

      {nestedItems.length > 0 && (
        <NestedChips items={nestedItems} selectedKey={selectedNested?.key ?? null} onPress={onSelectNested} />
      )}

      {selectedNested && (
        <View style={styles.activeFilterRow}>
          <MaterialCommunityIcons name="filter-check" size={14} color={Colors.primary} />
          <Text style={styles.activeFilterText}>{t(selectedNested.labelKey)}</Text>
          <Pressable onPress={() => onSelectNested(null)} hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>
      )}

      {hasLocationFilter && (
        <View style={styles.activeFilterRow}>
          <MaterialCommunityIcons name="map-marker-radius" size={14} color={Colors.primary} />
          <Text style={styles.activeFilterText} numberOfLines={1}>
            {[...selectedRegions, ...selectedCities].join(" • ")}
          </Text>
          <Pressable onPress={onClearLocationFilter} hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>
      )}

      {showPostBtn && (
        <TouchableOpacity
          style={[styles.postBtn, styles.postBtnSpaced]}
          onPress={onPost}
          activeOpacity={0.88}
        >
          <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
          <Text style={styles.postBtnText}>{t("wantSell.title")}</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.white} />
        </TouchableOpacity>
      )}

      {resultsCount !== null && (
        <View style={styles.countRow}>
          <Text style={styles.countLabel}>{t("common.results", { defaultValue: "Results" })}:</Text>
          <Text style={styles.countValue}>{resultsCount}</Text>
        </View>
      )}
    </View>
  );
}
