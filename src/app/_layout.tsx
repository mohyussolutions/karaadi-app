import { useEffect, useState } from "react";

import { Appearance, Platform, View } from "react-native";

import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import GlobalHeader from "../components/layout/GlobalHeader/GlobalHeader";
import BottomTabBar from "../navigation/tab-bar/BottomTabBar";
import { EulaModal } from "../components/modals/EulaModal/EulaModal";
import ForceUpdateModal from "../components/modals/ForceUpdateModal/ForceUpdateModal";
import StoreUpdateModal from "../components/modals/StoreUpdateModal/StoreUpdateModal";
import { IdentityGate } from "../components/modals/IdentityGate/IdentityGate";
import { useIdentityGate } from "../hooks/useIdentityGate";
import { SaveToast } from "../components/shared";
import Hage from "../components/ai-assistant/components/Hage/Hage";
import NotificationBanner from "../components/features/notifications/components/NotificationBanner/NotificationBanner";
import LanguageSync from "../i18n/LanguageSync";
import { useAppInit } from "../hooks/useAppInit";
import { useThemeColors, useThemeMode } from "../hooks/useTheme";
import { useTabBarVisibility } from "../navigation/tab-bar/useTabBarVisibility";
import { ROOT_STACK_SCREENS } from "../navigation/config/rootStackScreens";
import { useMessageBanner } from "../hooks/useMessageBanner";
import { useSocketMessages } from "../hooks/useSocketMessages";
import { useSocketNotifications } from "../hooks/useSocketNotifications";
import { useNotificationTap } from "../hooks/useNotificationTap";

const DEFAULT_HEADER_CONTENT_HEIGHT = 104;
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
        {ROOT_STACK_SCREENS.map(({ name, options, contentPadding }) => (
          <Stack.Screen
            key={name}
            name={name}
            options={
              contentPadding
                ? {
                    ...options,
                    contentStyle: {
                      backgroundColor: Colors.background,
                      paddingTop: contentPadding === "auth" ? authHeaderPadding : 0,
                    },
                  }
                : options
            }
          />
        ))}
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
