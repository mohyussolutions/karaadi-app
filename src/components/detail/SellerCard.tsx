import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';

interface Props {
  username?: string | null;
  profileImage?: string | null;
  phone?: string | null;
  subtitle?: string;
  onMessage?: () => void;
  onCall?: () => void;
  messageBtnLabel?: string;
  messageBtnIcon?: string;
  disabled?: boolean;
}

export default function SellerCard({
  username, profileImage, phone, subtitle,
  onMessage, onCall, messageBtnLabel, messageBtnIcon = 'message-outline', disabled,
}: Props) {
  const { t } = useTranslation();
  const initial = (username?.[0] ?? 'S').toUpperCase();
  const fallback = `https://placehold.co/80x80/3B82F6/ffffff?text=${initial}`;

  return (
    <View style={s.card}>
      <View style={s.row}>
        <Image source={{ uri: profileImage || fallback }} style={s.avatar} />
        <View style={s.info}>
          <Text style={s.name}>{username || 'Seller'}</Text>
          {subtitle && <Text style={s.sub}>{subtitle}</Text>}
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
          <MaterialCommunityIcons name={messageBtnIcon as any} size={18} color="#fff" />
          <Text style={s.msgText}>{messageBtnLabel || t('realEstateDetail.sendMessage')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: Colors.border,
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.border },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#111827' },
  sub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  phoneBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center',
  },
  msgBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13,
  },
  msgBtnDisabled: { backgroundColor: Colors.textMuted },
  msgText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
