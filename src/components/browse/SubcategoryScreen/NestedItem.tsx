import { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors, useThemedStyles } from "../../../hooks/app/useTheme";
import { useAppTranslation } from "../../../hooks/app/useAppTranslation";
import { ThemedIcon } from "../../shared";
import type { NestedItemProps } from "../../../utils/types";
import { createStyles } from "../../../utils/styles/browse/subcategoryBrowse.styles";

export const NestedItem = memo(function NestedItem({ item, active, count, onPress }: NestedItemProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const handlePress = useCallback(() => onPress(active ? null : item), [onPress, active, item]);

  return (
    <Pressable onPress={handlePress} style={[styles.nestedItem, active && styles.nestedItemActive]}>
      <View style={[styles.nestedIconWrap, active && styles.nestedIconActive]}>
        <ThemedIcon name={item.icon} size={18} color={active ? Colors.primary : Colors.textPrimary} />
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
