import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/modals/confirmModal.styles';
import type { ConfirmModalProps } from '../../../utils/types';

export function ConfirmModal({ visible, title, message, actions, onDismiss }: ConfirmModalProps) {
  const styles = useThemedStyles(createStyles);
  const lastIndex = actions.length - 1;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss}>
        <TouchableOpacity activeOpacity={1} style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.actions}>
            {actions.map((action, index) => {
              const filled = index === lastIndex;
              const btnStyle = !filled
                ? styles.actionBtn
                : action.destructive ? styles.actionBtnDestructive : styles.actionBtnPrimary;
              return (
                <TouchableOpacity
                  key={action.label}
                  style={btnStyle}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  onPress={() => { onDismiss(); action.onPress(); }}
                >
                  <Text style={filled ? styles.actionTextFilled : styles.actionText} numberOfLines={1}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
