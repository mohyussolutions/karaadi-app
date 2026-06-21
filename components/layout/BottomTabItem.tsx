import { memo } from "react";
import { Text, Pressable } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles, useThemeMode } from "../../hooks/useTheme";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { createLayoutStyles } from "../../util/styles/tabs/layout.styles";
import { TabButtonBackground } from "./TabButtonBackground";
import type { TabItem } from "../../util/types/interfaces/common";

interface BottomTabItemProps {
  item: TabItem;
  focused: boolean;
  onPress: () => void;
}

export const BottomTabItem = memo(function BottomTabItem({ item, focused, onPress }: BottomTabItemProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createLayoutStyles);
  const { t } = useAppTranslation();
  const { mode } = useThemeMode();
  const IconComponent = item.iconFamily === "Octicons" ? Octicons : Ionicons;
  const inactiveColor = mode === "dark" ? Colors.white : Colors.text;

  return (
    <Pressable style={styles.item} onPress={onPress}>
      {({ pressed }) => {
        const hasImage = !!item.image;
        const iconColor = hasImage || focused ? Colors.white : pressed ? Colors.primary : inactiveColor;
        const labelColor = hasImage || focused ? Colors.white : inactiveColor;

        return (
          <TabButtonBackground image={item.image} focused={focused} pressed={pressed}>
            <IconComponent
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
