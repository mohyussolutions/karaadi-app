import type { MCIcon } from '../app/icon.types';

export interface BusinessStatusMeta {
  icon: MCIcon;
  colorKey: 'primary' | 'success' | 'error';
  title: string;
  message: string;
}

export type BusinessStatusMetaMap = Record<string, BusinessStatusMeta>;
