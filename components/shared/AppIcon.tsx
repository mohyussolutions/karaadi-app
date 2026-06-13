import { FontAwesome5 } from "@expo/vector-icons";
import { getNativeIcon } from "../../utils/icons/icons";
import { useThemeColors } from "../../hooks/useTheme";

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function AppIcon({
  name,
  size = 20,
  color,
}: AppIconProps) {
  const Colors = useThemeColors();
  return (
    <FontAwesome5 name={getNativeIcon(name) as any} size={size} color={color ?? Colors.text} />
  );
}
