import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../hooks/app/useTheme';
import { ROOT_STACK_SCREENS } from './rootStackScreens';
import { AUTH_HEADER_CONTENT_HEIGHT, DEFAULT_HEADER_CONTENT_HEIGHT } from '../../actions/constants';
import type { ContentPadding, ContentPaddingMap } from '../../utils/types';

export default function RootStack() {
  const Colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const paddingTop: ContentPaddingMap = {
    default: insets.top + DEFAULT_HEADER_CONTENT_HEIGHT,
    auth: insets.top + AUTH_HEADER_CONTENT_HEIGHT,
    zero: 0,
  };

  const contentStyle = (padding: ContentPadding) => ({
    backgroundColor: Colors.background,
    paddingTop: paddingTop[padding],
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        title: '',
        contentStyle: contentStyle('default'),
        animation: Platform.OS === 'ios' ? 'default' : 'none',
      }}
    >
      {ROOT_STACK_SCREENS.map(({ name, options, contentPadding }) => (
        <Stack.Screen
          key={name}
          name={name}
          options={contentPadding ? { ...options, contentStyle: contentStyle(contentPadding) } : options}
        />
      ))}
    </Stack>
  );
}
