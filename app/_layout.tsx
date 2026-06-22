import { useEffect, useState } from "react";
import { Appearance, Platform, View } from "react-native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalHeader from "../components/layout/GlobalHeader";
import BottomTabBar from "../components/layout/BottomTabBar";
import Hage from "../features/ai-assistant";
import { EulaModal } from "../components/modals/EulaModal";
import NotificationBanner from "../components/layout/NotificationBanner";
import { LoadingSpinner, SplashScreen } from "../components/loading";
import { SaveToast } from "../components/shared";
import LanguageSync from "../i18n/LanguageSync";

import { useAppInit } from "../hooks/useAppInit";
import { useMessageBanner } from "../hooks/useMessageBanner";
import { useSocketMessages } from "../hooks/useSocketMessages";
import { useNotificationTap } from "../hooks/useNotificationTap";
import { useThemeColors, useThemeMode } from "../hooks/useTheme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ...MaterialCommunityIcons.font });
  const [showSplash, setShowSplash] = useState(true);
  const [showEula, setShowEula] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('karaadi_eula_accepted_v1').then((val) => {
      if (!val) setShowEula(true);
    });
  }, []);

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
  const pathname = usePathname();
  const showTabBar = !pathname.startsWith("/(auth)");

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
          name="listing/report/[id]"
          options={{ headerShown: false, presentation: "card" }}
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
      {showTabBar && <BottomTabBar />}
      <Hage />
      <SaveToast />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <EulaModal
        visible={showEula}
        onAccept={() => {
          AsyncStorage.setItem('karaadi_eula_accepted_v1', '1');
          setShowEula(false);
        }}
      />

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
