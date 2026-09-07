import { useCallback, useRef, useState } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import { NATIVE_DRIVER } from "../util/helpers/animation";
import type { MessageBanner } from "../util/types";

export function useMessageBanner() {
  const router = useRouter();
  const [messageBanner, setMessageBanner] = useState<MessageBanner | null>(null);
  const bannerY = useRef(new Animated.Value(-140)).current;
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissBanner = useCallback(() => {
    Animated.timing(bannerY, {
      toValue: -140,
      duration: 260,
      useNativeDriver: NATIVE_DRIVER,
    }).start(() => setMessageBanner(null));
  }, [bannerY]);

  const showBanner = useCallback((data: MessageBanner) => {
    setMessageBanner(data);
    bannerY.setValue(-140);
    Animated.spring(bannerY, {
      toValue: 0,
      tension: 65,
      friction: 10,
      useNativeDriver: NATIVE_DRIVER,
    }).start();
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => dismissBanner(), 5000);
  }, [bannerY, dismissBanner]);

  const handleBannerPress = useCallback(() => {
    const banner = messageBanner;
    dismissBanner();
    setTimeout(() => {
      if (banner?.chatId && banner.senderId) {
        router.push({
          pathname: "/profile/chat",
          params: {
            chatId: String(banner.chatId),
            userId: banner.senderId,
            username: banner.senderName,
          },
        });
      } else {
        router.push("/(tabs)/messages");
      }
    }, 100);
  }, [messageBanner, dismissBanner, router]);

  return { messageBanner, bannerY, showBanner, dismissBanner, handleBannerPress };
}
