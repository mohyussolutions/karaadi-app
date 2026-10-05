import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NotificationBannerProps } from "../../../../../utils/types";
import { useThemeColors, useThemedStyles } from "../../../../../hooks/app/useTheme";
import { createStyles } from "../../../../../utils/styles/layout/notificationBanner.styles";
import { topOf, translateYOf } from '../../../../../utils/styles/common/dynamic.styles';

export default function NotificationBanner({
  banner,
  translateY,
  onPress,
  onDismiss,
}: NotificationBannerProps) {
  const insets = useSafeAreaInsets();
  const Colors = useThemeColors();
  const b = useThemedStyles(createStyles);
  const initial = (banner.senderName?.[0] ?? "K").toUpperCase();

  return (
    <Animated.View
      style={[b.wrap, topOf(insets.top + 10), translateYOf(translateY)]}
    >
      <TouchableOpacity style={b.card} activeOpacity={0.92} onPress={onPress}>
        <View style={b.avatar}>
          <Text style={b.avatarText}>{initial}</Text>
        </View>
        <View style={b.body}>
          <View style={b.topRow}>
            <Text style={b.name} numberOfLines={1}>
              {banner.senderName}
            </Text>
            <Text style={b.appLabel}>Karaadi</Text>
          </View>
          <Text style={b.preview} numberOfLines={2}>
            {banner.content}
          </Text>
        </View>
        <TouchableOpacity style={b.closeBtn} hitSlop={12} onPress={onDismiss}>
          <MaterialCommunityIcons name="close" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}
