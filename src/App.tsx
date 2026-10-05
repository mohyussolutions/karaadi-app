import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { ctx } from 'expo-router/_ctx';
import { store, persistor } from './store/store';
import i18n from './i18n/i18n';
import { LoadingSpinner } from './components/loading';
import { appStyles } from './utils/styles/layout/app.styles';

const loadingScreen = <LoadingSpinner fullScreen />;

export default function App() {
  const [fontsLoaded] = useFonts(MaterialCommunityIcons.font);

  return (
    <Provider store={store}>
      <PersistGate loading={loadingScreen} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <GestureHandlerRootView style={appStyles.root}>
            <SafeAreaProvider>
              {fontsLoaded ? <ExpoRoot context={ctx} /> : loadingScreen}
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
}
