import type { Language } from '../../util/types/navigation.types';

export const AUTH_RE = /\/(login|register|confirm|forgot-password|reset-password)/;
export const CHAT_RE = /^\/profile\/chat/;
export const DETAIL_RE = /^\/listing/;
export const TAB_PATHS = new Set(['/home', '/messages', '/profile', '/new-ad', '/businesses', '/notifications']);

export const LANGS: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'so', label: 'Soomaali' },
];
