import './util/suppressWarnings';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { ctx } from 'expo-router/_ctx';
import { store, persistor } from './store/store';
import i18n from './i18n/i18n';
import { LoadingSpinner } from './components/loading';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner fullScreen />} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <ExpoRoot context={ctx} />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
}

renderRootComponent(App);
