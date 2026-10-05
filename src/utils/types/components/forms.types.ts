import type { Ref } from 'react';
import type { CameraView } from 'expo-camera';
import type { ReactNode } from 'react';
import type { ModalProps } from './modals.types';
import type { FieldDef } from '../models/newAd.types';

export interface CameraCaptureProps extends ModalProps {
  onCapture: (base64: string, mimeType: string) => void;
  initialFacing?: 'back' | 'front';
}

export interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  hasError?: boolean;
}

export interface DropdownOptionRowProps {
  option: DropdownOption;
  selected: boolean;
  onSelect: (value: string) => void;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label: string;
  value: string;
  options: Array<string | DropdownOption>;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export interface FormFieldProps {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export interface ImagePickerRowProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export type DropdownValue = string | DropdownOption;
export type CameraFacing = 'back' | 'front';
export type CameraFlashMode = 'off' | 'on' | 'auto';
export type CameraRef = Ref<CameraView>;
