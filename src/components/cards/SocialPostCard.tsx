import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../hooks/useTheme';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { getSocialStatus, postSocialUpdate } from '../../actions/core/social.actions';
import { SOCIAL_BRAND_COLORS } from '../../constants';
import { SOCIAL_ICONS } from '../../util/icons/icons';
import type { SocialPostCardProps, PostOutcome } from '../../util/types';
import { createStyles } from '../../util/styles/social/socialPostCard.styles';

export default function SocialPostCard({ title, description, price, images, listingUrl, isPremium90 }: SocialPostCardProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  const [avail, setAvail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [outcome, setOutcome] = useState<PostOutcome>('idle');

  useEffect(() => {
    getSocialStatus()
      .then((d: { facebook: boolean }) => setAvail(!!d?.facebook))
      .catch(() => {});
  }, []);

  const posted = isLoading || outcome !== 'idle';

  async function handlePost() {
    if (!avail) return;
    setIsLoading(true);

    const imageUrl = (images ?? []).find((u) => u?.startsWith('http'));
    const payload = {
      title: title || '',
      description: (description ?? '').slice(0, 200),
      price: Number(price) || 0,
      imageUrl,
      listingUrl,
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
        <View style={[s.platformRow, { opacity: 0.5, backgroundColor: Colors.background }]}>
          <View style={[s.platformIconBadge, { backgroundColor: SOCIAL_BRAND_COLORS.facebook.color }]}>
            <MaterialCommunityIcons name={SOCIAL_ICONS.facebook as never} size={18} color={Colors.white} />
          </View>
          <View style={s.platformInfo}>
            <Text style={s.platformName}>Facebook</Text>
            <Text style={s.platformStatus}>{t('postAd.socialFbPremiumOnly', '90-Day Premium required')}</Text>
          </View>
          <MaterialCommunityIcons name="lock" size={16} color={Colors.textMuted} />
        </View>
      ) : isLoading ? (
        <View style={s.postingBanner}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={s.postingBannerText}>{t('postAd.socialFbLoading')}</Text>
        </View>
      ) : outcome === 'done' ? (
        <View style={s.doneBanner}>
          <Text style={s.doneBannerText}>{t('postAd.socialFbDone')}</Text>
        </View>
      ) : (
        <TouchableOpacity style={s.confirmBtn} onPress={handlePost} disabled={!avail} activeOpacity={0.88}>
          <MaterialCommunityIcons name={SOCIAL_ICONS.facebook as never} size={18} color={Colors.white} style={{ marginRight: 8 }} />
          <Text style={s.confirmBtnText}>
            {outcome === 'error' ? t('postAd.socialFbError') : t('postAd.socialPostToFacebook', 'Post to Facebook')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
