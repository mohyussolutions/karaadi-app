import { useEffect, useState } from "react";

import { Appearance, Platform, View } from "react-native";

import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";

import AsyncStorage from "@react-native-async-storage/async-storage";

import GlobalHeader from "../components/layout/GlobalHeader";
import BottomTabBar from "../navigation/BottomTabBar";
import { EulaModal } from "../components/modals/EulaModal";
import ForceUpdateModal from "../components/modals/ForceUpdateModal";
import StoreUpdateModal from "../components/modals/StoreUpdateModal";
import { IdentityGate } from "../components/features/identification/components/IdentityGate";
import { useIdentityGate } from "../components/features/identification/hooks/useIdentityGate";
import { SaveToast } from "../components/shared";
import Hage from "../components/ai-assistant";
import NotificationBanner from "../components/features/notifications/components/NotificationBanner";
import LanguageSync from "../i18n/LanguageSync";
import { useAppInit } from "../components/hooks/useAppInit";
import { useThemeColors, useThemeMode } from "../components/hooks/useTheme";
import { useTabBarVisibility } from "../navigation/useTabBarVisibility";
import { useMessageBanner } from "../components/features/chat/hooks/useMessageBanner";
import { useSocketMessages } from "../components/features/chat/hooks/useSocketMessages";
import { useSocketNotifications } from "../components/features/notifications/hooks/useSocketNotifications";
import { useNotificationTap } from "../components/features/notifications/hooks/useNotificationTap";

export default function RootLayout() {
  const [showEula, setShowEula] = useState(false);

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
          contentStyle: { backgroundColor: Colors.background },
          animation: Platform.OS === "web" ? "none" : "default",
        }}
      >
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
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
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
      <Hage />
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
