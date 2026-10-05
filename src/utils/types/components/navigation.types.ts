import type { ImageSourcePropType } from 'react-native';
import type { ReactNode } from 'react';
import type { TabItem } from '../app/navigation.types';

export interface BottomTabItemProps {
  item: TabItem;
  focused: boolean;
  onPress: () => void;
}

export interface TabButtonBackgroundProps {
  image?: ImageSourcePropType;
  focused: boolean;
  pressed: boolean;
  children: ReactNode;
}
