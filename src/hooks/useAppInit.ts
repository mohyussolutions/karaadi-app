import { useEffect } from "react";
import { AppState } from "react-native";
import { useAuthStore } from "../store/hooks/authStore";
import { loadFavorites, clearFavorites } from "../store/slices/favoritesSlice";
import { clearChats } from "../components/features/chat/store/chatsSlice";
import { setUnreadCount } from "../components/features/notifications/store/notificationsSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { registerForPushNotifications } from "../components/features/notifications/services/notificationService";
import { checkAlertsForMatches } from "../actions/categories/subscription.actions";
import { getUnreadNotificationCount } from "../actions/core/notifications.actions";
import { trackVisitor } from "../actions/core/visitor.actions";
import { ALERTS_POLL_INTERVAL_MS } from "../constants/constants";

export function useAppInit() {
  const { loadFromStorage } = useAuthStore();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    loadFromStorage();
    trackVisitor();
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

    let timer: ReturnType<typeof setInterval> | null = null;
    const startPolling = () => {
      if (!timer) timer = setInterval(checkAlertsForMatches, ALERTS_POLL_INTERVAL_MS);
    };
    const stopPolling = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };

    refreshAlerts();
    startPolling();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") { refreshAlerts(); startPolling(); }
      else stopPolling();
    });
    return () => { sub.remove(); stopPolling(); };
  }, [user?.id, dispatch]);
}
