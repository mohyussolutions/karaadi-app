import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { FAB_INIT_X, FAB_INIT_Y, FAB_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, SHEET_TOP } from '../constants';

export function useFabDrag(insets: EdgeInsets) {
  const fabPosRef = useRef({ x: FAB_INIT_X, y: FAB_INIT_Y });
  const fabPan = useRef(new Animated.ValueXY({ x: FAB_INIT_X, y: FAB_INIT_Y })).current;
  const insetsRef = useRef(insets);
  insetsRef.current = insets;

  const fabResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        fabPan.setOffset({ x: fabPosRef.current.x, y: fabPosRef.current.y });
        fabPan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: fabPan.x, dy: fabPan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (_, g) => {
        fabPan.flattenOffset();
        const nx = Math.max(0, Math.min(fabPosRef.current.x + g.dx, SCREEN_WIDTH - FAB_SIZE));
        const ny = Math.max(SHEET_TOP, Math.min(fabPosRef.current.y + g.dy, SCREEN_HEIGHT - FAB_SIZE - insetsRef.current.bottom));
        fabPosRef.current = { x: nx, y: ny };
        Animated.spring(fabPan, {
          toValue: { x: nx, y: ny },
          useNativeDriver: false,
          tension: 80,
          friction: 14,
        }).start();
      },
      onPanResponderTerminate: () => { fabPan.flattenOffset(); },
    }),
  ).current;

  return { fabPan, fabResponder };
}
