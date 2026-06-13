let _activeChatId: number | null = null;
const _userNames: Record<string, string> = {};

export function setActiveChatId(id: number | null): void {
  _activeChatId = id;
}

export function getActiveChatId(): number | null {
  return _activeChatId;
}

export function isViewingChat(chatId: number): boolean {
  return _activeChatId === chatId;
}

export function cacheUserName(userId: string, name: string): void {
  if (userId && name) _userNames[userId] = name;
}

export function getCachedUserName(userId: string): string | null {
  return _userNames[userId] ?? null;
}
