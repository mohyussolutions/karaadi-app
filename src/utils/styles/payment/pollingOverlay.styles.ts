import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { createModalBase } from '../modals/modalBase.styles';

export function createStyles(Colors: ColorPalette) {
  const base = createModalBase(Colors);
  return StyleSheet.create({
    backdrop: base.backdrop,
    card: { ...base.card, gap: 12 },
    circle: { ...base.iconCircle, width: 72, height: 72, borderRadius: 36, marginBottom: 4 },
    title: { ...base.title, marginBottom: 0 },
    sub: base.message,
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', marginTop: 4 },
    bar: { flex: 1, height: 4, backgroundColor: Colors.gray100, borderRadius: 2, overflow: 'hidden' },
    fill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
    prog: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', width: 36, textAlign: 'right' },
    actions: { ...base.actions, marginTop: 8 },
    cancelBtn: base.secondaryBtn,
    cancelText: base.secondaryBtnText,
  });
}
