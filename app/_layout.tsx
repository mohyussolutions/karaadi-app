import '../src/i18n/i18n';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { store, persistor } from '../src/store';
import { useAuth } from '../src/hooks/useAuth';
import { LoadingSpinner } from '../src/components/shared';
import GlobalHeader from '../src/components/GlobalHeader';
import Hage from '../src/components/Hage';
import SplashScreen from '../src/components/SplashScreen';
import LanguageSync from '../src/i18n/LanguageSync';
import i18n from '../src/i18n/i18n';

function AppNavigator() {
  const { loadFromStorage } = useAuth();
  const [fontsLoaded] = useFonts({ ...MaterialCommunityIcons.font });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => { loadFromStorage(); }, []);

  if (!fontsLoaded) return <LoadingSpinner fullScreen />;

  return (
    <View style={{ flex: 1 }}>
      <LanguageSync />
      <StatusBar style="auto" />
      <GlobalHeader />
      <Stack screenOptions={{ headerShown: false, title: '' }} />
      <Hage />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner fullScreen />} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
}
