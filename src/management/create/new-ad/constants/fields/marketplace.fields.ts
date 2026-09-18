import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';

export function getMarketplaceFields(t: TFn): FieldDef[] {
  return [
    { key: 'title', label: t('createMarketplace.titleLabel'), placeholder: t('createMarketplace.titlePlaceholder'), type: 'text', required: true },
    {
      key: 'subcategory', label: t('createAd.selectCategory'), type: 'dropdown', required: true,
      options: [
        { label: t('subcategories.marketplace.antiques'),       value: 'antiques' },
        { label: t('subcategories.marketplace.electronics'),    value: 'electronics' },
        { label: t('subcategories.marketplace.animalAndSupplies'), value: 'animalAndSupplies' },
        { label: t('subcategories.marketplace.sportsAndOutdoors'), value: 'sportsAndOutdoors' },
        { label: t('subcategories.marketplace.furniture'),      value: 'furniture' },
        { label: t('subcategories.marketplace.fashion'),        value: 'fashion' },
        { label: t('subcategories.marketplace.education', { defaultValue: 'Education' }), value: 'education' },
      ],
    },
    {
      key: 'condition', label: t('createMarketplace.conditionLabel'), type: 'dropdown',
      options: [
        { label: t('createMarketplace.conditions.new'),       value: 'New' },
        { label: t('createMarketplace.conditions.usedLikeNew'), value: 'Used – Like New' },
        { label: t('createMarketplace.conditions.usedGood'),  value: 'Used – Good' },
        { label: t('createMarketplace.conditions.usedFair'),  value: 'Used – Fair' },
      ],
    },
    { key: 'price', label: t('createMarketplace.priceLabel'), placeholder: t('postAd.free', { defaultValue: '0 = price on request' }), type: 'number', required: true },
    { key: 'description', label: t('createMarketplace.descriptionLabel'), placeholder: t('createMarketplace.descriptionPlaceholder'), type: 'textarea', required: true },
    { key: 'website', label: `${t('createMarketplace.websiteLabel')} (${t('createMarketplace.optional')})`, placeholder: 'https://…', type: 'text' },
  ];
}
