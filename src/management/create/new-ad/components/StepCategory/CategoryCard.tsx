import { memo, useCallback } from "react";
import type { CategoryCardProps } from "../../../../../util/types";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemedStyles } from "../../../../../hooks/useTheme";
import { useAppTranslation } from "../../../../../hooks/useAppTranslation";
import type { MCIcon } from "../../../../../util/icons/icons";
import { createStyles } from "../../../../../util/styles/newAd/stepCategory.styles";

export const CategoryCard = memo(function CategoryCard({
  category,
  selected,
  onPress,
}: CategoryCardProps) {
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const handlePress = useCallback(
    () => onPress(category.key),
    [onPress, category.key],
  );
  return (
    <View style={s.cell}>
      <TouchableOpacity
        style={[
          s.card,
          selected && {
            borderColor: category.color,
            borderWidth: 2,
            backgroundColor: category.color + "10",
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={s.icon}>
          <MaterialCommunityIcons
            name={category.icon as MCIcon}
            size={26}
            color={category.color}
          />
        </View>
        <Text
          style={[s.label, selected && { color: category.color }]}
          numberOfLines={2}
        >
          {t(`categories.${category.key}`, { defaultValue: category.name })}
        </Text>
        {selected && (
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={category.color}
            style={s.check}
          />
        )}
      </TouchableOpacity>
    </View>
  );
});
