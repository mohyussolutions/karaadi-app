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
    router.push({ pathname: '/listing/report/[id]', params: { id: String(itemId), itemType: String(itemType) } });
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      style={{ alignSelf: 'flex-start', marginTop: 8, marginBottom: 8, paddingVertical: 8, paddingHorizontal: 4 }}
      activeOpacity={0.5}
    >
      <Text style={{ color: Colors.error, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' }}>
        {t('realEstateDetail.reportItem')}
      </Text>
    </TouchableOpacity>
  );
}
