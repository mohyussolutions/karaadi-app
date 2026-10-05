export interface UseChatConversationArgs {
  chatIdParam?: string;
  userId?: string;
  username?: string;
  listingId?: string;
  listingType?: string;
}

export type ChatPeer = Pick<UseChatConversationArgs, 'userId' | 'listingId' | 'listingType'>;
