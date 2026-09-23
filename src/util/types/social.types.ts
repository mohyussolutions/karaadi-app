export interface SocialStatus {
  facebook: boolean;
  tiktok: boolean;
}

interface SocialPostResult {
  success: boolean;
  error?: string;
  postId?: string;
}

export interface SocialPostResults {
  facebook?: SocialPostResult;
  tiktok?: SocialPostResult;
}

export interface SocialPostUpdatePayload {
  title: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  imageUrls?: string[];
  listingUrl: string;
  listingId?: string;
  platforms?: { facebook?: boolean; tiktok?: boolean };
  paymentId?: string;
}

export interface SocialPostUpdateResponse {
  results: SocialPostResults;
}
