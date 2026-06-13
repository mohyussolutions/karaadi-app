import { Text, View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { useAuthStore } from "../../store/authStore";
import { useThemeColors, useThemedStyles, useThemeMode } from "../../hooks/useTheme";
import { SPACING } from "../../utils/theme";
import { createLayoutStyles } from "../../utils/styles/tabs/layout.styles";
import { TAB_ITEMS, LOGIN_TAB_ITEM } from "../../constants/tabItems";
import { TabButtonBackground } from "../../navigation/TabButtonBackground";

function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/profile/chat") || pathname.startsWith("/messages")) return "messages";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/new-ad")) return "new-ad";
  if (pathname.startsWith("/businesses") || pathname.startsWith("/business/")) return "businesses";
  return "home";
}

export default function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const active = getActiveTab(pathname);
  const Colors = useThemeColors();
  const { resolved } = useThemeMode();
  const styles = useThemedStyles(createLayoutStyles);

  const items = isAuthenticated
    ? TAB_ITEMS
    : TAB_ITEMS.map((item) => (item.name === "profile" ? LOGIN_TAB_ITEM : item));

  return (
    <View style={styles.wrapper}>
      <BlurView
        intensity={80}
        tint={resolved === "dark" ? "dark" : "light"}
        style={[styles.bar, { paddingBottom: Math.max(insets.bottom, SPACING.xs) }]}
      >
        {items.map((item) => {
          const focused = item.name === active;

          return (
            <Pressable
              key={item.name}
              style={styles.item}
              onPress={() =>
                item.name === "login"
                  ? router.push("/(auth)/login")
                  : router.navigate(`/(tabs)/${item.name}` as any)
              }
            >
              {({ pressed }) => {
                const hasImage = !!item.image;
                const iconColor = hasImage
                  ? Colors.white
                  : focused
                    ? Colors.primary
                    : pressed
                      ? Colors.primary
                      : Colors.textMuted;
                const labelColor = hasImage
                  ? Colors.white
                  : focused
                    ? Colors.primary
                    : Colors.textMuted;

                return (
                  <TabButtonBackground image={item.image} focused={focused} pressed={pressed}>
                    <Ionicons
                      name={(focused ? item.icon : item.iconOutline) as any}
                      size={22}
                      color={iconColor}
                    />
                    <Text style={[styles.label, { color: labelColor }]}>{t(item.labelKey)}</Text>
                  </TabButtonBackground>
                );
              }}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}
