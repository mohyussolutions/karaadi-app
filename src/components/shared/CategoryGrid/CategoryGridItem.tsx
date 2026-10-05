import { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import ThemedIcon from "../ThemedIcon/ThemedIcon";
import { useThemeColors, useThemedStyles } from "../../../hooks/app/useTheme";
import { createStyles } from "../../../utils/styles/shared/categoryGrid.styles";
import type { CategoryGridItemProps } from "../../../utils/types";

export const CategoryGridItem = memo(function CategoryGridItem({ category, label, width, onPress }: CategoryGridItemProps) {
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
            <ThemedIcon name={category.icon} size={22} color={pressed ? Colors.white : Colors.gray700} />
          </View>
          <Text style={[styles.label, pressed && styles.labelPressed]} numberOfLines={2}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
});
