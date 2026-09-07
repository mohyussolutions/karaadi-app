import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';
import { VISITOR_ENDPOINTS } from '../../api/endpoints';

const VISITOR_ID_KEY = 'karaadi_visitor_id_v1';

function generateVisitorId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getOrCreateVisitorId(): Promise<string> {
  const existing = await AsyncStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;
  const id = generateVisitorId();
  await AsyncStorage.setItem(VISITOR_ID_KEY, id);
  return id;
}

export async function trackVisitor(): Promise<void> {
  try {
    const visitorId = await getOrCreateVisitorId();
    await apiClient.post(VISITOR_ENDPOINTS.TRACK, { visitorId });
  } catch {}
}
