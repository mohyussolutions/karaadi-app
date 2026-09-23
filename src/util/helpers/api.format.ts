import { Image } from 'expo-image';
import { API_BASE_URL } from '../../api/urls';
import type { ApiError } from '../types/generic.types';

export function getApiErrorMessage(err: unknown): string | undefined {
  if (!(err instanceof Error) || !('response' in err)) return undefined;
  const data = (err as ApiError).response?.data as { message?: string; error?: string } | undefined;
  return data?.message ?? data?.error;
}

export function isAbortError(err: unknown): boolean {
  const name = (err as { name?: string })?.name;
  const message = (err as { message?: string })?.message ?? '';
  return name === 'AbortError' || /cancel|abort/i.test(message);
}

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path.startsWith('/') ? path.slice(1) : path}`;
}


const prefetchedUris = new Set<string>();

let prefetchQueue: Promise<void> = Promise.resolve();

function runPrefetch(uris: string[]): Promise<void> {
  const run = () => Image.prefetch(uris, 'memory-disk').then(() => undefined, () => undefined);
  const next = prefetchQueue.then(run, run);
  prefetchQueue = next;
  return next;
}

function limitItems<T>(items: T[], limit?: number): T[] {
  return typeof limit === 'number' ? items.slice(0, limit) : items;
}

function collectUncachedImageUris(items: { images?: string[] }[], limit?: number): string[] {
  return limitItems(items, limit)
    .map((item) => getImageUrl(item.images?.[0]))
    .filter((uri): uri is string => !!uri)
    .filter((uri) => !prefetchedUris.has(uri));
}

export function prefetchImages(items: { images?: string[] }[], limit?: number): Promise<void> {
  const imageUris = collectUncachedImageUris(items, limit);
  if (imageUris.length === 0) return Promise.resolve();
  imageUris.forEach((uri) => prefetchedUris.add(uri));
  return runPrefetch(imageUris);
}
