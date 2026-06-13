import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { apiClient } from '../../api/client';
import { SOCIAL_ENDPOINTS, SOCIAL_BRAND_COLORS } from '../../constants';
import type { SocialPostCardProps } from '../../utils/types';
import { createStyles } from './SocialPostCard.styles';

type SocialAvail = { facebook: boolean; tiktok: boolean };
type PostState = 'idle' | 'loading' | 'done' | 'error';

function PlatformBtn({ enabled, onToggle, icon, color, label, state }: {
  enabled: boolean; onToggle: () => void;
  icon: string; color: string; label: string; state: PostState;
}) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity style={[styles.platformBtn, enabled && styles.platformBtnOn]} onPress={onToggle} activeOpacity={0.78}>
      <View style={[styles.platformIcon, { backgroundColor: enabled ? color : Colors.gray100 }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={enabled ? Colors.white : Colors.textMuted} />
      </View>
      <Text style={[styles.platformLabel, enabled && styles.platformLabelOn]}>{label}</Text>
      {state === 'loading' && <ActivityIndicator size="small" color={Colors.primary} style={styles.stateIcon} />}
      {state === 'done'    && <MaterialCommunityIcons name="check-circle" size={16} color={Colors.success} style={styles.stateIcon} />}
      {state === 'error'   && <MaterialCommunityIcons name="close-circle" size={16} color={Colors.error}   style={styles.stateIcon} />}
    </TouchableOpacity>
  );
}

export default function SocialPostCard({ title, description, price, images, listingUrl }: SocialPostCardProps) {
  const [avail,   setAvail]   = useState<SocialAvail>({ facebook: false, tiktok: false });
  const [fbOn,    setFbOn]    = useState(false);
  const [ttOn,    setTtOn]    = useState(false);
  const [fbState, setFbState] = useState<PostState>('idle');
  const [ttState, setTtState] = useState<PostState>('idle');
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    apiClient.get(SOCIAL_ENDPOINTS.STATUS)
      .then(({ data }) => {
        setAvail(data);
        setFbOn(!!data.facebook);
        setTtOn(!!data.tiktok);
      })
      .catch(() => {});
  }, []);

  const posted  = fbState !== 'idle' || ttState !== 'idle';
  const posting = fbState === 'loading' || ttState === 'loading';

  async function handlePost() {
    const imageUrl = (images ?? []).find((u) => u?.startsWith('http'));
    const payload = {
      title: title || '',
      description: (description ?? '').slice(0, 200),
      price: Number(price) || 0,
      imageUrl,
      listingUrl,
      platforms: { facebook: fbOn, tiktok: ttOn },
    };
    if (fbOn) setFbState('loading');
    if (ttOn) setTtState('loading');
    try {
      const { data } = await apiClient.post(SOCIAL_ENDPOINTS.POST, payload);
      const results = data?.results ?? {};
      if (fbOn) setFbState(results.facebook?.success ? 'done' : 'error');
      if (ttOn) setTtState(results.tiktok?.success ? 'done' : 'error');
    } catch {
      if (fbOn) setFbState('error');
      if (ttOn) setTtState('error');
    }
  }

  return (
    <View style={styles.shareSection}>
      <Text style={styles.shareTitle}>Share on Karaadi</Text>
      <Text style={styles.shareSub}>Post to Karaadi's official pages to reach more buyers</Text>
      <View style={styles.platformsRow}>
        <PlatformBtn
          enabled={fbOn}
          onToggle={() => avail.facebook && !posted && setFbOn(!fbOn)}
          icon="facebook" color={SOCIAL_BRAND_COLORS.facebook.color} label="Facebook" state={fbState}
        />
        <PlatformBtn
          enabled={ttOn}
          onToggle={() => avail.tiktok && !posted && setTtOn(!ttOn)}
          icon="music-note" color={SOCIAL_BRAND_COLORS.tiktok.color} label="TikTok" state={ttState}
        />
      </View>
      {!posted && (
        <TouchableOpacity
          style={[styles.postBtn, ((!fbOn && !ttOn) || posting) && styles.postBtnDisabled]}
          onPress={handlePost}
          disabled={(!fbOn && !ttOn) || posting}
          activeOpacity={0.88}
        >
          {posting
            ? <ActivityIndicator size="small" color={Colors.white} />
            : <Text style={styles.postBtnText}>Post Now</Text>
          }
        </TouchableOpacity>
      )}
    </View>
  );
}
