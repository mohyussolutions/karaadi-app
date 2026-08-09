import { Image } from 'react-native';
import { API_BASE_URL } from '../../constants';

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path.startsWith('/') ? path.slice(1) : path}`;
}

const PREFETCH_TIMEOUT_MS = 700;

export function prefetchImages(items: { images?: string[] }[], limit?: number): Promise<void> {
  const list = typeof limit === 'number' ? items.slice(0, limit) : items;
  const promises = list
    .map((item) => getImageUrl(item.images?.[0]))
    .filter((uri): uri is string => !!uri)
    .map((uri) => Image.prefetch(uri).catch(() => {}));
  return Promise.all(promises).then(() => undefined);
}

// Waits for thumbnails to finish downloading (capped) so cards mount with images
// already loaded instead of the image popping in after the card's text/price.
export function waitForImages(items: { images?: string[] }[], limit?: number): Promise<void> {
  return Promise.race([
    prefetchImages(items, limit),
    new Promise<void>((resolve) => setTimeout(resolve, PREFETCH_TIMEOUT_MS)),
  ]);
}
