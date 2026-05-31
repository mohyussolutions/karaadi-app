import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../src/store/authStore';
import { Colors } from '../src/constants/colors';
import LoadingSpinner from '../src/components/shared/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 },
  },
});

export default function RootLayout() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    loadFromStorage();
  }, []);

  if (!fontsLoaded) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="listing/[id]"
              options={{
                headerShown: true,
                headerTitle: '',
                headerBackTitle: 'Back',
                headerTintColor: Colors.primary,
                headerStyle: { backgroundColor: Colors.white },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="browse/[category]"
              options={{
                headerShown: true,
                headerBackTitle: 'Home',
                headerTintColor: Colors.primary,
                headerStyle: { backgroundColor: Colors.white },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="profile/[screen]"
              options={{
                headerShown: true,
                headerBackTitle: 'Profile',
                headerTintColor: Colors.primary,
                headerStyle: { backgroundColor: Colors.white },
                headerShadowVisible: false,
              }}
            />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
