import { Tabs } from "expo-router";
import { useThemeColors } from "../../hooks/useTheme";

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
      <Tabs.Screen name="home" />
      <Tabs.Screen name="businesses" />
      <Tabs.Screen name="new-ad" options={{ href: null }} />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}
