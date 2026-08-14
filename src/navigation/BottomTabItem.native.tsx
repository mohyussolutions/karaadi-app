import { memo } from "react";
import { Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles, useThemeMode } from "../components/hooks/useTheme";
import { useAppTranslation } from "../components/hooks/useAppTranslation";
import { createLayoutStyles } from "../util/styles/tabs/layout.styles";
import { TabButtonBackground } from "./TabButtonBackground";
import type { BottomTabItemProps } from "../util/types/navigation.types";

export const BottomTabItem = memo(function BottomTabItem({ item, focused, onPress }: BottomTabItemProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createLayoutStyles);
  const { t } = useAppTranslation();
  const { mode } = useThemeMode();
  const inactiveColor = mode === "dark" ? Colors.white : Colors.text;

  return (
    <Pressable style={styles.item} onPress={onPress}>
      {({ pressed }) => {
        const hasImage = !!item.image;
        const iconColor = hasImage || focused ? Colors.white : pressed ? Colors.primary : inactiveColor;
        const labelColor = hasImage || focused ? Colors.white : inactiveColor;

        return (
          <TabButtonBackground image={item.image} focused={focused} pressed={pressed}>
            <MaterialCommunityIcons
              name={(focused ? item.icon : item.iconOutline) as any}
              size={22}
              color={iconColor}
            />
            <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
              {t(item.labelKey)}
            </Text>
          </TabButtonBackground>
        );
      }}
    </Pressable>
  );
});
