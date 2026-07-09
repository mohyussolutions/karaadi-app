import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useThemeColors } from '../../hooks/useTheme';
import { styles } from '../../util/styles/detail/reportLink.styles';

export default function ReportLink({ itemId, itemType }: { itemId: string; itemType: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const Colors = useThemeColors();

  function handlePress() {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }
    router.push({
      pathname: '/listing/report/[id]',
      params: { id: String(itemId), itemType: String(itemType) },
    });
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.btn, { borderColor: Colors.error + '40', backgroundColor: Colors.error + '0D' }]}
        onPress={handlePress}
        activeOpacity={0.75}
      >
        <MaterialCommunityIcons name="flag-outline" size={18} color={Colors.error} />
        <Text style={[styles.label, { color: Colors.error }]}>
          {t('realEstateDetail.reportItem')}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.error + '80'} />
      </TouchableOpacity>
    </View>
  );
}
