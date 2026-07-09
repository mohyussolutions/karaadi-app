import { useRef, useState } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import { NATIVE_DRIVER } from "../util/animation";
import type { MessageBanner } from "../util/types";

export function useMessageBanner() {
  const router = useRouter();
  const [messageBanner, setMessageBanner] = useState<MessageBanner | null>(null);
  const bannerY = useRef(new Animated.Value(-140)).current;
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showBanner(data: MessageBanner) {
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
  }

  function dismissBanner() {
    Animated.timing(bannerY, {
      toValue: -140,
      duration: 260,
      useNativeDriver: NATIVE_DRIVER,
    }).start(() => setMessageBanner(null));
  }

  function handleBannerPress() {
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
  }

  return { messageBanner, bannerY, showBanner, dismissBanner, handleBannerPress };
}
