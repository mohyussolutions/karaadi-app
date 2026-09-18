import { useMemo } from 'react';
import type { Chat, GroupedChat } from '../util/types';

export function useGroupedChats(chats: Chat[], user: { id: string } | null) {
  return useMemo(() => {
    if (!user) return [];
    const byUser = new Map<string, GroupedChat>();
    for (const item of chats) {
      const other = item.senderId === user.id ? item.receiver : item.sender;
      const key = other?.id ? String(other.id) : `chat-${item.id}`;
      const unread = item._count?.messages ?? 0;
      const existing = byUser.get(key);
      if (existing) {
        existing.allIds.push(item.id);
        existing.unreadTotal += unread;
        if (item.updatedAt && (!existing.updatedAt || new Date(item.updatedAt) > new Date(existing.updatedAt))) {
          existing.updatedAt = item.updatedAt;
          if (item.messages?.[0]) existing.messages = item.messages;
        }
      } else {
        byUser.set(key, { ...item, allIds: [item.id], unreadTotal: unread });
      }
    }
    return [...byUser.values()];
  }, [chats, user]);
}
