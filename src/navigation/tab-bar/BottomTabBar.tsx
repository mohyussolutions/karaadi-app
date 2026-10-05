import { memo, useCallback } from "react";
import { View } from "react-native";
import { useGlobal } from "../../hooks/app/useResponsive";
import { useRouter, usePathname, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/hooks/useAuthStore";
import { useThemedStyles } from "../../hooks/app/useTheme";
import { createLayoutStyles } from "../../utils/styles/tabs/tabBar.styles";
import { ROUTES, TAB_ITEMS, TAB_NAMES, LOGIN_TAB_ITEM } from "../../actions/constants";
import type { TabName } from "../../utils/types";
import { BottomTabItem } from "./BottomTabItem";
import { getActiveTab } from "./getActiveTab";
import {
  edgeInset,
  paddingBottomOf,
} from "../../utils/styles/common/dynamic.styles";

export default memo(function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const { tabBarSide } = useGlobal();
  const router = useRouter();
  const pathname = usePathname();
  const styles = useThemedStyles(createLayoutStyles);
  const active = getActiveTab(pathname);

  const { isAuthenticated } = useAuthStore();
  const items = isAuthenticated
    ? TAB_ITEMS
    : TAB_ITEMS.map((item) =>
        item.name === TAB_NAMES.profile ? LOGIN_TAB_ITEM : item,
      );

  const handlePress = useCallback(
    (name: TabName) => {
      if (name === TAB_NAMES.login) router.push(ROUTES.login);
      else router.navigate(`${ROUTES.tabsRoot}/${name}` as Href);
    },
    [router],
  );

  const side = tabBarSide();

  return (
    <View
      style={[styles.wrapper, paddingBottomOf(insets.bottom), edgeInset(side)]}
    >
      <View style={styles.bar}>
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
