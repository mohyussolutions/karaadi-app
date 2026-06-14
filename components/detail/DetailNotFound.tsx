import React from 'react';
import type { DetailNotFoundProps } from '../../util/types';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/detail/DetailNotFound.styles';

export default function DetailNotFound({ icon = 'alert-circle-outline', message, onBack }: DetailNotFoundProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const detailStyles = useThemedStyles(createStyles);

  return (
    <View style={detailStyles.errorWrap}>
      <MaterialCommunityIcons name={icon as never} size={52} color={Colors.textMuted} />
      <Text style={detailStyles.errorTitle}>
        {message || t('realEstateDetail.listingNotFound')}
      </Text>
      <TouchableOpacity style={detailStyles.errorBack} onPress={onBack}>
        <Text style={detailStyles.errorBackText}>{t('report.goBack')}</Text>
      </TouchableOpacity>
    </View>
  );
}
