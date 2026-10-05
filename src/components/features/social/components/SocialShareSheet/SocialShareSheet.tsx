import { memo } from 'react';
import {
  View, Text, TouchableOpacity, Modal, Linking, Share,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../hooks/app/useTheme';
import { useResponsive } from '../../../../../hooks/app/useResponsive';
import { tabletModalStyles } from '../../../../../utils/styles/common/tablet.styles';
import { SOCIAL_SHARE_URLS, TABLET_MODAL_ICON_SIZES } from '../../../../../actions/constants';
import type { SocialShareSheetProps, SocialAction } from '../../../../../utils/types';
import { createStyles } from '../../../../../utils/styles/social/socialShareSheet.styles';
import { bgColor, paddingBottomOf, tint } from '../../../../../utils/styles/common/dynamic.styles';
const SOCIALS: SocialAction[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: 'whatsapp',
    colorKey: 'brandWhatsapp',
    onPress: (msg) =>
      Linking.openURL(SOCIAL_SHARE_URLS.whatsappApp(msg)).catch(() =>
        Linking.openURL(SOCIAL_SHARE_URLS.whatsappWeb(msg)),
      ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
    colorKey: 'brandFacebook',
    onPress: (msg) =>
      Linking.openURL(SOCIAL_SHARE_URLS.facebook(msg))
        .catch(() => Share.share({ message: msg }).then(() => {})),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: 'music-note',
    colorKey: 'brandTiktok',
    onPress: (msg) => Share.share({ message: msg }).then(() => {}),
  },
];

function SocialShareSheet({ visible, onClose, title, message, monochrome }: SocialShareSheetProps) {
  const styles = useThemedStyles(createStyles);
  const Colors = useThemeColors();
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();

  async function handleSocial(action: SocialAction) {
    try {
      await action.onPress(message);
    } catch {}
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, paddingBottomOf(insets.bottom + 8), isTablet && tabletModalStyles.shareSheet]}>
        <View style={styles.handle} />
        <Text style={[styles.heading, isTablet && tabletModalStyles.shareHeading]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.sub, isTablet && tabletModalStyles.shareSub]}>Share via</Text>

        <View style={styles.row}>
          {SOCIALS.map((s) => {
            const iconColor = monochrome ? Colors.textPrimary : Colors[s.colorKey];
            return (
              <TouchableOpacity
                key={s.key}
                style={styles.item}
                onPress={() => handleSocial(s)}
                activeOpacity={0.75}
              >
                <View style={[styles.iconWrap, monochrome ? bgColor(Colors.gray100) : tint(iconColor), isTablet && tabletModalStyles.shareIconWrap]}>
                  <MaterialCommunityIcons name={s.icon as never} size={isTablet ? TABLET_MODAL_ICON_SIZES.shareIcon : 26} color={iconColor} />
                </View>
                <Text style={[styles.label, isTablet && tabletModalStyles.shareLabel]}>{s.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.75}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default memo(SocialShareSheet);
