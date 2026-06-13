import { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import AppIcon from "./AppIcon";
import { useRouter } from "expo-router";
import { MAIN_CATEGORIES, MainCategory } from "../../constants/categories";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { useThemeColors, useThemedStyles } from "../../hooks/useTheme";
import { createStyles, COLS } from "./CategoryGrid.styles";
import type { CategoryGridProps } from "../../utils/types";

interface CategoryCellProps {
  category: MainCategory;
  label: string;
  onPress: (category: MainCategory) => void;
}

const CategoryCell = memo(function CategoryCell({ category, label, onPress }: CategoryCellProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const handlePress = useCallback(() => onPress(category), [onPress, category]);

  return (
    <Pressable
      hitSlop={4}
      onPress={handlePress}
      style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
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
  for (let i = 0; i < MAIN_CATEGORIES.length; i += COLS) {
    rows.push(MAIN_CATEGORIES.slice(i, i + COLS));
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
              onPress={handlePress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default memo(CategoryGrid);
