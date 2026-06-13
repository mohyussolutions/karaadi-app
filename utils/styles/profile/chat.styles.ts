import { Platform, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.slate50 },
    flexFull: { flex: 1 },

    header: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: 12, paddingVertical: 10,
      backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.slate100,
      shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    backBtn: { marginRight: 2 },
    avatar: {
      width: 38, height: 38, borderRadius: 19,
      backgroundColor: Colors.blue600, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
    headerName: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.slate900 },

    centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
    errorText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.slate500 },
    emptySub: { fontSize: 13, color: Colors.slate500 },

    fetchingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10 },
    fetchingText: { fontSize: 13, color: Colors.slate500 },

    list: { padding: 14, gap: 4, flexGrow: 1 },

    row: { flexDirection: 'row', marginBottom: 2 },
    rowMe: { justifyContent: 'flex-end' },
    rowThem: { justifyContent: 'flex-start' },

    bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
    bubbleMe: { backgroundColor: Colors.blue600, borderBottomRightRadius: 4 },
    bubbleThem: { backgroundColor: Colors.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.slate200 },

    bubbleText: { fontSize: 15, lineHeight: 21 },
    bubbleTextMe: { color: Colors.white },
    bubbleTextThem: { color: Colors.text },

    time: { fontSize: 10, marginTop: 4 },
    timeMe: { color: 'rgba(255,255,255,0.6)', textAlign: 'left' },
    timeThem: { color: Colors.slate500, textAlign: 'right' },

    inputRow: {
      flexDirection: 'row', alignItems: 'flex-end', gap: 8,
      paddingHorizontal: 12, paddingVertical: 8,
      backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.slate100,
    },
    input: {
      flex: 1,
      backgroundColor: Colors.slate50,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 10 : 8,
      paddingBottom: Platform.OS === 'ios' ? 10 : 8,
      fontSize: 15,
      color: Colors.slate900,
      maxHeight: 120,
      minHeight: 44,
      borderWidth: 1,
      borderColor: Colors.slate200,
    },
    sendBtn: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: Colors.blue600, alignItems: 'center', justifyContent: 'center',
      alignSelf: 'flex-end',
    },
    sendBtnOff: { backgroundColor: '#CBD5E1' },
  });
}
