import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/hooks/useAuthStore';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/detail/reportLink.styles';
import { ROUTES } from '../../../actions/constants';
import type { ReportLinkProps } from "../../../utils/types";

export default function ReportLink({ itemId, itemType }: ReportLinkProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  function handlePress() {
    if (!user) {
      router.push(ROUTES.login);
      return;
    }
    router.push({
      pathname: ROUTES.report,
      params: { id: String(itemId), itemType: String(itemType) },
    });
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.btn}
        onPress={handlePress}
        activeOpacity={0.75}
      >
        <MaterialCommunityIcons name="flag-outline" size={18} color={Colors.error} />
        <Text style={styles.label}>
          {t('realEstateDetail.reportItem')}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.error + '80'} />
      </TouchableOpacity>
    </View>
  );
}
