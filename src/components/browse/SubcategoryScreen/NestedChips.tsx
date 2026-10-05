import { useCallback } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useThemedStyles } from "../../../hooks/app/useTheme";
import type { NestedChipsProps, NestedSubCategoryRenderInfo } from "../../../utils/types";
import { createStyles } from "../../../utils/styles/browse/subcategoryBrowse.styles";
import { ChipItem } from "./ChipItem";

export function NestedChips({ items, selectedKey, onPress }: NestedChipsProps) {
  const styles = useThemedStyles(createStyles);
  const renderItem = useCallback(
    ({ item }: NestedSubCategoryRenderInfo) => (
      <ChipItem item={item} active={selectedKey === item.key} onPress={onPress} />
    ),
    [selectedKey, onPress],
  );

  return (
    <View style={styles.chipsScroll}>
      <FlashList overScrollMode="never"
        horizontal
        data={items}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        renderItem={renderItem}
      />
    </View>
  );
}
