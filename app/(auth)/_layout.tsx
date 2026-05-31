import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Create Account' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="reset-password" options={{ title: 'Reset Password' }} />
      <Stack.Screen name="confirm" options={{ title: 'Confirm Account' }} />
    </Stack>
  );
}
