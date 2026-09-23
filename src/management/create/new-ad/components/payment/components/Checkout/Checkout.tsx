import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../../../hooks/useAppTranslation';
import { useTabBarClearance } from '../../../../../../../hooks/useTabBarClearance';
import type {
  CheckoutFooterProps, CheckoutHeaderProps, ErrorBannerProps, TopBarProps,
} from '../../../../../../../util/types/new-ad.types';
import { createStyles } from '../../../../../../../util/styles/payment/checkout.styles';
import { bottomOffset } from '../../../../../../../util/styles/common/dynamic.styles';

export const CheckoutTopBar = memo(function CheckoutTopBar({ onBack, title }: TopBarProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.topBar}>
      <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
      {!!title && <Text style={s.topTitle} numberOfLines={1}>{title}</Text>}
    </View>
  );
});

export const CheckoutHeader = memo(function CheckoutHeader({ icon, title, subtitle }: CheckoutHeaderProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.header}>
      <View style={s.headerIcon}>
        <MaterialCommunityIcons name={icon} size={16} color={Colors.textOnPrimary} />
      </View>
      <View style={s.headerText}>
        <Text style={s.headerTitle}>{title}</Text>
        {!!subtitle && <Text style={s.headerSub}>{subtitle}</Text>}
      </View>
    </View>
  );
});

export const CheckoutErrorBanner = memo(function CheckoutErrorBanner({ message }: ErrorBannerProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.errBanner}>
      <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.error} />
      <Text style={s.errBannerText}>{message}</Text>
    </View>
  );
});

export const CheckoutFooter = memo(function CheckoutFooter({
  label, icon, onPress, disabled = false, showSecureNote = false,
}: CheckoutFooterProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const clearance = useTabBarClearance();
  return (
    <View style={[s.footer, bottomOffset(clearance)]}>
      <TouchableOpacity
        style={[s.primaryBtn, disabled && s.primaryBtnDisabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.88}
      >
        <Text style={s.primaryBtnText}>{label}</Text>
        <MaterialCommunityIcons name={icon} size={18} color={Colors.textOnPrimary} />
      </TouchableOpacity>
      {showSecureNote && (
        <View style={s.secRow}>
          <MaterialCommunityIcons name="shield-check-outline" size={13} color={Colors.success} />
          <Text style={s.secText}>{t('postAd.securedCheckout')}</Text>
        </View>
      )}
    </View>
  );
});
