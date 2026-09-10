import { useEffect, useState } from "react";

import { Appearance, Platform, View } from "react-native";

import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import GlobalHeader from "../components/layout/GlobalHeader";
import BottomTabBar from "../navigation/tab-bar/BottomTabBar";
import { EulaModal } from "../components/modals/EulaModal";
import ForceUpdateModal from "../components/modals/ForceUpdateModal";
import StoreUpdateModal from "../components/modals/StoreUpdateModal";
import { IdentityGate } from "../components/features/identification/components/IdentityGate";
import { useIdentityGate } from "../hooks/useIdentityGate";
import { SaveToast } from "../components/shared";
import Hage from "../components/ai-assistant/components/Hage";
import NotificationBanner from "../components/features/notifications/components/NotificationBanner";
import LanguageSync from "../i18n/LanguageSync";
import { useAppInit } from "../hooks/useAppInit";
import { useThemeColors, useThemeMode } from "../hooks/useTheme";
import { useTabBarVisibility } from "../navigation/tab-bar/useTabBarVisibility";
import { useMessageBanner } from "../hooks/useMessageBanner";
import { useSocketMessages } from "../hooks/useSocketMessages";
import { useSocketNotifications } from "../hooks/useSocketNotifications";
import { useNotificationTap } from "../hooks/useNotificationTap";

// Static per-route constants, not measured at runtime: a shared runtime value caused the
// previous screen's content to jump when navigating to a route with a different header.
const DEFAULT_HEADER_CONTENT_HEIGHT = 112;
const AUTH_HEADER_CONTENT_HEIGHT = 60;

export default function RootLayout() {
  const [showEula, setShowEula] = useState(false);
  const insets = useSafeAreaInsets();
  const defaultHeaderPadding = insets.top + DEFAULT_HEADER_CONTENT_HEIGHT;
  const authHeaderPadding = insets.top + AUTH_HEADER_CONTENT_HEIGHT;

  useEffect(() => {
    AsyncStorage.getItem("karaadi_eula_accepted_v1").then((val) => {
      if (!val) setShowEula(true);
    });
  }, []);

  useAppInit();
  const { gateOpen, idCardRequired, selfieRequired, onVerified } = useIdentityGate();
  const {
    messageBanner,
    bannerY,
    showBanner,
    dismissBanner,
    handleBannerPress,
  } = useMessageBanner();
  useSocketMessages(showBanner);
  useSocketNotifications();
  useNotificationTap();

  const { mode, resolved } = useThemeMode();
  const Colors = useThemeColors();
  const pathname = usePathname();
  const showTabBar = useTabBarVisibility(pathname);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(mode);
    }
  }, [mode]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.background);
    if (Platform.OS === "android") {
      NavigationBar.setStyle(resolved === "dark" ? "light" : "dark");
    }
  }, [resolved, Colors.background]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LanguageSync />
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
      <GlobalHeader />
      <Stack
        screenOptions={{
          headerShown: false,
          title: "",
          contentStyle: { backgroundColor: Colors.background, paddingTop: defaultHeaderPadding },
          animation: Platform.OS === "web" ? "none" : "default",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background, paddingTop: authHeaderPadding },
          }}
        />
        <Stack.Screen
          name="profile/chat"
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background, paddingTop: 0 },
          }}
        />
        <Stack.Screen
          name="listing/vehicle/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
            gestureDirection: "vertical",
            contentStyle: { backgroundColor: Colors.background, paddingTop: 0 },
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
            contentStyle: { backgroundColor: Colors.background, paddingTop: 0 },
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
            contentStyle: { backgroundColor: Colors.background, paddingTop: 0 },
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
            contentStyle: { backgroundColor: Colors.background, paddingTop: 0 },
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
            contentStyle: { backgroundColor: Colors.background, paddingTop: 0 },
          }}
        />
        <Stack.Screen
          name="listing/report/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            contentStyle: { backgroundColor: Colors.background, paddingTop: 0 },
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
      {showTabBar && <BottomTabBar />}
      {showTabBar && <Hage />}
      <SaveToast />
      <ForceUpdateModal />
      <StoreUpdateModal />

      <EulaModal
        visible={showEula}
        onAccept={() => {
          AsyncStorage.setItem("karaadi_eula_accepted_v1", "1");
          setShowEula(false);
        }}
      />

      <IdentityGate
        visible={gateOpen}
        idCardRequired={idCardRequired}
        selfieRequired={selfieRequired}
        onVerified={onVerified}
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
