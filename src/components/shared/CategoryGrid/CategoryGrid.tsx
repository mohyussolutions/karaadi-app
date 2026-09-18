import { memo, useCallback } from "react";
import { View, Platform } from "react-native";
import { useRouter } from "expo-router";
import { MAIN_CATEGORIES, MainCategory } from "../../../constants";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { useThemedStyles } from "../../../hooks/useTheme";
import { useResponsive } from "../../../hooks/useResponsive";
import { H_PAD, GRID_GAP } from "../../../constants/constants";
import { createStyles } from "../../../util/styles/shared/categoryGrid.styles";
import type { CategoryGridProps } from "../../../util/types";
import { CategoryCell } from "./CategoryCell";
import { ROUTES } from "../../../constants/constants";

function CategoryGrid({ onPress }: CategoryGridProps) {
  const router = useRouter();
  const { t } = useAppTranslation();
  const styles = useThemedStyles(createStyles);
  const { iconCols, gridCellWidth, sidebarWidth, isTabletLandscape } = useResponsive();
  const cellWidth = Platform.OS === "web" && isTabletLandscape
    ? Math.floor((sidebarWidth - H_PAD * 2 - GRID_GAP * (iconCols - 1)) / iconCols)
    : gridCellWidth(iconCols, H_PAD, GRID_GAP);

  const handlePress = useCallback(
    (cat: MainCategory) => {
      if (onPress) {
        onPress(cat);
      } else {
        router.push({
          pathname: ROUTES.browseCategory,
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
