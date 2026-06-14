import { LogBox } from 'react-native';

const IGNORED_WARNS = [
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
];

LogBox.ignoreLogs(IGNORED_WARNS);

const _warn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  if (IGNORED_WARNS.some((w) => msg.includes(w))) return;
  _warn(...args);
};
