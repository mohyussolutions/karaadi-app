const { withAndroidStyles, AndroidConfig } = require('@expo/config-plugins');

const { assignStylesValue, getAppThemeGroup } = AndroidConfig.Styles;

const NO_OVERSCROLL_STYLES = [
  { name: 'KaraadiScrollView', parent: 'android:Widget.ScrollView', themeKey: 'android:scrollViewStyle' },
  {
    name: 'KaraadiHorizontalScrollView',
    parent: 'android:Widget.HorizontalScrollView',
    themeKey: 'android:horizontalScrollViewStyle',
  },
];

module.exports = function withAndroidNoEffects(config) {
  return withAndroidStyles(config, (config) => {
    let styles = config.modResults;

    styles = assignStylesValue(styles, {
      add: true,
      parent: getAppThemeGroup(),
      name: 'android:colorControlHighlight',
      value: '@android:color/transparent',
    });

    for (const { name, parent, themeKey } of NO_OVERSCROLL_STYLES) {
      styles = assignStylesValue(styles, {
        add: true,
        parent: { name, parent },
        name: 'android:overScrollMode',
        value: 'never',
      });
      styles = assignStylesValue(styles, {
        add: true,
        parent: getAppThemeGroup(),
        name: themeKey,
        value: `@style/${name}`,
      });
    }

    config.modResults = styles;
    return config;
  });
};
