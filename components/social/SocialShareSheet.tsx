import React, { memo } from 'react';
import {
  View, Text, TouchableOpacity, Modal, Linking, Share,
  Pressable, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemedStyles } from '../../hooks/useTheme';
import { SOCIAL_SHARE_URLS, SOCIAL_BRAND_COLORS } from '../../constants';
import type { SocialShareSheetProps, SocialAction } from '../../util/types';
import { createStyles } from '../../util/styles/social/socialShareSheet.styles';

const SOCIALS: SocialAction[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: 'whatsapp',
    color: SOCIAL_BRAND_COLORS.whatsapp.color,
    bg: SOCIAL_BRAND_COLORS.whatsapp.bg,
    onPress: (msg) =>
      Linking.openURL(SOCIAL_SHARE_URLS.whatsappApp(msg)).catch(() =>
        Linking.openURL(SOCIAL_SHARE_URLS.whatsappWeb(msg)),
      ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
    color: SOCIAL_BRAND_COLORS.facebook.color,
    bg: SOCIAL_BRAND_COLORS.facebook.bg,
    onPress: (msg) =>
      Linking.openURL(SOCIAL_SHARE_URLS.facebook(msg))
        .catch(() => Share.share({ message: msg }).then(() => {})),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: 'music-note',
    color: SOCIAL_BRAND_COLORS.tiktok.color,
    bg: SOCIAL_BRAND_COLORS.tiktok.bg,
    onPress: (msg) => Share.share({ message: msg }).then(() => {}),
  },
];

function SocialShareSheet({ visible, onClose, title, message }: SocialShareSheetProps) {
  const styles = useThemedStyles(createStyles);

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
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.heading} numberOfLines={1}>{title}</Text>
        <Text style={styles.sub}>Share via</Text>

        <View style={styles.row}>
          {SOCIALS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={styles.item}
              onPress={() => handleSocial(s)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, { backgroundColor: s.bg }]}>
                <MaterialCommunityIcons name={s.icon as never} size={26} color={s.color} />
              </View>
              <Text style={styles.label}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.75}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && <View style={styles.iosBottom} />}
      </View>
    </Modal>
  );
}

export default memo(SocialShareSheet);
