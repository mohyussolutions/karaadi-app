import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import type { LoadMoreButtonProps } from '../../../utils/types';
import { createStyles } from '../../../utils/styles/shared/loadMoreButton.styles';

export default function LoadMoreButton({ onPress, loading }: LoadMoreButtonProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useAppTranslation();

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading} activeOpacity={0.8}>
      {loading ? (
        <>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.text}>{t('loadingMore')}</Text>
        </>
      ) : (
        <>
          <Text style={styles.text}>{t('loadMore')}</Text>
          <MaterialCommunityIcons name="chevron-down" size={16} color={Colors.primary} />
        </>
      )}
    </TouchableOpacity>
  );
}
