import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { getSocialStatus, postSocialUpdate } from '../../api/core/social.actions';
import { SOCIAL_BRAND_COLORS } from '../../constants';
import { SOCIAL_ICONS } from '../../util/icons/icons';
import type { SocialPostCardProps } from '../../util/types';
import { createStyles } from '../../util/styles/social/socialPostCard.styles';

type SocialAvail = { facebook: boolean; tiktok: boolean };
type PostState = 'idle' | 'loading' | 'done' | 'error';

function PlatformRow({ icon, color, label, selected, state, statusText, onToggle, disabled, locked, lockedReason }: {
  icon: string; color: string; label: string; selected: boolean;
  state: PostState; statusText: string; onToggle: () => void; disabled: boolean;
  locked?: boolean; lockedReason?: string;
}) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  if (locked) {
    return (
      <View style={[s.platformRow, { opacity: 0.5, backgroundColor: Colors.background }]}>
        <View style={[s.platformIconBadge, { backgroundColor: color }]}>
          <MaterialCommunityIcons name={icon as never} size={18} color={Colors.white} />
        </View>
        <View style={s.platformInfo}>
          <Text style={s.platformName}>{label}</Text>
          {lockedReason && <Text style={s.platformStatus}>{lockedReason}</Text>}
        </View>
        <MaterialCommunityIcons name="lock" size={16} color={Colors.textMuted} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[s.platformRow, selected && { borderColor: color, backgroundColor: color + '14' }]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.78}
    >
      <View style={[s.platformIconBadge, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon as never} size={18} color={Colors.white} />
      </View>
      <View style={s.platformInfo}>
        <Text style={s.platformName}>{label}</Text>
        {state !== 'idle' && (
          <Text style={state === 'error' ? s.platformStatusError : s.platformStatus} numberOfLines={1}>
            {statusText}
          </Text>
        )}
      </View>
      {state === 'idle' && (
        <View style={[s.checkCircle, selected && { borderColor: color, backgroundColor: color }]}>
          {selected && <MaterialCommunityIcons name="check" size={12} color={Colors.white} />}
        </View>
      )}
      {state === 'loading' && <ActivityIndicator size="small" color={color} />}
      {state === 'done'    && <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />}
      {state === 'error'   && <MaterialCommunityIcons name="close-circle" size={20} color={Colors.error} />}
    </TouchableOpacity>
  );
}

export default function SocialPostCard({ title, description, price, images, listingUrl, isPremium90 }: SocialPostCardProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  const [avail, setAvail]         = useState<SocialAvail>({ facebook: false, tiktok: false });
  const [fbOn, setFbOn]           = useState(false);
  const [ttOn, setTtOn]           = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [fbState, setFbState]     = useState<PostState>('idle');
  const [ttState, setTtState]     = useState<PostState>('idle');

  useEffect(() => {
    getSocialStatus()
      .then((d: SocialAvail) => {
        setAvail(d ?? { facebook: false, tiktok: false });
        setFbOn(!!isPremium90 && !!d?.facebook);
        setTtOn(!!d?.tiktok);
      })
      .catch(() => {});
  }, [isPremium90]);

  const noneSelected = !fbOn && !ttOn;
  const posting = fbState === 'loading' || ttState === 'loading';
  const posted  = fbState !== 'idle' || ttState !== 'idle';

  async function handleConfirm() {
    setConfirmed(true);
    if (noneSelected) return;

    const imageUrl = (images ?? []).find((u) => u?.startsWith('http'));
    const payload = {
      title: title || '',
      description: (description ?? '').slice(0, 200),
      price: Number(price) || 0,
      imageUrl,
      listingUrl,
      platforms: { facebook: fbOn, tiktok: ttOn },
    };

    if (fbOn)  setFbState('loading');
    if (ttOn)  setTtState('loading');

    try {
      const data = await postSocialUpdate(payload);
      const results = data?.results ?? {};
      if (fbOn) setFbState(results.facebook?.success ? 'done' : 'error');
      if (ttOn) setTtState(results.tiktok?.success  ? 'done' : 'error');
    } catch {
      if (fbOn) setFbState('error');
      if (ttOn) setTtState('error');
    }
  }

  const fbStatus = fbState === 'loading' ? t('postAd.socialFbLoading')
    : fbState === 'done'    ? t('postAd.socialFbDone')
    : fbState === 'error'   ? t('postAd.socialFbError')
    : '';
  const ttStatus = ttState === 'loading' ? t('postAd.socialTtLoading')
    : ttState === 'done'    ? t('postAd.socialTtDone')
    : ttState === 'error'   ? t('postAd.socialTtError')
    : '';

  return (
    <View style={s.shareSection}>
      <Text style={s.shareTitle}>
        {posted ? t('postAd.socialSharingTo') : t('postAd.socialShareTitle')}
      </Text>

      <View style={s.platformList}>
        <PlatformRow
          icon={SOCIAL_ICONS.facebook}
          color={SOCIAL_BRAND_COLORS.facebook.color}
          label="Facebook"
          selected={fbOn}
          state={fbState}
          statusText={fbStatus}
          onToggle={() => setFbOn((v) => !v)}
          disabled={confirmed || !avail.facebook}
          locked={!isPremium90}
          lockedReason={!isPremium90 ? t('postAd.socialFbPremiumOnly', '90-Day Premium required') : undefined}
        />
        <PlatformRow
          icon={SOCIAL_ICONS.tiktok}
          color={SOCIAL_BRAND_COLORS.tiktok.color}
          label="TikTok"
          selected={ttOn}
          state={ttState}
          statusText={ttStatus}
          onToggle={() => setTtOn((v) => !v)}
          disabled={confirmed || !avail.tiktok}
        />
      </View>

      {!confirmed ? (
        <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm} activeOpacity={0.88}>
          <Text style={s.confirmBtnText}>
            {noneSelected ? t('postAd.socialSkip') : t('postAd.socialPostNow')}
          </Text>
        </TouchableOpacity>
      ) : posting ? (
        <View style={s.postingBanner}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={s.postingBannerText}>{t('postAd.socialPosting')}</Text>
        </View>
      ) : posted ? (
        <View style={s.doneBanner}>
          <Text style={s.doneBannerText}>{t('postAd.socialDone')}</Text>
        </View>
      ) : null}
    </View>
  );
}
