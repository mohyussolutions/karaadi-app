import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'expo-router';
import { useAppSelector } from '../../../../store/store';
import { TrackingConsentModal } from '../../../modals/TrackingConsentModal/TrackingConsentModal';
import {
  initTracking,
  isStaffUser,
  linkTrackingSession,
  setTrackingConsent,
  setTrackingStaff,
  trackScreen,
} from '../../../../lib/tracking/tracker';
import type { TrackingConsent, TrackingManagerProps } from '../../../../utils/types';

import { selectAuthLoading, selectUser } from '../../../../store/slices/authSlice';
export default function TrackingManager({ blocked }: TrackingManagerProps) {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);
  const [consent, setConsent] = useState<TrackingConsent | undefined>(undefined);
  const isStaff = isStaffUser(user);
  const userId = user?.id || null;

  useEffect(() => {
    initTracking().then(setConsent);
  }, []);

  useEffect(() => {
    setTrackingStaff(isStaff);
  }, [isStaff]);

  useEffect(() => {
    if (consent !== 'granted' || authLoading || !pathname) return;
    trackScreen(pathname);
  }, [consent, authLoading, pathname, isStaff]);

  useEffect(() => {
    if (consent !== 'granted' || !userId || isStaff) return;
    linkTrackingSession(userId);
  }, [consent, userId, isStaff]);

  const decide = useCallback(async (granted: boolean) => {
    await setTrackingConsent(granted);
    setConsent(granted ? 'granted' : 'denied');
  }, []);

  return (
    <TrackingConsentModal
      visible={consent === null && !blocked && !isStaff}
      onAccept={() => decide(true)}
      onDecline={() => decide(false)}
    />
  );
}
