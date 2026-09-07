import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { ctx } from 'expo-router/_ctx';
import { I18nProvider } from '../../providers/main';
import { rootStyles } from '../../util/styles/root.styles';

export default function AppShell() {
  return (
    <I18nProvider>
      <GestureHandlerRootView style={rootStyles.gestureRoot}>
        <SafeAreaProvider>
          <ExpoRoot context={ctx} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </I18nProvider>
  );
}
