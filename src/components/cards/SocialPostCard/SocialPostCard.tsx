import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { getSocialStatus, postSocialUpdate } from '../../../actions/core/social.actions';
import { SOCIAL_SHARE_URLS } from '../../../actions/constants';
import { SOCIAL_ICONS } from '../../../utils/icons';
import type { OwnShareButtonProps, PostOutcome, SocialPostCardProps } from '../../../utils/types';
import { createStyles } from '../../../utils/styles/social/socialPostCard.styles';
import { bgColor } from '../../../utils/styles/common/dynamic.styles';

export default function SocialPostCard({ title, description, price, images, listingUrl, listingId, isPremium90 }: SocialPostCardProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  const [avail, setAvail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [outcome, setOutcome] = useState<PostOutcome>('idle');

  useEffect(() => {
    getSocialStatus()
      .then((status) => setAvail(!!status?.facebook))
      .catch(() => {});
  }, []);

  const posted = isLoading || outcome !== 'idle';

  function shareOnOwnFacebook() {
    Linking.openURL(SOCIAL_SHARE_URLS.facebook(listingUrl)).catch(() => {});
  }

  async function handlePost() {
    if (!avail) {
      shareOnOwnFacebook();
      return;
    }
    setIsLoading(true);

    const imageUrl = (images ?? []).find((u) => u?.startsWith('http'));
    const payload = {
      title: title || '',
      description: (description ?? '').slice(0, 200),
      price: Number(price) || 0,
      imageUrl,
      listingUrl,
      listingId,
      platforms: { facebook: true },
    };

    try {
      const data = await postSocialUpdate(payload);
      setOutcome(data?.results?.facebook?.success ? 'done' : 'error');
    } catch {
      setOutcome('error');
    }
    setIsLoading(false);
  }

  return (
    <View style={s.shareSection}>
      <Text style={s.shareTitle}>
        {posted ? t('postAd.socialSharingTo') : t('postAd.socialShareTitle')}
      </Text>

      {!isPremium90 ? (
        <>
          <View style={[s.platformRow, s.lockedRow]}>
            <View style={[s.platformIconBadge, bgColor(Colors.brandFacebook)]}>
              <MaterialCommunityIcons name={SOCIAL_ICONS.facebook as never} size={18} color={Colors.white} />
            </View>
            <View style={s.platformInfo}>
              <Text style={s.platformName}>Facebook</Text>
              <Text style={s.platformStatus}>{t('postAd.socialFbPremiumOnly')}</Text>
            </View>
            <MaterialCommunityIcons name="lock" size={16} color={Colors.textMuted} />
          </View>
          <OwnShareButton onPress={shareOnOwnFacebook} />
        </>
      ) : isLoading ? (
        <View style={s.postingBanner}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={s.postingBannerText}>{t('postAd.socialFbLoading')}</Text>
        </View>
      ) : outcome === 'done' ? (
        <>
          <View style={s.doneBanner}>
            <Text style={s.doneBannerText}>{t('postAd.socialFbDone')}</Text>
          </View>
          <OwnShareButton onPress={shareOnOwnFacebook} />
        </>
      ) : (
        <>
          <TouchableOpacity style={s.confirmBtn} onPress={handlePost} activeOpacity={0.88}>
            <MaterialCommunityIcons name={SOCIAL_ICONS.facebook as never} size={18} color={Colors.white} style={s.confirmBtnIcon} />
            <Text style={s.confirmBtnText}>
              {outcome === 'error' ? t('postAd.socialFbError') : t('postAd.socialPostToFacebook', 'Post to Facebook')}
            </Text>
          </TouchableOpacity>
          {outcome === 'error' && <OwnShareButton onPress={shareOnOwnFacebook} />}
        </>
      )}
    </View>
  );
}

function OwnShareButton({ onPress }: OwnShareButtonProps) {
  const Colors = useThemeColors();
  const { t } = useAppTranslation();
  const s = useThemedStyles(createStyles);
  return (
    <TouchableOpacity style={s.secondaryBtn} onPress={onPress} activeOpacity={0.88}>
      <MaterialCommunityIcons name="share-variant" size={16} color={Colors.brandFacebook} style={s.confirmBtnIcon} />
      <Text style={s.secondaryBtnText}>{t('postAd.socialShareOwnFacebook')}</Text>
    </TouchableOpacity>
  );
}
