import type { Dispatch, SetStateAction } from 'react';
import type { ListingBase } from '../models/listing.types';

export type SetAd = Dispatch<SetStateAction<ListingBase | null>>;
