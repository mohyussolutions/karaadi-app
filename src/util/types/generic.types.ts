import type { ReactNode } from 'react';

export type ApiData = any;

export type ApiResponse<T = ApiData> = { data: T };

export interface ApiError extends Error {
  response?: { status: number; data?: { message?: string } };
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface LoadedCollection<T> {
  items: T[];
  loaded: boolean;
}

export interface ItemRef {
  itemId: string;
  itemType: string;
}

export interface WithChildren {
  children: ReactNode;
}
