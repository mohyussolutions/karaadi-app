import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useThemeColors } from '../../hooks/useTheme';

export default function ReportLink({ itemId, itemType }: { itemId: string; itemType: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const Colors = useThemeColors();

  function handlePress() {
    if (!user) { router.push('/(auth)/login'); return; }
    router.push({ pathname: '/listing/report/[id]', params: { id: itemId, itemType } });
  }

  return (
    <TouchableOpacity onPress={handlePress} hitSlop={8} style={{ alignSelf: 'flex-start', marginTop: 8, marginBottom: 8 }}>
      <Text style={{ color: Colors.error, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
        {t('realEstateDetail.reportItem')}
      </Text>
    </TouchableOpacity>
  );
}
