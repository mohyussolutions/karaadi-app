import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppShell } from './components/shell';
import { AppProviders } from './components/providers';
import { LoadingSpinner } from './components/loading';

export default function App() {
  const [fontsLoaded] = useFonts({ ...MaterialCommunityIcons.font });

  return (
    <AppProviders>
      {fontsLoaded ? <AppShell /> : <LoadingSpinner fullScreen />}
    </AppProviders>
  );
}
