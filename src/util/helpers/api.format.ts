import { Image } from 'expo-image';
import { API_BASE_URL } from '../../constants';

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path.startsWith('/') ? path.slice(1) : path}`;
}

const PREFETCH_TIMEOUT_MS = 1200;

export function prefetchImages(items: { images?: string[] }[], limit?: number): Promise<void> {
  const list = typeof limit === 'number' ? items.slice(0, limit) : items;
  const uris = list
    .map((item) => getImageUrl(item.images?.[0]))
    .filter((uri): uri is string => !!uri);
  if (uris.length === 0) return Promise.resolve();
  return Image.prefetch(uris, 'memory-disk').catch(() => false).then(() => undefined);
}

export function waitForImages(items: { images?: string[] }[], limit?: number): Promise<void> {
  return Promise.race([
    prefetchImages(items, limit),
    new Promise<void>((resolve) => setTimeout(resolve, PREFETCH_TIMEOUT_MS)),
  ]);
}
