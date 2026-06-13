import { API_BASE_URL, HAGE_ENDPOINTS, SEARCH_ENDPOINTS } from '../../constants';
import { apiClient } from '../client';
import { extractList } from '../../utils/helpers';

export interface HageMessage {
  id: number;
  content: string;
  fromAI: boolean;
  listings?: ListingRef[];
}

export interface ListingRef {
  id: string;
  _id?: string;
  title: string;
  mainCategory?: string;
  category?: string;
  price?: number;
  images?: string[];
}

export interface HageChatResult {
  reply: string;
  listings: ListingRef[];
}

export async function sendHageChat(
  content: string,
  lang: string,
  history: HageMessage[],
): Promise<HageChatResult> {
  const chatHistory = history.map((m) => ({
    role: m.fromAI ? 'assistant' : 'user',
    content: m.content,
  }));

  const [chatRes, searchRes] = await Promise.allSettled([
    fetch(`${API_BASE_URL}${HAGE_ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content, lang, history: chatHistory }),
    }).then((r) => r.json()),
    apiClient.get(SEARCH_ENDPOINTS.GLOBAL, { params: { title: content, limit: 5 } }),
  ]);

  if (chatRes.status === 'rejected') throw new Error('No response');
  const reply: string = chatRes.value.reply ?? '';

  const aiListings: ListingRef[] = Array.isArray(chatRes.value.listings)
    ? chatRes.value.listings.map((l: any) => ({ ...l, id: l.id || l._id }))
    : [];

  const searchListings: ListingRef[] =
    searchRes.status === 'fulfilled'
      ? extractList<ListingRef>(searchRes.value.data)
          .slice(0, 5)
          .map((l: any) => ({ ...l, id: l.id || l._id }))
      : [];

  return { reply, listings: aiListings.length ? aiListings : searchListings };
}
