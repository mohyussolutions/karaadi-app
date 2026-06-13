import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../components/shared';
import { useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../utils/styles/profile/contactHistory.styles';

export default function ContactHistoryScreen() {
  const { t } = useTranslation();
  const s = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <View style={s.center}>
        <EmptyState
          icon="history"
          title={t('mine.noData')}
          message={t('descriptions.contactHistoryDesc')}
        />
      </View>
    </SafeAreaView>
  );
}
