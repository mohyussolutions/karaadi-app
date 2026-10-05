import { Tabs } from "expo-router";
import { useThemeColors } from "../../hooks/app/useTheme";
import { HIDDEN_TAB_SCREENS, TAB_NAMES } from "../../actions/constants";

const TAB_SCREENS = [
  TAB_NAMES.home,
  TAB_NAMES.businesses,
  TAB_NAMES.newAd,
  TAB_NAMES.messages,
  TAB_NAMES.profile,
  TAB_NAMES.notifications,
] as const;

const isHiddenScreen = (name: string) => (HIDDEN_TAB_SCREENS as readonly string[]).includes(name);

export default function TabLayout() {
  const Colors = useThemeColors();

  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.background },
      }}
    >
      {TAB_SCREENS.map((name) => (
        <Tabs.Screen key={name} name={name} options={isHiddenScreen(name) ? { href: null } : undefined} />
      ))}
    </Tabs>
  );
}
