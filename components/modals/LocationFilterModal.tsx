import React from "react";
import {
  View, Text, TextInput, Pressable, TouchableOpacity,
  FlatList, Modal, KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../hooks/useTheme";
import { useResponsive } from "../../hooks/useResponsive";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { useLocationFilterRows } from "../../hooks/useLocationFilterRows";
import type { LocationFilterModalProps, FilterRow } from "../../util/types";
import { KEYBOARD_AVOIDING_BEHAVIOR } from "../common/common-for-ios-andriod";
import { tabletModalStyles, TABLET_MODAL_ICON_SIZES } from "../../util/styles/shared/ipad.styles";
import { createStyles } from "../../util/styles/browse/subcategory.styles";

function FilterRowItem({
  item, active, onPress,
}: {
  item: FilterRow;
  active: boolean;
  onPress: () => void;
}) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { isTablet } = useResponsive();
  const isCity = item.kind === "city";

  return (
    <Pressable
      style={[styles.filterOption, isTablet && tabletModalStyles.filterOption, isCity && styles.filterOptionCity, active && styles.filterOptionActive]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={active ? "checkbox-marked" : "checkbox-blank-outline"}
        size={isTablet ? TABLET_MODAL_ICON_SIZES.filterCheckbox : (isCity ? 18 : 20)}
        color={active ? Colors.primary : Colors.textMuted}
      />
      <MaterialCommunityIcons
        name={isCity ? "city-variant-outline" : "map-marker-outline"}
        size={isTablet ? TABLET_MODAL_ICON_SIZES.filterPin : (isCity ? 16 : 18)}
        color={active ? Colors.primary : Colors.textMuted}
      />
      <Text style={[styles.filterOptionText, isTablet && tabletModalStyles.filterOptionText, active && styles.filterOptionTextActive]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.filterOptionCount, active && styles.filterOptionCountActive]}>
        {item.count}
      </Text>
    </Pressable>
  );
}

export function LocationFilterModal({
  visible,
  onClose,
  regions,
  selectedRegions,
  selectedCities,
  regionCounts,
  cityCounts,
  onToggleRegion,
  onToggleCity,
  onClear,
}: LocationFilterModalProps) {
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { isTablet } = useResponsive();

  const { search, setSearch, rows } = useLocationFilterRows({
    visible, regions, selectedRegions, regionCounts, cityCounts,
  });

  const totalSelected = selectedRegions.length + selectedCities.length;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.filterBackdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={KEYBOARD_AVOIDING_BEHAVIOR} style={[styles.filterSheet, isTablet && tabletModalStyles.filterSheet]}>
        <View style={styles.filterSheetHandle} />
        <View style={styles.filterSheetHeader}>
          <Text style={[styles.filterSheetTitle, isTablet && tabletModalStyles.filterSheetTitle]}>{t("filters.location.mobileFilter")}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={isTablet ? TABLET_MODAL_ICON_SIZES.filterClose : 22} color={Colors.textMuted} />
          </Pressable>
        </View>

        <View style={[styles.filterSearchBox, isTablet && tabletModalStyles.filterSearchBox]}>
          <MaterialCommunityIcons name="magnify" size={isTablet ? TABLET_MODAL_ICON_SIZES.filterSearch : 18} color={Colors.primary} />
          <TextInput
            style={[styles.filterSearchInput, isTablet && tabletModalStyles.filterSearchInput]}
            value={search}
            onChangeText={setSearch}
            placeholder={t("common.region")}
            placeholderTextColor={Colors.placeholder}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={isTablet ? TABLET_MODAL_ICON_SIZES.filterClear : 16} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>

        <FlatList
          data={rows}
          keyExtractor={(row) => row.key}
          style={styles.filterList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.filterListContent}
          ListEmptyComponent={
            <View style={styles.filterEmpty}>
              <Text style={styles.filterEmptyText}>{t("common.noResults")}</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isCity = item.kind === "city";
            const active = isCity ? selectedCities.includes(item.name) : selectedRegions.includes(item.name);
            return (
              <FilterRowItem
                item={item}
                active={active}
                onPress={() => (isCity ? onToggleCity(item.name) : onToggleRegion(item.name))}
              />
            );
          }}
        />

        <View style={[styles.filterFooter, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={[styles.filterClearBtn, isTablet && tabletModalStyles.filterFooterBtn]} onPress={onClear} activeOpacity={0.8}>
            <Text style={[styles.filterClearText, isTablet && tabletModalStyles.filterClearText]}>{t("filters.location.clearAll")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterApplyBtn, isTablet && tabletModalStyles.filterFooterBtn]} onPress={onClose} activeOpacity={0.85}>
            <Text style={[styles.filterApplyText, isTablet && tabletModalStyles.filterApplyText]}>
              {totalSelected > 0 ? `${t("common.apply")} (${totalSelected})` : t("common.apply")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
