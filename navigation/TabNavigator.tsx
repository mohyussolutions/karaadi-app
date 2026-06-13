import { Tabs } from "expo-router";
import BottomTabBar from "../components/layout/BottomTabBar";
import { useThemeColors } from "../hooks/useTheme";

export default function TabNavigator() {
  const Colors = useThemeColors();

  return (
    <Tabs
      tabBar={() => <BottomTabBar />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.background },
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="businesses" />
      <Tabs.Screen name="new-ad" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}
