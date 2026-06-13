import { FontAwesome5 } from "@expo/vector-icons";
import { getNativeIcon } from "../../utils/icons/icons";

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function AppIcon({
  name,
  size = 20,
  color = "#000",
}: AppIconProps) {
  return (
    <FontAwesome5 name={getNativeIcon(name) as any} size={size} color={color} />
  );
}
