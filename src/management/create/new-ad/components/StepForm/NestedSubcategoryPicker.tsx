import React from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../../../components/hooks/useTheme";
import type { NestedSubCategory } from "../../../../../constants";
import { createStyles } from "../../../../../util/styles/new-ad/stepForm.styles";

interface NestedSubcategoryPickerProps {
  options: NestedSubCategory[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function NestedSubcategoryPicker({
  options,
  search,
  onSearchChange,
  selectedKey,
  onSelect,
}: NestedSubcategoryPickerProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? options.filter((n) => t(n.labelKey).toLowerCase().includes(query))
    : options;

  return (
    <View style={s.nestedWrap}>
      <Text style={s.nestedLabel}>{t("postAd.subCategoryLabel")}</Text>
      <View style={s.nestedSearchBox}>
        <MaterialCommunityIcons name="magnify" size={16} color={Colors.primary} />
        <TextInput
          style={s.nestedSearchInput}
          value={search}
          onChangeText={onSearchChange}
          placeholder={t("postAd.searchTypePlaceholder")}
          placeholderTextColor={Colors.placeholder}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")} hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {filtered.length > 0 ? (
        <View style={s.chipsRow}>
          {filtered.map((n) => {
            const active = selectedKey === n.key;
            return (
              <Pressable
                key={n.key}
                onPress={() => onSelect(active ? "" : n.key)}
                style={[s.chip, active && s.chipActive]}
                hitSlop={4}
              >
                <MaterialCommunityIcons
                  name={n.icon as any}
                  size={13}
                  color={active ? Colors.white : Colors.textSecondary}
                />
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {t(n.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={s.nestedEmptyText}>{t("postAd.noMatches")}</Text>
      )}
    </View>
  );
}
