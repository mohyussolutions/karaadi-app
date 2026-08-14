import { useEffect } from "react";
import { LogBox, Platform } from "react-native";
import { useRouter } from "expo-router";
import { getListingDetailRoute } from "../../../../util/helpers/nav.routing";
import type { NotificationTapRouter as Router, NotificationData } from "../../../../util/types/notification.types";

LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications",
  "`expo-notifications` functionality is not fully supported in Expo Go",
]);

let Notifications: typeof import("expo-notifications") | null = null;
try {
  Notifications = require("expo-notifications");
} catch {}

const ROUTES = {
  chat: "/profile/chat",
  wanted: "/profile/wanted",
  subscription: "/profile/subscription",
  messages: "/(tabs)/messages",
  notifications: "/profile/notifications",
} as const;

function getChatId(data: NotificationData) {
  return data?.chatId ?? data?.chat_id ?? data?.conversationId ?? data?.conversation_id;
}

function navigateToChat(router: Router, data: NotificationData, chatId: string) {
  router.push({
    pathname: ROUTES.chat,
    params: {
      chatId: String(chatId),
      userId: data.senderId || "",
      username: data.username || "Chat",
    },
  });
}

function navigateToAlertMatch(router: Router, data: NotificationData) {
  if (data?.listingId && data?.category) {
    router.push(
      getListingDetailRoute({ id: data.listingId, category: data.category }) as any,
    );
  } else {
    router.push(ROUTES.wanted);
  }
}

function handleNotificationData(router: Router, data: NotificationData) {
  const type = data?.type as string | undefined;
  const chatId = getChatId(data);

  if (chatId) {
    navigateToChat(router, data, chatId);
    return;
  }

  if (type === "alert_match" || type === "new_listing" || type === "saved_search") {
    navigateToAlertMatch(router, data);
    return;
  }

  if (type === "subscription" || type === "subscription_expiry") {
    router.push(ROUTES.subscription);
    return;
  }

  if (type === "message") {
    router.push(ROUTES.messages);
    return;
  }

  router.push(ROUTES.notifications);
}

export function useNotificationTap() {
  const router = useRouter();

  useEffect(() => {
    if (!Notifications?.addNotificationResponseReceivedListener) return;

    const handleResponse = (response: any) => {
      const data = response.notification.request.content.data as NotificationData;
      handleNotificationData(router, data);
    };

    if (Platform.OS !== "web") {
      Notifications.getLastNotificationResponseAsync?.().then((response: any) => {
        if (response) handleResponse(response);
      });
    }

    const sub = Notifications.addNotificationResponseReceivedListener(handleResponse);

    return () => sub.remove();
  }, []);
}
