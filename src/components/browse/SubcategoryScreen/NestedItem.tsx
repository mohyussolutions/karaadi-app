import { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { AppIcon } from "../../shared";
import type { NestedItemProps } from "../../../util/types";
import { createStyles } from "../../../util/styles/browse/subcategoryBrowse.styles";

export const NestedItem = memo(function NestedItem({ item, active, count, onPress }: NestedItemProps) {
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
