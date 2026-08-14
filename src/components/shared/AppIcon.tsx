import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useTheme";
import type { AppIconProps } from "../../util/types";

export default function AppIcon({
  name,
  size = 20,
  color,
}: AppIconProps) {
  const Colors = useThemeColors();
  return (
    <MaterialCommunityIcons name={name as any} size={size} color={color ?? Colors.text} />
  );
}
