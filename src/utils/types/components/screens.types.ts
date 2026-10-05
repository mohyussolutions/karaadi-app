import type { MenuItem } from '../app/navigation.types';

export interface MenuCardProps {
  item: MenuItem;
  onPress: () => void;
}
