import { getListingDetailRoute, type ListingRoute } from '../../../util/helpers/nav.routing';

const MD_LINK = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

export interface HageReplySegment {
  text: string;
  route?: ListingRoute;
}

function routeFromUrl(url: string): ListingRoute | null {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return null;
  }

  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return null;

  const id = parts[parts.length - 1];
  let category = 'marketplace';
  if (parts[0] === 'vehicles' && parts[1]) {
    category = parts[1].toLowerCase();
  } else if (parts[0] === 'real-estate') {
    category = 'real-estate';
  } else if (parts[0] === 'jobs') {
    category = 'jobs';
  }

  return getListingDetailRoute({ id, category });
}

export function parseHageReply(content: string): HageReplySegment[] {
  const segments: HageReplySegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(MD_LINK)) {
    const [full, label, url] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ text: content.slice(lastIndex, index) });
    segments.push({ text: label, route: routeFromUrl(url) ?? undefined });
    lastIndex = index + full.length;
  }

  if (lastIndex < content.length) segments.push({ text: content.slice(lastIndex) });
  return segments;
}
