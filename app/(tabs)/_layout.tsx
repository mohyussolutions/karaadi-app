import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../src/store';
import COLORS from '../../src/constants/colors';
import { LoadingSpinner } from '../../src/components/shared';
import { TAB_NAV_ITEMS } from '../../src/navigation/links/tabNavItems';

const VISIBLE = new Set(TAB_NAV_ITEMS.map((item) => item.name));

function CompactTabBar({ state, navigation }: { state: any; descriptors: any; navigation: any }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const visibleRoutes = (state.routes as any[]).filter((r: any) => VISIBLE.has(r.name));

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {visibleRoutes.map((route: any) => {
        const item = TAB_NAV_ITEMS.find((i) => i.name === route.name)!;
        const focused = state.index === (state.routes as any[]).indexOf(route);
        const color = focused ? COLORS.primary : '#9CA3AF';

        function onPress() {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        }

        return (
          <TouchableOpacity key={route.key} style={styles.item} onPress={onPress} activeOpacity={0.7}>
            {focused && <View style={styles.indicator} />}
            <MaterialCommunityIcons name={item.icon as any} size={23} color={color} />
            <Text style={[styles.label, { color }]}>{t(item.labelKey)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const loading = useAppSelector((s) => s.auth.loading);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Tabs
      tabBar={(props) => <CompactTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      {TAB_NAV_ITEMS.map((item) => (
        <Tabs.Screen key={item.name} name={item.name} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
  },
});
