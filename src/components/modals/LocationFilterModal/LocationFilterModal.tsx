import { memo, useCallback } from "react";
import {
  View, Text, TextInput, Pressable, TouchableOpacity,
  FlatList, Modal, KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles, type ColorPalette } from "../../../hooks/useTheme";
import { useResponsive } from "../../../hooks/useResponsive";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { useLocationFilterRows } from "../../../hooks/useLocationFilterRows";
import type { LocationFilterModalProps, FilterRow } from "../../../util/types";
import { tabletModalStyles } from "../../../util/styles/shared/tablet.styles";
import { createStyles } from "../../../util/styles/browse/subcategoryBrowse.styles";
import { isCityRow } from "./LocationFilterModal.helpers";
import { TABLET_MODAL_ICON_SIZES } from '../../../constants';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../util/platform/common-for-ios-andriod';

type FilterStyles = ReturnType<typeof createStyles>;

const FilterRowItem = memo(function FilterRowItem({
  item, active, onToggleRegion, onToggleCity,
}: {
  item: FilterRow;
  active: boolean;
  onToggleRegion: (name: string) => void;
  onToggleCity: (name: string) => void;
}) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { isTablet } = useResponsive();
  const isCity = isCityRow(item);

  return (
    <Pressable
      style={[styles.filterOption, isTablet && tabletModalStyles.filterOption, isCity && styles.filterOptionCity, active && styles.filterOptionActive]}
      onPress={() => (isCity ? onToggleCity(item.name) : onToggleRegion(item.name))}
    >
      <MaterialCommunityIcons
        name={active ? "checkbox-marked" : "checkbox-blank-outline"}
        size={isTablet ? TABLET_MODAL_ICON_SIZES.filterCheckbox : (isCity ? 18 : 20)}
        color={active ? Colors.primary : Colors.textMuted}
      />
      {!isCity && (
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={isTablet ? TABLET_MODAL_ICON_SIZES.filterPin : 18}
          color={active ? Colors.primary : Colors.textMuted}
        />
      )}
      <Text style={[styles.filterOptionText, isTablet && tabletModalStyles.filterOptionText, active && styles.filterOptionTextActive]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.filterOptionCount, active && styles.filterOptionCountActive]}>
        {item.count}
      </Text>
    </Pressable>
  );
});

const FilterModalHeader = memo(function FilterModalHeader({
  title, onClose, isTablet, Colors, styles,
}: {
  title: string;
  onClose: () => void;
  isTablet: boolean;
  Colors: ColorPalette;
  styles: FilterStyles;
}) {
  return (
    <View style={styles.filterSheetHeader}>
      <Text style={[styles.filterSheetTitle, isTablet && tabletModalStyles.filterSheetTitle]}>{title}</Text>
      <Pressable onPress={onClose} hitSlop={12}>
        <MaterialCommunityIcons name="close" size={isTablet ? TABLET_MODAL_ICON_SIZES.filterClose : 22} color={Colors.textMuted} />
      </Pressable>
    </View>
  );
});

const FilterSearchBox = memo(function FilterSearchBox({
  search, onSearchChange, placeholder, isTablet, Colors, styles,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  isTablet: boolean;
  Colors: ColorPalette;
  styles: FilterStyles;
}) {
  return (
    <View style={[styles.filterSearchBox, isTablet && tabletModalStyles.filterSearchBox]}>
      <MaterialCommunityIcons name="magnify" size={isTablet ? TABLET_MODAL_ICON_SIZES.filterSearch : 18} color={Colors.primary} />
      <TextInput
        style={[styles.filterSearchInput, isTablet && tabletModalStyles.filterSearchInput]}
        value={search}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        autoCorrect={false}
      />
      {search.length > 0 && (
        <Pressable onPress={() => onSearchChange("")} hitSlop={8}>
          <MaterialCommunityIcons name="close-circle" size={isTablet ? TABLET_MODAL_ICON_SIZES.filterClear : 16} color={Colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
});

const FilterModalFooter = memo(function FilterModalFooter({
  totalSelected, onClear, onApply, insetBottom, isTablet, t, styles,
}: {
  totalSelected: number;
  onClear: () => void;
  onApply: () => void;
  insetBottom: number;
  isTablet: boolean;
  t: (key: string) => string;
  styles: FilterStyles;
}) {
  return (
    <View style={[styles.filterFooter, { paddingBottom: insetBottom + 12 }]}>
      <TouchableOpacity style={[styles.filterClearBtn, isTablet && tabletModalStyles.filterFooterBtn]} onPress={onClear} activeOpacity={0.8}>
        <Text style={[styles.filterClearText, isTablet && tabletModalStyles.filterClearText]}>{t("filters.location.clearAll")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.filterApplyBtn, isTablet && tabletModalStyles.filterFooterBtn]} onPress={onApply} activeOpacity={0.85}>
        <Text style={[styles.filterApplyText, isTablet && tabletModalStyles.filterApplyText]}>
          {totalSelected > 0 ? `${t("common.apply")} (${totalSelected})` : t("common.apply")}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

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

  const renderRow = useCallback(({ item }: { item: FilterRow }) => {
    const active = isCityRow(item) ? selectedCities.includes(item.name) : selectedRegions.includes(item.name);
    return (
      <FilterRowItem
        item={item}
        active={active}
        onToggleRegion={onToggleRegion}
        onToggleCity={onToggleCity}
      />
    );
  }, [selectedCities, selectedRegions, onToggleRegion, onToggleCity]);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.filterBackdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={KEYBOARD_AVOIDING_BEHAVIOR} style={[styles.filterSheet, isTablet && tabletModalStyles.filterSheet]}>
        <View style={styles.filterSheetHandle} />
        <FilterModalHeader
          title={t("filters.location.mobileFilter")}
          onClose={onClose}
          isTablet={isTablet}
          Colors={Colors}
          styles={styles}
        />

        <FilterSearchBox
          search={search}
          onSearchChange={setSearch}
          placeholder={t("common.region")}
          isTablet={isTablet}
          Colors={Colors}
          styles={styles}
        />

        <FlatList overScrollMode="never"
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
          renderItem={renderRow}
        />

        <FilterModalFooter
          totalSelected={totalSelected}
          onClear={onClear}
          onApply={onClose}
          insetBottom={insets.bottom}
          isTablet={isTablet}
          t={t}
          styles={styles}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}
