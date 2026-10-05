import { Modal, View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { createStyles } from '../../../utils/styles/modals/trackingConsentModal.styles';
import { SITE_URL } from '../../../actions/constants';
import { PRIVACY_POLICY_PATH } from '../../../actions/constants/routes.constants';
import type { TrackingConsentModalProps } from '../../../utils/types';

export function TrackingConsentModal({ visible, onAccept, onDecline }: TrackingConsentModalProps) {
  const styles = useThemedStyles(createStyles);
  const Colors = useThemeColors();
  const { t } = useAppTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDecline}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityRole="alert">
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="shield-check-outline" size={34} color={Colors.primary} />
          </View>
          <Text style={styles.title}>{t('tracking.consentTitle')}</Text>
          <Text style={styles.body}>{t('tracking.consentBody')}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`${SITE_URL}${PRIVACY_POLICY_PATH}`)} accessibilityRole="link">
            <Text style={styles.link}>{t('tracking.privacyLink')}</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.declineBtn} onPress={onDecline} activeOpacity={0.85} accessibilityRole="button">
              <Text style={styles.declineText}>{t('tracking.decline')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.85} accessibilityRole="button">
              <Text style={styles.acceptText}>{t('tracking.accept')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
