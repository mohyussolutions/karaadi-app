import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { getReviewsByUser } from '../../api/core/reviews.actions';
import { placeholderAvatar } from '../../constants';
import type { SellerCardProps } from '../../util/types';
import { createStyles } from '../../util/styles/detail/SellerCard.styles';

function StarRating({ rating, count }: { rating: number; count: number }) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const stars = Math.round(rating);
  return (
    <View style={s.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons
          key={i}
          name={i <= stars ? 'star' : 'star-outline'}
          size={13}
          color={i <= stars ? Colors.amber : Colors.border}
        />
      ))}
      <Text style={s.ratingText}>{rating.toFixed(1)} ({count})</Text>
    </View>
  );
}

export default function SellerCard({
  username, profileImage, phone, subtitle, userId,
  onMessage, onCall, messageBtnLabel, messageBtnIcon = 'message-outline', disabled,
}: SellerCardProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const initial = (username?.[0] ?? 'S').toUpperCase();
  const fallback = placeholderAvatar(80, '3B82F6', initial);

  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    getReviewsByUser(userId)
      .then((list) => {
        if (list.length === 0) return;
        const avg = list.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / list.length;
        setRating(avg);
        setReviewCount(list.length);
      })
      .catch(() => {});
  }, [userId]);

  return (
    <View style={s.card}>
      <View style={s.row}>
        <Image source={{ uri: profileImage || fallback }} style={s.avatar} />
        <View style={s.info}>
          <Text style={s.name}>{username || t('chats.seller')}</Text>
          {subtitle && <Text style={s.sub}>{subtitle}</Text>}
          {rating !== null && <StarRating rating={rating} count={reviewCount} />}
        </View>
        {phone && onCall && (
          <TouchableOpacity style={s.phoneBtn} onPress={onCall}>
            <MaterialCommunityIcons name="phone-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}

      </View>

      {onMessage && (
        <TouchableOpacity
          style={[s.msgBtn, disabled && s.msgBtnDisabled]}
          onPress={onMessage}
          disabled={disabled}
        >
          <MaterialCommunityIcons name={messageBtnIcon as any} size={18} color={Colors.white} />
          <Text style={s.msgText}>{messageBtnLabel || t('realEstateDetail.sendMessage')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
