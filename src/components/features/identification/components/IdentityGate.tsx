import React, { useState } from 'react';
import { View, Text, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { IdentityCaptureForm } from './IdentityCaptureForm';
import { submitIdentification } from '../../../../api/categories/identification.actions';
import { createStyles } from '../../../../util/styles/profile/verifyIdentity.styles';
import type { IdentityGateProps } from '../../../../util/types';

export function IdentityGate({ visible, idCardRequired, selfieRequired, onVerified }: IdentityGateProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(idCardImage?: string, selfieImage?: string) {
    setSubmitting(true);
    try {
      await submitIdentification({ idCardImage, selfieImage });
      return true;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={() => {}}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={[s.banner, s.bannerRequired]}>
            <MaterialCommunityIcons name="shield-lock-outline" size={22} color={Colors.warning} />
            <View style={{ flex: 1 }}>
              <Text style={s.bannerTitle}>{t('mine.identification.gateTitle')}</Text>
              <Text style={s.bannerSub}>{t('mine.identification.gateSub')}</Text>
            </View>
          </View>

          <IdentityCaptureForm
            submitting={submitting}
            idCardRequired={idCardRequired}
            selfieRequired={selfieRequired}
            onSubmit={handleSubmit}
            onSuccess={onVerified}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
