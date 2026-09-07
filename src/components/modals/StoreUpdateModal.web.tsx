// Web has no app store to prompt an update for, and the native
// `sp-react-native-in-app-updates` package has no web build — this stub
// keeps Metro from trying to resolve it when bundling for web.
export default function StoreUpdateModal() {
  return null;
}
