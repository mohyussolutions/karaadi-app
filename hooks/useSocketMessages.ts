import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addNotification } from "../store/slices/notificationsSlice";
import { getSocket } from "../api/sockets/socket.actions";
import { scheduleLocalNotification } from "../services/notificationService";
import { playNotificationSound } from "../services/soundService";
import { isViewingChat, getCachedUserName } from "../services/chatState";
import type { MessageBanner } from "../utils/types";

export function useSocketMessages(showBanner: (data: MessageBanner) => void) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    function attach() {
      const socket = getSocket();
      if (!socket) return;

      function handleNewMessage(msg: any) {
        const me = userRef.current;
        if (!msg || !me || msg.senderId === me.id) return;

        const chatId: number = msg.chatId;
        const alreadyViewing = chatId && isViewingChat(chatId);

        const senderName =
          msg.senderName ||
          msg.sender?.username ||
          getCachedUserName(msg.senderId) ||
          "Someone";
        const content = msg.content || "Sent you a message";
        const notifTitle = `New message from ${senderName}`;

        if (!alreadyViewing) {
          showBanner({ senderName, content, chatId, senderId: msg.senderId });
          playNotificationSound();
          scheduleLocalNotification(notifTitle, content, {
            chatId,
            senderId: msg.senderId,
            username: senderName,
          });
        }

        dispatch(
          addNotification({
            _id: String(msg.id || Date.now()),
            userId: me.id,
            title: notifTitle,
            body: content,
            type: "message",
            read: false,
            data: { chatId, senderId: msg.senderId },
            createdAt: new Date().toISOString(),
          }),
        );
      }

      socket.off("newMessage", handleNewMessage);
      socket.off("receiveMessage", handleNewMessage);
      socket.on("newMessage", handleNewMessage);
      socket.on("receiveMessage", handleNewMessage);

      socket.on("connect", () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("receiveMessage", handleNewMessage);
        socket.on("newMessage", handleNewMessage);
        socket.on("receiveMessage", handleNewMessage);
      });
    }

    attach();
    const t = setTimeout(attach, 800);
    return () => clearTimeout(t);
  }, [user?.id, dispatch]);
}
