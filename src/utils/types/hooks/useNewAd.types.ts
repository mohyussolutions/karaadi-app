import type { TFn } from '../app/i18n.types';
import type { WantedAlertFormProps } from '../components/newAd.types';
import type { FieldDef, ListingType } from '../models/newAd.types';
import type { User } from '../models/user.types';

export type UseWantedAlertFormArgs = Omit<WantedAlertFormProps, 'visible'>;

export interface UseSubmitListingArgs {
  categoryKey: string;
  listingType: ListingType | null;
  fields: FieldDef[];
  formData: Record<string, string>;
  images: string[];
  user: User | null;
  onSuccess: () => void;
  t: TFn;
}
