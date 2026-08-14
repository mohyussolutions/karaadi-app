export interface ConfirmModalAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: ConfirmModalAction[];
  onDismiss: () => void;
}

export interface EulaModalProps {
  visible: boolean;
  onAccept: () => void;
}
