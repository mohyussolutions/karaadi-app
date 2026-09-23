import { useCallback, useSyncExternalStore } from 'react';
import { useFocusEffect } from 'expo-router';

let overlayCount = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

const getSnapshot = () => overlayCount > 0;

export function useIsOverlayActive(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useHideGlobalChrome() {
  useFocusEffect(
    useCallback(() => {
      overlayCount += 1;
      emit();
      return () => {
        overlayCount = Math.max(0, overlayCount - 1);
        emit();
      };
    }, []),
  );
}
