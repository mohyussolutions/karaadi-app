import { useEffect } from "react";
import { LogBox } from "react-native";
import { useRouter } from "expo-router";

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
        const data = response.notification.request.content.data as any;
        if (data?.chatId) {
          router.push({
            pathname: "/profile/chat",
            params: {
              chatId: String(data.chatId),
              userId: data.senderId || "",
              username: data.username || "Chat",
            },
          });
        } else {
          router.push("/(tabs)/messages");
        }
      },
    );
    return () => sub.remove();
  }, []);
}
