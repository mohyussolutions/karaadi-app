import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../../../hooks/app/useAppTranslation';
import { useTabBarClearance } from '../../../../../../../../hooks/app/useResponsive';
import type {
  AmountBlockProps, CheckoutFooterProps, CheckoutHeadingProps, ErrorBannerProps, LedgerRowProps, TopBarProps,
} from '../../../../../../../../utils/types';
import { createStyles } from '../../../../../../../../utils/styles/payment/checkout.styles';
import { bottomOffset } from '../../../../../../../../utils/styles/common/dynamic.styles';

export const CheckoutTopBar = memo(function CheckoutTopBar({ onBack, title }: TopBarProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.topBar}>
      <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8} accessibilityRole="button">
        <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      {!!title && <Text style={s.topTitle} numberOfLines={1}>{title}</Text>}
    </View>
  );
});

export const CheckoutHeading = memo(function CheckoutHeading({ title, subtitle }: CheckoutHeadingProps) {
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.heading}>
      <Text style={s.headingTitle} accessibilityRole="header">{title}</Text>
      {!!subtitle && <Text style={s.headingSub}>{subtitle}</Text>}
    </View>
  );
});

export const AmountBlock = memo(function AmountBlock({ label, amount, meta, free = false }: AmountBlockProps) {
  const s = useThemedStyles(createStyles);
  return (
    <View style={[s.amountBlock, free && s.amountBlockFree]}>
      <Text style={s.amountLabel}>{label}</Text>
      <Text style={s.amountValue} accessibilityLabel={`${label} ${amount}`}>{amount}</Text>
      {!!meta && <Text style={s.amountMeta}>{meta}</Text>}
    </View>
  );
});

export const LedgerRow = memo(function LedgerRow({ label, value, free = false }: LedgerRowProps) {
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.ledgerRow}>
      <Text style={s.ledgerLabel}>{label}</Text>
      <Text style={[s.ledgerValue, free && s.ledgerValueFree]}>{value}</Text>
    </View>
  );
});

export const CheckoutErrorBanner = memo(function CheckoutErrorBanner({ message }: ErrorBannerProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.errBanner} accessibilityRole="alert">
      <MaterialCommunityIcons name="alert-circle-outline" size={18} color={Colors.error} />
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
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text style={s.primaryBtnText}>{label}</Text>
        <MaterialCommunityIcons name={icon} size={20} color={Colors.textOnPrimary} />
      </TouchableOpacity>
      {showSecureNote && (
        <View style={s.secRow}>
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={Colors.success} />
          <Text style={s.secText}>{t('postAd.securedCheckout')}</Text>
        </View>
      )}
    </View>
  );
});
