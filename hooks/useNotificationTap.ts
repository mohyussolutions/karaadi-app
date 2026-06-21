import { useEffect } from "react";
import { LogBox } from "react-native";
import { useRouter } from "expo-router";
import { getListingDetailRoute } from "../util/helpers/nav.routing";

LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications",
  "`expo-notifications` functionality is not fully supported in Expo Go",
]);

let Notifications: typeof import("expo-notifications") | null = null;
try {
  Notifications = require("expo-notifications");
} catch {}

export function useNotificationTap() {
  const router = useRouter();

  useEffect(() => {
    if (!Notifications?.addNotificationResponseReceivedListener) return;

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        const data = response.notification.request.content.data as Record<string, any>;
        const type = data?.type as string | undefined;

        if (data?.chatId) {
          router.push({
            pathname: "/profile/chat",
            params: {
              chatId: String(data.chatId),
              userId: data.senderId || "",
              username: data.username || "Chat",
            },
          });
          return;
        }

        if (type === "alert_match" || type === "new_listing" || type === "saved_search") {
          if (data?.listingId && data?.category) {
            router.push(
              getListingDetailRoute({ id: data.listingId, category: data.category }) as any,
            );
          } else {
            router.push("/profile/saved-searches");
          }
          return;
        }

        if (type === "subscription" || type === "subscription_expiry") {
          router.push("/profile/subscription");
          return;
        }

        if (type === "message") {
          router.push("/(tabs)/messages");
          return;
        }

        router.push("/profile/notifications");
      },
    );

    return () => sub.remove();
  }, []);
}
