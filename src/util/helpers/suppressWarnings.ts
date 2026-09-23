import { LogBox } from 'react-native';
import { IGNORED_WARNS } from "../../constants";

LogBox.ignoreLogs(IGNORED_WARNS);

const _warn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  if (IGNORED_WARNS.some((w) => msg.includes(w))) return;
  _warn(...args);
};
