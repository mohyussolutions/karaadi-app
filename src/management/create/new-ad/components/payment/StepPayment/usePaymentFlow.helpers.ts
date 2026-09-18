import { activateListing } from '../../../../../../actions/core/payment.actions';
import type { ActivateListingPayload } from '../../../../../../util/types/new-ad.types';
import { ACTIVATE_RETRY_ATTEMPTS, ACTIVATE_RETRY_DELAY_MS } from '../../../../../../constants/constants';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function activateListingWithRetry(
  listingId: string,
  payload: ActivateListingPayload,
): Promise<boolean> {
  for (let attempt = 1; attempt <= ACTIVATE_RETRY_ATTEMPTS; attempt++) {
    try {
      await activateListing(listingId, payload);
      return true;
    } catch (err) {
      if (attempt === ACTIVATE_RETRY_ATTEMPTS) {
        console.warn('activateListing failed after retries', { listingId, err });
        return false;
      }
      await delay(ACTIVATE_RETRY_DELAY_MS);
    }
  }
  return false;
}
