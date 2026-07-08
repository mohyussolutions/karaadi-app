import { memo, useCallback } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import AppIcon from "./AppIcon";
import { useRouter } from "expo-router";
import { MAIN_CATEGORIES, MainCategory } from "../../constants/categories";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { useThemeColors, useThemedStyles } from "../../hooks/useTheme";
import { useResponsive } from "../../hooks/useResponsive";
import { createStyles, H_PAD, GAP } from "../../util/styles/shared/categoryGrid.styles";
import type { CategoryGridProps } from "../../util/types";

interface CategoryCellProps {
  category: MainCategory;
  label: string;
  width: number;
  onPress: (category: MainCategory) => void;
}

const CategoryCell = memo(function CategoryCell({ category, label, width, onPress }: CategoryCellProps) {
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

function CategoryGrid({ onPress }: CategoryGridProps) {
  const router = useRouter();
  const { t } = useAppTranslation();
  const styles = useThemedStyles(createStyles);
  const { iconCols, gridCellWidth, sidebarWidth, isTabletLandscape } = useResponsive();
  const cellWidth = Platform.OS === "web" && isTabletLandscape
    ? Math.floor((sidebarWidth - H_PAD * 2 - GAP * (iconCols - 1)) / iconCols)
    : gridCellWidth(iconCols, H_PAD, GAP);

  const handlePress = useCallback(
    (cat: MainCategory) => {
      if (onPress) {
        onPress(cat);
      } else {
        router.push({
          pathname: "/browse/[category]",
          params: { category: cat.key },
        });
      }
    },
    [onPress, router],
  );

  const rows: MainCategory[][] = [];
  for (let i = 0; i < MAIN_CATEGORIES.length; i += iconCols) {
    rows.push(MAIN_CATEGORIES.slice(i, i + iconCols));
  }

  return (
    <View style={styles.container}>
      {rows.map((row) => (
        <View key={row.map((c) => c.key).join("-")} style={styles.row}>
          {row.map((cat) => (
            <CategoryCell
              key={cat.key}
              category={cat}
              label={t(`categories.${cat.key}`) || cat.name}
              width={cellWidth}
              onPress={handlePress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default memo(CategoryGrid);
