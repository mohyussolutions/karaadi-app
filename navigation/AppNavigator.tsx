import { useEffect, useState } from "react";
import { Appearance, Platform, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GlobalHeader from "../components/layout/GlobalHeader";
import Hage from "../components/layout/Hage";
import NotificationBanner from "../components/layout/NotificationBanner";
import { LoadingSpinner, SplashScreen } from "../components/loading";
import { SaveToast } from "../components/shared";
import LanguageSync from "../i18n/LanguageSync";

import { useAppInit } from "../hooks/useAppInit";
import { useMessageBanner } from "../hooks/useMessageBanner";
import { useSocketMessages } from "../hooks/useSocketMessages";
import { useNotificationTap } from "../hooks/useNotificationTap";
import { useThemeColors, useThemeMode } from "../hooks/useTheme";

export default function AppNavigator() {
  const [fontsLoaded] = useFonts({ ...MaterialCommunityIcons.font });
  const [showSplash, setShowSplash] = useState(true);

  useAppInit();
  const {
    messageBanner,
    bannerY,
    showBanner,
    dismissBanner,
    handleBannerPress,
  } = useMessageBanner();
  useSocketMessages(showBanner);
  useNotificationTap();

  const { mode, resolved } = useThemeMode();
  const Colors = useThemeColors();

  useEffect(() => {
    Appearance.setColorScheme(mode);
  }, [mode]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.background);
    if (Platform.OS === "android") {
      NavigationBar.setStyle(resolved === "dark" ? "light" : "dark");
    }
  }, [resolved, Colors.background]);

  if (!fontsLoaded) return <LoadingSpinner fullScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LanguageSync />
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
      <GlobalHeader />
      <Stack screenOptions={{ headerShown: false, title: "" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="listing/vehicle/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
            gestureDirection: "vertical",
          }}
        />
        <Stack.Screen
          name="listing/item-detail/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
            gestureDirection: "vertical",
          }}
        />
        <Stack.Screen
          name="listing/real-estate/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
            gestureDirection: "vertical",
          }}
        />
        <Stack.Screen
          name="listing/job/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
            gestureDirection: "vertical",
          }}
        />
        <Stack.Screen
          name="listing/subscription/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
            gestureDirection: "vertical",
          }}
        />
        <Stack.Screen
          name="browse/[category]/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="browse/[category]/[subcategory]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="business/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>
      <Hage />
      <SaveToast />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {messageBanner && (
        <NotificationBanner
          banner={messageBanner}
          translateY={bannerY}
          onPress={handleBannerPress}
          onDismiss={dismissBanner}
        />
      )}
    </View>
  );
}
