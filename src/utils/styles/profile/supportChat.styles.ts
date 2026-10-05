import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { createCommonStyles } from '../common/common.styles';

export const createStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: safeBase,
    flex: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
    title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
    list: { padding: 16, gap: 10, flexGrow: 1 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 24 },
    emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
    row: { flexDirection: 'row' },
    rowMine: { justifyContent: 'flex-end' },
    rowTheirs: { justifyContent: 'flex-start' },
    bubble: { maxWidth: '85%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
    bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
    bubbleTheirs: { backgroundColor: Colors.primaryGhost, borderBottomLeftRadius: 4 },
    sender: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 2 },
    text: { fontSize: 14, lineHeight: 20, color: Colors.text },
    textMine: { color: Colors.white },
    time: { fontSize: 10, marginTop: 4, color: Colors.textMuted },
    timeMine: { color: Colors.whiteAlpha80 },
    error: { fontSize: 12, color: Colors.error, textAlign: 'center', paddingHorizontal: 16, paddingBottom: 6 },
    inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.card },
    input: { flex: 1, minHeight: 42, maxHeight: 120, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: Colors.text, backgroundColor: Colors.background },
    send: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
    sendDisabled: { opacity: 0.4 },
    loginBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
    loginButton: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
    loginButtonText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  });
};
