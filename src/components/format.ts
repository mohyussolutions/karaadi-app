import { API_BASE_URL } from '../constants/endpoints';

const API_BASE = API_BASE_URL;

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/${path.startsWith('/') ? path.slice(1) : path}`;
}

export function formatPrice(price: number, currency = '$'): string {
  if (!price && price !== 0) return '';
  return `${currency}${price.toLocaleString()}`;
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return '';
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return '';
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
