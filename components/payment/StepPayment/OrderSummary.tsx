import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useGlobal } from '../../../hooks/useGlobal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { planStyle } from '../../../features/new-ad/constants/config';
import type { Plan, OrderSummaryProps, CreatedItemSummary } from '../../../util/types';
import { createStyles } from '../../../util/styles/payment/orderSummary.styles';

function ImageCarousel({ images, index, onChangeIndex }: {
  images: string[]; index: number; onChangeIndex: (i: number) => void;
}) {
  const Colors = useThemeColors();
  const { width } = useGlobal();
  const s = useThemedStyles((c) => createStyles(c, width));
  return (
    <View style={s.imgBox}>
      <Image source={{ uri: images[index] }} style={s.img} resizeMode="cover" />
      {images.length > 1 && (
        <>
          {index > 0 && (
            <TouchableOpacity style={[s.arrow, s.arrowL]} onPress={() => onChangeIndex(index - 1)} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-left" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
          {index < images.length - 1 && (
            <TouchableOpacity style={[s.arrow, s.arrowR]} onPress={() => onChangeIndex(index + 1)} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
          <View style={s.dots}>
            {images.map((_, i) => <View key={i} style={[s.dot, i === index && s.dotActive]} />)}
          </View>
        </>
      )}
    </View>
  );
}

function TitleSection({ item, categoryName }: { item: CreatedItemSummary | null; categoryName?: string }) {
  const Colors = useThemeColors();
  const { width } = useGlobal();
  const s = useThemedStyles((c) => createStyles(c, width));
  return (
    <View style={s.titleSection}>
      {!!item?.title && <Text style={s.listingTitle} numberOfLines={2}>{item.title}</Text>}
      <View style={s.chips}>
        {!!(categoryName || item?.mainCategory) && (
          <View style={s.chip}>
            <MaterialCommunityIcons name="tag-outline" size={10} color={Colors.primary} />
            <Text style={s.chipText}>{categoryName || item!.mainCategory}</Text>
          </View>
        )}
        {!!(item?.city || item?.region) && (
          <View style={s.chip}>
            <MaterialCommunityIcons name="map-marker-outline" size={10} color={Colors.textMuted} />
            <Text style={[s.chipText, s.chipTextMuted]}>
              {[item?.city, item?.region].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function AllFieldsGrid({ attrs }: { attrs: Array<{ label: string; value: string }> }) {
  const { width } = useGlobal();
  const s = useThemedStyles((c) => createStyles(c, width));
  return (
    <View style={s.attrsGrid}>
      {attrs.map((a) => (
        <View key={a.label} style={s.attrCell}>
          <Text style={s.attrLabel}>{a.label.toUpperCase()}</Text>
          <Text style={s.attrValue} numberOfLines={2}>{a.value}</Text>
        </View>
      ))}
    </View>
  );
}

function DescriptionBox({ text }: { text: string }) {
  const { width } = useGlobal();
  const s = useThemedStyles((c) => createStyles(c, width));
  const { t } = useAppTranslation();
  return (
    <View style={s.descBox}>
      <Text style={s.descLabel}>{t('postAd.descriptionLabel').toUpperCase()}</Text>
      <Text style={s.descText} numberOfLines={3}>{text}</Text>
    </View>
  );
}

function PriceBreakdown({ plan, ps, feeAmount }: { plan: Plan; ps: ReturnType<typeof planStyle>; feeAmount: number }) {
  const { width } = useGlobal();
  const s = useThemedStyles((c) => createStyles(c, width));
  const { t } = useAppTranslation();
  return (
    <View style={s.breakdown}>
      <Text style={s.breakdownLabel}>{t('postAd.priceBreakdown').toUpperCase()}</Text>
      <View style={s.bRow}>
        <Text style={s.bKey}>{t('plan.itemFee')}</Text>
        <Text style={[s.bVal, feeAmount === 0 && s.green]}>
          {feeAmount === 0 ? t('postAd.free') : `$${feeAmount.toLocaleString()}`}
        </Text>
      </View>
      <View style={s.bRow}>
        <View style={[s.planBadge, { backgroundColor: ps.bg }]}>
          <MaterialCommunityIcons name={ps.icon as any} size={12} color={ps.color} />
          <Text style={[s.bKey, { color: ps.color }]}>{plan.label}</Text>
          <Text style={s.bDays}>· {plan.days}d</Text>
        </View>
        <Text style={[s.bVal, plan.price === 0 && s.green]}>
          {plan.price === 0 ? t('postAd.free') : `$${plan.price.toLocaleString()}`}
        </Text>
      </View>
    </View>
  );
}

function TotalDue({ total }: { total: number }) {
  const Colors = useThemeColors();
  const { width } = useGlobal();
  const s = useThemedStyles((c) => createStyles(c, width));
  const { t } = useAppTranslation();
  const isFree = total === 0;
  return (
    <View style={[s.totalBox, isFree ? s.totalBoxFree : s.totalBoxPaid]}>
      <View style={s.totalLeft}>
        <MaterialCommunityIcons name="check-decagram" size={18} color={isFree ? Colors.successDark : Colors.white} />
        <Text style={[s.totalLabel, isFree ? s.green : s.textWhite]}>{t('postAd.totalDue')}</Text>
      </View>
      <Text style={[s.totalAmt, isFree ? s.green : s.textWhite]}>
        {isFree ? t('postAd.free') : `$${total.toLocaleString()}`}
      </Text>
    </View>
  );
}

export function OrderSummary({ plan, item, categoryName, feeAmount }: OrderSummaryProps) {
  const { width } = useGlobal();
  const s = useThemedStyles((c) => createStyles(c, width));
  const [imgIdx, setImgIdx] = useState(0);
  const ps = planStyle(plan, useThemeColors());
  const total = feeAmount + plan.price;
  const images = item?.images || [];

  const displayAttrs = item?.allAttrs && item.allAttrs.length > 0
    ? item.allAttrs.filter((a) => a.value && String(a.value).trim())
    : [];

  return (
    <View style={s.wrap}>
      {images.length > 0 && <ImageCarousel images={images} index={imgIdx} onChangeIndex={setImgIdx} />}

      <View style={s.card}>
        <TitleSection item={item} categoryName={categoryName} />
        {displayAttrs.length > 0 && <AllFieldsGrid attrs={displayAttrs} />}
        {!!item?.description && <DescriptionBox text={item.description} />}
        <View style={s.divider} />
        <PriceBreakdown plan={plan} ps={ps} feeAmount={feeAmount} />
        <TotalDue total={total} />
      </View>
    </View>
  );
}
