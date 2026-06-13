import { API_BASE_URL } from '../../constants';

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path.startsWith('/') ? path.slice(1) : path}`;
}
