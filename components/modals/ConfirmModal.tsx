import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';
import { styles } from '../../util/styles/modals/confirmModal.styles';

interface Action {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: Action[];
  onDismiss: () => void;
}

export function ConfirmModal({ visible, title, message, actions, onDismiss }: ConfirmModalProps) {
  const Colors = useThemeColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss}>
        <TouchableOpacity activeOpacity={1} style={[styles.card, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
          <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>
          {!!message && <Text style={[styles.message, { color: Colors.textSecondary }]}>{message}</Text>}
          <View style={[styles.divider, { backgroundColor: Colors.border }]} />
          {actions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionBtn}
              onPress={() => { onDismiss(); action.onPress(); }}
            >
              <Text style={[styles.actionText, { color: action.destructive ? Colors.error : Colors.primary }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
