import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "../../../hooks/app/useTheme";
import type { IconName, ThemedIconProps } from "../../../utils/types";

export default function ThemedIcon({ name, size = 20, color }: ThemedIconProps) {
  const Colors = useThemeColors();
  return (
    <MaterialCommunityIcons
      name={name as IconName}
      size={size}
      color={color ?? Colors.text}
    />
  );
}
