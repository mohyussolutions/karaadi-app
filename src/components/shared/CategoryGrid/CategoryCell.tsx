import { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import AppIcon from "../AppIcon/AppIcon";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { createStyles } from "../../../util/styles/shared/categoryGrid.styles";
import type { CategoryCellProps } from "../../../util/types";

export const CategoryCell = memo(function CategoryCell({ category, label, width, onPress }: CategoryCellProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const handlePress = useCallback(() => onPress(category), [onPress, category]);

  return (
    <Pressable
      hitSlop={4}
      onPress={handlePress}
      style={({ pressed }) => [styles.cell, { width }, pressed && styles.cellPressed]}
    >
      {({ pressed }) => (
        <>
          <View style={[styles.iconWrap, pressed && styles.iconWrapPressed]}>
            <AppIcon name={category.icon} size={22} color={pressed ? Colors.white : Colors.gray700} />
          </View>
          <Text style={[styles.label, pressed && styles.labelPressed]} numberOfLines={2}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
});
