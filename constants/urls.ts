export const SITE_URL = 'https://karaadi.ee';

export const getListingShareUrl = (listingId: string) => `${SITE_URL}/listing/${listingId}`;

export const placeholderAvatar = (size: number, bgColor: string, text: string) =>
  `https://placehold.co/${size}x${size}/${bgColor}/ffffff?text=${encodeURIComponent(text)}`;

export const SOCIAL_SHARE_URLS = {
  whatsappApp: (text: string) => `whatsapp://send?text=${encodeURIComponent(text)}`,
  whatsappWeb: (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  facebook: (text: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(text)}`,
} as const;

export const SOCIAL_LINK_BUILDERS = {
  whatsapp: (value: string) => `https://wa.me/${value.replace(/\D/g, '')}`,
  facebook: (value: string) => (value.startsWith('http') ? value : `https://facebook.com/${value}`),
  instagram: (value: string) => (value.startsWith('http') ? value : `https://instagram.com/${value}`),
  website: (value: string) => (value.startsWith('http') ? value : `https://${value}`),
} as const;
