import type { CreatedItemSummary } from '../models/newAd.types';
import type { HageMessage } from '../models/hage.types';
import type { ListingBase } from '../models/listing.types';

export interface LoginArgs {
  email: string;
  password: string;
}


export interface ToggleFavoriteArgs {
  itemId: string;
  wasFav: boolean;
  listing?: ListingBase | null;
  categoryHint?: string;
}


export interface SendHageMessageArgs {
  content: string;
  lang: string;
  history: HageMessage[];
}


export interface SubmitListingArgs {
  categoryKey: string;
  body: Record<string, unknown>;
  summary?: CreatedItemSummary;
}
