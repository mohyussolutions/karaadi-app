import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGlobal } from '../../../../../../../../hooks/app/useResponsive';
import { useThemeColors, useThemedStyles } from '../../../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../../../hooks/app/useAppTranslation';
import { useDisplayAttrs } from '../../../../../../../../hooks/listings/useNewAd';
import { formatPrice } from '../../../../../../../../lib/helpers';
import type { ImageCarouselProps, OrderSummaryProps } from '../../../../../../../../utils/types';
import { AmountBlock, CheckoutHeading, LedgerRow } from '../Checkout/Checkout';
import { createStyles as createCheckoutStyles } from '../../../../../../../../utils/styles/payment/checkout.styles';
import { createStyles } from '../../../../../../../../utils/styles/payment/orderSummary.styles';

function ImageCarousel({ images, index, onChangeIndex }: ImageCarouselProps) {
  const Colors = useThemeColors();
  const { width } = useGlobal();
  const s = useThemedStyles(createStyles, width);
  return (
    <View style={s.gallery}>
      <Image source={{ uri: images[index] }} style={s.galleryImage} contentFit="cover" cachePolicy="memory-disk" />
      {images.length > 1 && (
        <>
          {index > 0 && (
            <TouchableOpacity style={[s.arrow, s.arrowLeft]} onPress={() => onChangeIndex(index - 1)} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-left" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
          {index < images.length - 1 && (
            <TouchableOpacity style={[s.arrow, s.arrowRight]} onPress={() => onChangeIndex(index + 1)} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
          <View style={s.counter}>
            <Text style={s.counterText}>{index + 1}/{images.length}</Text>
          </View>
        </>
      )}
    </View>
  );
}

export function OrderSummary({ plan, item, categoryName, feeAmount }: OrderSummaryProps) {
  const { t } = useAppTranslation();
  const { width } = useGlobal();
  const s = useThemedStyles(createStyles, width);
  const c = useThemedStyles(createCheckoutStyles);
  const [imageIndex, setImageIndex] = useState(0);
  const attributes = useDisplayAttrs(item);

  const images = item?.images ?? [];
  const total = feeAmount + plan.price;
  const priceText = (amount: number) => (amount === 0 ? t('postAd.free') : formatPrice(amount));
  const location = [item?.city, item?.region].filter(Boolean).join(', ');
  const meta = [categoryName || item?.mainCategory, location].filter(Boolean).join(' · ');

  return (
    <View>
      <CheckoutHeading title={t('postAd.summaryHeading')} subtitle={t('postAd.summarySub')} />

      {images.length > 0 ? (
        <ImageCarousel images={images} index={imageIndex} onChangeIndex={setImageIndex} />
      ) : (
        <View style={s.galleryEmpty}>
          <Text style={s.galleryEmptyText}>{t('postAd.noImagesUploaded', { defaultValue: 'No images uploaded' })}</Text>
        </View>
      )}

      {!!item?.title && <Text style={s.listingTitle}>{item.title}</Text>}
      {!!meta && <Text style={s.listingMeta}>{meta}</Text>}

      {attributes.length > 0 && (
        <View style={c.section}>
          <Text style={c.sectionLabel}>{t('postAd.detailsLabel')}</Text>
          {attributes.map((attribute) => (
            <LedgerRow key={attribute.label} label={attribute.label} value={String(attribute.value)} />
          ))}
        </View>
      )}

      {!!item?.description && (
        <View style={c.section}>
          <Text style={c.sectionLabel}>{t('postAd.descriptionLabel')}</Text>
          <Text style={s.description}>{item.description}</Text>
        </View>
      )}

      <View style={c.section}>
        <Text style={c.sectionLabel}>{t('postAd.priceLabel')}</Text>
        <LedgerRow label={t('plan.itemFee')} value={priceText(feeAmount)} free={feeAmount === 0} />
        <LedgerRow
          label={t('postAd.planLine', { plan: plan.label, days: plan.days })}
          value={priceText(plan.price)}
          free={plan.price === 0}
        />
      </View>

      <AmountBlock label={t('postAd.totalDue')} amount={priceText(total)} free={total === 0} />
    </View>
  );
}
