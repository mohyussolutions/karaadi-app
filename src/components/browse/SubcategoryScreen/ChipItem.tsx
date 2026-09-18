import { memo, useCallback } from "react";
import { Text, Pressable } from "react-native";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { AppIcon } from "../../shared";
import type { ChipItemProps } from "../../../util/types";
import { createStyles } from "../../../util/styles/browse/subcategoryBrowse.styles";

export const ChipItem = memo(function ChipItem({ item, active, onPress }: ChipItemProps) {
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
