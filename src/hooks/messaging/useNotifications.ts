import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LogBox, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { MESSAGE_DEDUPE_MAX, NATIVE_DRIVER, ROUTES, USE_NOTIFICATION_TAP_ROUTES } from '../../actions/constants';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../actions/core/notifications.actions';
import { getSocket } from '../../actions/sockets/socket.actions';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getCachedUserName, isViewingChat } from '../../components/features/chat/services/chatState';
import { scheduleLocalNotification } from '../../components/features/notifications/services/notificationService';
import { playNotificationSound } from '../../components/features/notifications/services/soundService';
import { addNotification, clearNotifications, markAllRead, markAllRead as markAllReadAction, markOneRead, markOneRead as markOneReadAction, mergeServerNotifications, removeNotification, selectNotificationItems } from '../../store/slices/notificationsSlice';
import { getListingDetailRoute } from '../../lib/helpers/listing/nav.routing';

import type { AppDispatch, AppRouter, AppSocket, ChatMessage, IdentifiedUserRef, IncomingMessage, IncomingMessageHandler, MessageBanner, MessageBannerCallback, Notification, NotificationData, NotificationEvent, NotificationTapRouter as Router, NotificationsModule, RouterHref, SocketNotificationMessage, SocketNotificationPayload, TimeoutHandle, VoidCallback, WrappedChatMessage } from '../../utils/types';
import type { NotificationResponse } from 'expo-notifications';

import { selectUser } from '../../store/slices/authSlice';
export const useNotificationsData = () => {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const uid = user?._id || user?.id;
  const notifications = useAppSelector(selectNotificationItems);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    (signal?: AbortSignal) => {
      if (!uid) {
        setLoading(false);
        return;
      }
      getNotifications(uid, signal)
        .then((data) => dispatch(mergeServerNotifications(data)))
        .catch(() => {})
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    },
    [uid, dispatch],
  );

  useEffect(() => {
    const abortController = new AbortController();
    load(abortController.signal);
    return () => abortController.abort();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const markAllRead = useCallback(async () => {
    if (!uid) return;
    dispatch(markAllReadAction());
    await markAllNotificationsRead(uid).catch(() => {});
  }, [uid, dispatch]);

  const markOneRead = useCallback(
    async (id: string) => {
      const target = notifications.find((n) => n._id === id);
      dispatch(markOneReadAction(id));
      if (target && !target.local) await markNotificationRead(id).catch(() => {});
    },
    [notifications, dispatch],
  );

  return { user, notifications, loading, refreshing, onRefresh, markAllRead, markOneRead };
};

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
]);

let Notifications: NotificationsModule | null = null;

try {
  Notifications = require('expo-notifications');
} catch {}

const getChatId = (data: NotificationData) =>
  data?.chatId ?? data?.chat_id ?? data?.conversationId ?? data?.conversation_id;

const navigateToChat = (router: Router, data: NotificationData, chatId: string | number) => {
  router.push({
    pathname: USE_NOTIFICATION_TAP_ROUTES.chat,
    params: {
      chatId: String(chatId),
      userId: data.senderId || '',
      username: data.username || 'Chat',
    },
  });
};

const navigateToAlertMatch = (router: Router, data: NotificationData) => {
  if (data?.listingId && data?.category) {
    router.push(
      getListingDetailRoute({ id: data.listingId, category: data.category }) as RouterHref,
    );
  } else {
    router.push(USE_NOTIFICATION_TAP_ROUTES.wanted);
  }
};

export const handleNotificationData = (router: Router, data: NotificationData) => {
  const type = data?.type;
  const chatId = getChatId(data);

  if (chatId) {
    navigateToChat(router, data, chatId);
    return;
  }

  if (type === 'alert_match' || type === 'new_listing' || type === 'saved_search') {
    navigateToAlertMatch(router, data);
    return;
  }

  if (type === 'subscription' || type === 'subscription_expiry') {
    router.push(USE_NOTIFICATION_TAP_ROUTES.subscription);
    return;
  }

  if (type === 'message') {
    router.push(USE_NOTIFICATION_TAP_ROUTES.messages);
    return;
  }

  router.push(USE_NOTIFICATION_TAP_ROUTES.notifications);
};

export const useNotificationTap = () => {
  const router = useRouter();

  useEffect(() => {
    if (!Notifications?.addNotificationResponseReceivedListener) return;

    const handleResponse = (response: NotificationResponse) => {
      const data = response.notification.request.content.data as NotificationData;
      handleNotificationData(router, data);
    };

    if (Platform.OS !== 'web') {
      Notifications.getLastNotificationResponseAsync?.().then((response) => {
        if (response) handleResponse(response);
      });
    }

    const sub = Notifications.addNotificationResponseReceivedListener(handleResponse);

    return () => sub.remove();
  }, []);
};

export const useUnreadCount = (notifications: Notification[]) =>
  useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

const BANNER_HIDDEN_Y = -140;

const slideBannerIn = (bannerY: Animated.Value) => {
  bannerY.setValue(BANNER_HIDDEN_Y);
  Animated.spring(bannerY, { toValue: 0, tension: 65, friction: 10, useNativeDriver: NATIVE_DRIVER }).start();
};

const slideBannerOut = (bannerY: Animated.Value, onDone: VoidCallback) => {
  Animated.timing(bannerY, { toValue: BANNER_HIDDEN_Y, duration: 260, useNativeDriver: NATIVE_DRIVER }).start(onDone);
};

const openBannerTarget = (router: AppRouter, banner: MessageBanner | null) => {
  if (banner?.chatId && banner.senderId) {
    router.push({
      pathname: ROUTES.chat,
      params: { chatId: String(banner.chatId), userId: banner.senderId, username: banner.senderName },
    });
  } else {
    router.push(ROUTES.messages);
  }
};

export const useMessageBanner = () => {
  const router = useRouter();
  const [messageBanner, setMessageBanner] = useState<MessageBanner | null>(null);
  const bannerY = useRef(new Animated.Value(BANNER_HIDDEN_Y)).current;
  const bannerTimer = useRef<TimeoutHandle | null>(null);

  const dismissBanner = useCallback(() => {
    slideBannerOut(bannerY, () => setMessageBanner(null));
  }, [bannerY]);

  const showBanner = useCallback(
    (data: MessageBanner) => {
      setMessageBanner(data);
      slideBannerIn(bannerY);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
      bannerTimer.current = setTimeout(() => dismissBanner(), 5000);
    },
    [bannerY, dismissBanner],
  );

  const handleBannerPress = useCallback(() => {
    const banner = messageBanner;
    dismissBanner();
    setTimeout(() => openBannerTarget(router, banner), 100);
  }, [messageBanner, dismissBanner, router]);

  return { messageBanner, bannerY, showBanner, dismissBanner, handleBannerPress };
};

const handledIds = new Set<string>();

const unwrapMessage = (payload: IncomingMessage | null | undefined): ChatMessage | null => {
  if (!payload) return null;
  const wrapped = payload as WrappedChatMessage;
  const inner = wrapped.message ?? (payload as ChatMessage);
  if (!inner) return null;
  return { ...inner, chatId: inner.chatId ?? (wrapped.chatId as number) };
};

const alreadyHandled = (id: string | number | undefined): boolean => {
  if (id === undefined || id === null) return false;
  const key = String(id);
  if (handledIds.has(key)) return true;
  handledIds.add(key);
  if (handledIds.size > MESSAGE_DEDUPE_MAX) {
    handledIds.delete(handledIds.values().next().value as string);
  }
  return false;
};

const describeMessage = (msg: ChatMessage) => {
  const senderName = msg.senderName || msg.sender?.username || getCachedUserName(msg.senderId) || 'Someone';
  const content = msg.content || 'Sent you a message';
  return { senderName, content, title: `New message from ${senderName}` };
};

const toMessageNotification = (msg: ChatMessage, userId: string, title: string, body: string, read: boolean) => ({
  _id: String(msg.id || Date.now()),
  userId,
  title,
  body,
  type: 'message',
  read,
  data: { chatId: msg.chatId, senderId: msg.senderId },
  createdAt: new Date().toISOString(),
  local: true,
});

const bindMessageHandler = (socket: AppSocket, handler: IncomingMessageHandler) => {
  socket.off('newMessage', handler);
  socket.off('receiveMessage', handler);
  socket.on('newMessage', handler);
  socket.on('receiveMessage', handler);
};

const createMessageHandler =
  (
    userRef: IdentifiedUserRef,
    showBanner: MessageBannerCallback,
    dispatch: AppDispatch,
  ) =>
  (payload: IncomingMessage) => {
    const msg = unwrapMessage(payload);
    const me = userRef.current;
    if (!msg || !me || msg.senderId === me.id) return;
    if (alreadyHandled(msg.id)) return;

    const chatId = msg.chatId;
    const alreadyViewing = chatId && isViewingChat(chatId);
    const { senderName, content, title } = describeMessage(msg);

    if (!alreadyViewing) {
      showBanner({ senderName, content, chatId, senderId: msg.senderId });
      playNotificationSound();
      scheduleLocalNotification(title, content, { chatId, senderId: msg.senderId, username: senderName });
    }
    dispatch(addNotification(toMessageNotification(msg, me.id, title, content, !!alreadyViewing)));
  };

export const useSocketMessages = (showBanner: MessageBannerCallback) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const attach = () => {
      const socket = getSocket();
      if (!socket) return;
      const handleNewMessage = createMessageHandler(userRef, showBanner, dispatch);
      bindMessageHandler(socket, handleNewMessage);
      socket.on('connect', () => bindMessageHandler(socket, handleNewMessage));
    };

    attach();
    const t = setTimeout(attach, 800);
    return () => clearTimeout(t);
  }, [user?.id, dispatch]);
};

const toNotification = (userId: string, type: string, data: SocketNotificationPayload) => ({
  _id: String(data?.id ?? Date.now()),
  userId,
  title: data?.title ?? 'Karaadi',
  body: data?.message ?? data?.body ?? 'You have a new notification',
  type: data?.category ?? type,
  read: Boolean(data?.isRead),
  data: data?.itemId
    ? { type: 'alert_match', listingId: data.itemId, category: data.itemType }
    : data?.link
      ? { link: data.link }
      : undefined,
  createdAt: data?.createdAt ?? new Date().toISOString(),
});

const isForCurrentUser = (payload: SocketNotificationPayload, userId: string): boolean => {
  const owner = payload?.userId ?? payload?.targetUserId ?? payload?.ownerId ?? payload?.recipientId;
  return owner == null || String(owner) === String(userId);
};

const scheduleAlertMatch = (item: SocketNotificationPayload) => {
  if (!item?.itemId) return;
  scheduleLocalNotification(item.title ?? 'New match for your alert!', item.message ?? item.body ?? '', {
    type: 'alert_match',
    listingId: item.itemId,
    category: item.itemType,
  });
};

const createNotificationEvents = (userId: string, dispatch: AppDispatch): NotificationEvent[] => {
  const handleOne = (type: string) => (payload: SocketNotificationPayload) => {
    if (!isForCurrentUser(payload, userId)) return;
    playNotificationSound();
    dispatch(addNotification(toNotification(userId, type, payload)));
  };

  const handleMany = (type: string) => (payload: SocketNotificationMessage) => {
    const list = (Array.isArray(payload) ? payload : [payload]).filter((item) => isForCurrentUser(item, userId));
    if (list.length === 0) return;
    playNotificationSound();
    list.forEach((item) => {
      dispatch(addNotification(toNotification(userId, type, item)));
      scheduleAlertMatch(item);
    });
  };

  return [
    ['newNotification', handleOne('notification')],
    ['newNotifications', handleMany('subscription_alert')],
    ['subscription_match', handleOne('subscription_match')],
    ['wanted_match', handleOne('wanted_match')],
    ['i_have_this', handleOne('i_have_this')],
    ['notification', handleOne('notification')],
    [
      'notificationRead',
      (payload) => {
        if (payload?.notificationId) dispatch(markOneRead(payload.notificationId));
      },
    ],
    ['allNotificationsRead', () => dispatch(markAllRead())],
    [
      'notificationDeleted',
      (payload) => {
        if (payload?.notificationId) dispatch(removeNotification(payload.notificationId));
      },
    ],
    ['allNotificationsDeleted', () => dispatch(clearNotifications())],
  ];
};

export const useSocketNotifications = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!user?.id) return;

    const attach = () => {
      const socket = getSocket();
      if (!socket) return;
      const events = createNotificationEvents(user!.id, dispatch);

      const bind = () => {
        events.forEach(([event, handler]) => {
          socket!.off(event, handler);
          socket!.on(event, handler);
        });
      };

      bind();
      socket.on('connect', bind);
    };

    attach();
    const t = setTimeout(attach, 800);
    return () => clearTimeout(t);
  }, [user?.id, dispatch]);
};
