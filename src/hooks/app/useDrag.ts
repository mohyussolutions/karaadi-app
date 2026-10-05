import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

import {
  DRAG_THRESHOLD,
  FAB_INIT_X,
  FAB_INIT_Y,
  FAB_SIZE,
  NATIVE_DRIVER,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SHEET_TOP,
} from '../../actions/constants';

import type { FabPoint, VoidCallback } from '../../utils/types';
import type { EdgeInsets } from 'react-native-safe-area-context';

const clampFabPosition = (from: FabPoint, dx: number, dy: number, bottomInset: number): FabPoint => ({
  x: Math.max(0, Math.min(from.x + dx, SCREEN_WIDTH - FAB_SIZE)),
  y: Math.max(SHEET_TOP, Math.min(from.y + dy, SCREEN_HEIGHT - FAB_SIZE - bottomInset)),
});

const settleSheet = (dragY: Animated.Value, dismissing: boolean) => {
  const animation = dismissing
    ? Animated.timing(dragY, { toValue: 0, duration: 0, useNativeDriver: NATIVE_DRIVER })
    : Animated.spring(dragY, { toValue: 0, useNativeDriver: NATIVE_DRIVER, tension: 80, friction: 14 });
  animation.start();
};

export const useFabDrag = (insets: EdgeInsets) => {
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
      onPanResponderMove: Animated.event([null, { dx: fabPan.x, dy: fabPan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        fabPan.flattenOffset();
        const next = clampFabPosition(fabPosRef.current, g.dx, g.dy, insetsRef.current.bottom);
        fabPosRef.current = next;
        Animated.spring(fabPan, {
          toValue: next,
          useNativeDriver: false,
          tension: 80,
          friction: 14,
        }).start();
      },
      onPanResponderTerminate: () => {
        fabPan.flattenOffset();
      },
    }),
  ).current;

  return { fabPan, fabResponder };
};

export const useSheetDrag = (onDismiss: VoidCallback) => {
  const dragY = useRef(new Animated.Value(0)).current;
  const dragRef = useRef(0);
  const isDraggingDown = useRef(false);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const sheetDragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
      onPanResponderGrant: () => {
        isDraggingDown.current = false;
        dragRef.current = 0;
        dragY.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          isDraggingDown.current = true;
          dragRef.current = g.dy;
          dragY.setValue(g.dy);
        }
      },
      onPanResponderRelease: () => {
        const dismissing = isDraggingDown.current && dragRef.current > DRAG_THRESHOLD;
        settleSheet(dragY, dismissing);
        if (dismissing) onDismissRef.current();
        isDraggingDown.current = false;
        dragRef.current = 0;
      },
    }),
  ).current;

  return { dragY, sheetDragResponder };
};
