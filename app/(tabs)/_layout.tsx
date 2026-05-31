import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { Colors } from '../../src/constants/colors';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';

function TabBarIcon({ name, color, size }: { name: string; color: any; size: number }) {
  return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
}

export default function TabLayout() {
  const { loading } = useAuthStore();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Karaadi',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="magnify" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="new-ad"
        options={{
          title: 'Post Ad',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="plus-circle" color={color} size={size + 4} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="message-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
