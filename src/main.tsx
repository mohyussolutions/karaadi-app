import './util/suppressWarnings';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { ctx } from 'expo-router/_ctx';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { store, persistor } from './store/store';
import i18n from './i18n/i18n';
import { LoadingSpinner } from './components/loading';
import { rootStyles } from './util/styles/root.styles';

function App() {
  const [fontsLoaded] = useFonts({ ...MaterialCommunityIcons.font });

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner fullScreen />} persistor={persistor}>
        {fontsLoaded ? (
          <I18nextProvider i18n={i18n}>
            <GestureHandlerRootView style={rootStyles.gestureRoot}>
              <SafeAreaProvider>
                <ExpoRoot context={ctx} />
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </I18nextProvider>
        ) : (
          <LoadingSpinner fullScreen />
        )}
      </PersistGate>
    </Provider>
  );
}

renderRootComponent(App);
