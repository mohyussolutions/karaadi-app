import { usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import GlobalHeader from '../GlobalHeader/GlobalHeader';
import BottomTabBar from '../../../navigation/tab-bar/BottomTabBar';
import { useTabBarVisibility } from '../../../navigation/tab-bar/useTabBarVisibility';
import { useIsOverlayActive } from '../../../navigation/header/headerVisibility';
import { EulaModal } from '../../modals/EulaModal/EulaModal';
import TrackingManager from '../../features/tracking/TrackingManager/TrackingManager';
import ForceUpdateModal from '../../modals/ForceUpdateModal/ForceUpdateModal';
import StoreUpdateModal from '../../modals/StoreUpdateModal/StoreUpdateModal';
import { IdentityGate } from '../../modals/IdentityGate/IdentityGate';
import { FavoriteToast } from '../../shared';
import Hage from '../../ai-assistant/components/Hage/Hage';
import NotificationBanner from '../../features/notifications/components/NotificationBanner/NotificationBanner';
import { useThemeMode } from '../../../hooks/app/useTheme';
import { useIdentityGate } from '../../../hooks/auth/useAccount';
import { useEulaConsent } from '../../../hooks/app/useApp';
import type { RootOverlaysProps } from '../../../utils/types';

export default function RootOverlays({ banner }: RootOverlaysProps) {
  const { messageBanner, bannerY, handleBannerPress, dismissBanner } = banner;
  const { resolved } = useThemeMode();
  const pathname = usePathname();
  const overlayActive = useIsOverlayActive();
  const showTabBar = useTabBarVisibility(pathname) && !overlayActive;
  const { showEula, acceptEula } = useEulaConsent();
  const { gateOpen, idCardRequired, selfieRequired, onVerified } = useIdentityGate();

  return (
    <>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
      <GlobalHeader />
      {showTabBar && <BottomTabBar />}
      {showTabBar && <Hage />}
      <FavoriteToast />
      <ForceUpdateModal />
      <StoreUpdateModal />
      <EulaModal visible={showEula} onAccept={acceptEula} />
      <TrackingManager blocked={showEula || gateOpen} />
      <IdentityGate
        visible={gateOpen}
        idCardRequired={idCardRequired}
        selfieRequired={selfieRequired}
        onVerified={onVerified}
      />
      {messageBanner && (
        <NotificationBanner
          banner={messageBanner}
          translateY={bannerY}
          onPress={handleBannerPress}
          onDismiss={dismissBanner}
        />
      )}
    </>
  );
}
