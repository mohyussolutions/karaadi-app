import { memo, useCallback } from "react";
import { View, Platform } from "react-native";
import { useGlobal } from "../../hooks/useGlobal";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { useThemedStyles, useThemeMode } from "../../hooks/useTheme";
import { createLayoutStyles, GLASS_DARK, GLASS_LIGHT } from "../../util/styles/tabs/layout.styles";
import { TAB_ITEMS, LOGIN_TAB_ITEM } from "../../config/navigation/tabItems";
import { BottomTabItem } from "./BottomTabItem";
import { getActiveTab } from "./BottomTabBar.utils";

export default memo(function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const { tabBarSide, rawWidth } = useGlobal();
  const router = useRouter();
  const pathname = usePathname();
  const styles = useThemedStyles(createLayoutStyles);
  const { mode } = useThemeMode();

  const active = getActiveTab(pathname);
  const glassOverride = mode === "dark" ? GLASS_DARK : GLASS_LIGHT;

  const { isAuthenticated } = useAuthStore();
  const items = isAuthenticated
    ? TAB_ITEMS
    : TAB_ITEMS.map((item) =>
        item.name === "profile" ? LOGIN_TAB_ITEM : item,
      );

  const handlePress = useCallback((name: string) => {
    if (name === "login") router.push("/(auth)/login");
    else router.navigate(`/(tabs)/${name}` as any);
  }, [router]);

  const WEB_BAR_MAX_WIDTH = 460;
  const side = Platform.OS === "web"
    ? Math.max(tabBarSide(), (rawWidth - WEB_BAR_MAX_WIDTH) / 2)
    : tabBarSide();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom, left: side, right: side }]}>
      <View style={[styles.glass, glassOverride]}>
        {items.map((item) => (
          <BottomTabItem
            key={item.name}
            item={item}
            focused={item.name === active}
            onPress={() => handlePress(item.name)}
          />
        ))}
      </View>
    </View>
  );
});
