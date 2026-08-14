import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { DRAG_THRESHOLD } from '../constants';
import { NATIVE_DRIVER } from '../../../util/animation';

export function useSheetDrag(onDismiss: () => void) {
  const dragY = useRef(new Animated.Value(0)).current;
  const dragRef = useRef(0);
  const isDraggingDown = useRef(false);

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
        if (isDraggingDown.current && dragRef.current > DRAG_THRESHOLD) {
          Animated.timing(dragY, { toValue: 0, duration: 0, useNativeDriver: NATIVE_DRIVER }).start();
          onDismiss();
        } else {
          Animated.spring(dragY, {
            toValue: 0, useNativeDriver: NATIVE_DRIVER, tension: 80, friction: 14,
          }).start();
        }
        isDraggingDown.current = false;
        dragRef.current = 0;
      },
    }),
  ).current;

  return { dragY, sheetDragResponder };
}
