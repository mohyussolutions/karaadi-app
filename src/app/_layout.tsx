import { View } from 'react-native';
import LanguageSync from '../i18n/LanguageSync';
import RootStack from '../navigation/stack/RootStack';
import { RootOverlays } from '../components/layout';
import { useRootSetup } from '../hooks/app/useApp';
import { useThemedStyles } from '../hooks/app/useTheme';
import { createStyles } from '../utils/styles/layout/rootLayout.styles';

export default function RootLayout() {
  const styles = useThemedStyles(createStyles);
  const banner = useRootSetup();

  return (
    <View style={styles.root}>
      <LanguageSync />
      <RootStack />
      <RootOverlays banner={banner} />
    </View>
  );
}
