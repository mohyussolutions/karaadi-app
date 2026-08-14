import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors } from '../hooks/useTheme';
import type { VerifiedBadgeProps } from '../../util/types';

export default function VerifiedBadge({ visible, size = 16 }: VerifiedBadgeProps) {
  const Colors = useThemeColors();
  if (visible !== true) return null;
  return <MaterialCommunityIcons name="check-decagram" size={size} color={Colors.success} />;
}
