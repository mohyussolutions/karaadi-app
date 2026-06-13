import { useEffect } from "react";
import { AppState } from "react-native";
import { useAuth } from "./useAuth";
import { loadFavorites, clearFavorites } from "../store/slices/favoritesSlice";
import { clearChats } from "../store/slices/chatsSlice";
import { setUnreadCount } from "../store/slices/notificationsSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { registerForPushNotifications } from "../services/notificationService";
import { checkAlertsForMatches } from "../api/categories/subscription.actions";
import { getUnreadNotificationCount } from "../api/core/notifications.actions";

export function useAppInit() {
  const { loadFromStorage } = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(loadFavorites());
      registerForPushNotifications();
    } else {
      dispatch(clearFavorites());
      dispatch(clearChats());
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    const userId = user._id || user.id;

    function refreshAlerts() {
      checkAlertsForMatches();
      getUnreadNotificationCount(userId)
        .then((count) => dispatch(setUnreadCount(count)))
        .catch(() => {});
    }

    refreshAlerts();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshAlerts();
    });
    return () => sub.remove();
  }, [user?.id, dispatch]);
}
