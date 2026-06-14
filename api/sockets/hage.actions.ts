import { API_BASE_URL, HAGE_ENDPOINTS, SEARCH_ENDPOINTS } from '../../constants';
import { apiClient } from '../client';
import { extractList } from '../../util/helpers';
import type {
  HageMessage,
  ListingRef,
  HageChatResult,
  HageChatApiResponse,
  RawListingRef,
} from '../../util/types/hage.types';

function toListingRef(listing: RawListingRef): ListingRef {
  return { ...listing, id: listing.id || listing._id || '' };
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
    }).then((r) => r.json() as Promise<HageChatApiResponse>),
    apiClient.get<unknown>(SEARCH_ENDPOINTS.GLOBAL, { params: { title: content, limit: 5 } }),
  ]);

  if (chatRes.status === 'rejected') throw new Error('No response');
  const reply = chatRes.value.reply ?? '';

  const aiListings: ListingRef[] = Array.isArray(chatRes.value.listings)
    ? chatRes.value.listings.map(toListingRef)
    : [];

  const searchListings: ListingRef[] =
    searchRes.status === 'fulfilled'
      ? extractList<RawListingRef>(searchRes.value.data).slice(0, 5).map(toListingRef)
      : [];

  return { reply, listings: aiListings.length ? aiListings : searchListings };
}
