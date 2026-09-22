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

// URIs we've already prefetched (or are currently prefetching) this session,
// so we never issue a redundant native prefetch for the same image.
const prefetchedUris = new Set<string>();

// expo-image's native prefetch is not safe to call concurrently: overlapping
// batches cancel/replace each other's underlying SDWebImage/Glide tokens, and
// if a cancelled batch's completion handler fires after the JS runtime has
// already been torn down (Fast Refresh, reload, screen unmount) it crashes
// natively (EXC_BAD_ACCESS / SIGBUS deep in SDWebImagePrefetchToken teardown).
// Serializing every call through this queue guarantees at most one native
// prefetch batch is ever in flight, so our own calls can't race each other.
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
