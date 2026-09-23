import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../store/store';
import { LoadingSpinner } from '../loading';
import type { AppProvidersProps } from '../../util/types/component.types';

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner fullScreen />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
