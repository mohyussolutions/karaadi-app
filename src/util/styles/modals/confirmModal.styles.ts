import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
