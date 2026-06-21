import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';

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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    padding: 20,
    paddingBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    lineHeight: 20,
  },
  divider: { height: 1 },
  actionBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionText: { fontSize: 16, fontWeight: '600' },
});
