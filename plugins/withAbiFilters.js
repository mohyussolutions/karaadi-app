const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withAbiFilters(config) {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) => item.key !== 'reactNativeArchitectures'
    );
    config.modResults.push({
      type: 'property',
      key: 'reactNativeArchitectures',
      value: 'arm64-v8a,armeabi-v7a',
    });
    return config;
  });
};
