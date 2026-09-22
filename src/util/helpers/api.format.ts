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

const PREFETCH_TIMEOUT_MS = 1200;

const prefetchedUris = new Set<string>();

let prefetchQueue: Promise<void> = Promise.resolve();

function runPrefetch(uris: string[]): Promise<void> {
  const run = () => Image.prefetch(uris, 'memory-disk').then(() => undefined, () => undefined);
  const next = prefetchQueue.then(run, run);
  prefetchQueue = next;
  return next;
}

export function prefetchImages(items: { images?: string[] }[], limit?: number): Promise<void> {
  const list = typeof limit === 'number' ? items.slice(0, limit) : items;
  const uris = list
    .map((item) => getImageUrl(item.images?.[0]))
    .filter((uri): uri is string => !!uri)
    .filter((uri) => !prefetchedUris.has(uri));
  if (uris.length === 0) return Promise.resolve();
  uris.forEach((uri) => prefetchedUris.add(uri));
  return runPrefetch(uris);
}

export function waitForImages(items: { images?: string[] }[], limit?: number): Promise<void> {
  return Promise.race([
    prefetchImages(items, limit),
    new Promise<void>((resolve) => setTimeout(resolve, PREFETCH_TIMEOUT_MS)),
  ]);
}
