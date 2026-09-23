import { useCallback } from "react";
import { View } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useThemedStyles } from "../../../hooks/useTheme";
import type { NestedSubCategory } from "../../../constants";
import type { NestedChipsProps } from "../../../util/types";
import { createStyles } from "../../../util/styles/browse/subcategoryBrowse.styles";
import { ChipItem } from "./ChipItem";

export function NestedChips({ items, selectedKey, onPress }: NestedChipsProps) {
  const styles = useThemedStyles(createStyles);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NestedSubCategory>) => (
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
