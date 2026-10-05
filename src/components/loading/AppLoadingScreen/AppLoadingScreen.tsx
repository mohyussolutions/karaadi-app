import { View, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/loading/appLoadingScreen.styles';
import { fixedWidth } from '../../../utils/styles/common/dynamic.styles';
import { BRAND_LOGO } from '../../../actions/constants';

export default function AppLoadingScreen() {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(200, width * 0.5);

  return (
    <View style={styles.container}>
      <Image
        source={BRAND_LOGO}
        style={[styles.logo, fixedWidth(logoWidth)]}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
    </View>
  );
}
