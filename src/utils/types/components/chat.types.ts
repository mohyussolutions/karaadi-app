import type { ChatMessage, GroupedChat } from '../models/chat.types';

export interface MessageBubbleProps {
  item: ChatMessage;
  isMe: boolean;
}

export interface ChatHeaderProps {
  username?: string;
  userId?: string;
  onBack: () => void;
  onBlockPress: () => void;
}

export interface ChatComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sending: boolean;
}

export interface ConvoItemProps {
  item: GroupedChat;
  currentUserId: string;
  onPress: (item: GroupedChat) => void;
}
