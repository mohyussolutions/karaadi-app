import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

export const createStyles = (Colors: ColorPalette) => StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.black },
  flipBtnSpacer: { width: 52 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, zIndex: 10,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.shadow42,
    alignItems: 'center', justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 36, zIndex: 10,
  },
  flipBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.shadow42,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterOuter: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 4, borderColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterCapturing: { opacity: 0.5 },
  loadingOverlay: {
    backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center',
  },
  loadingText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  shutterInner: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.white,
  },
  permWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: Colors.background },
  permTitle: { fontSize: 20, fontWeight: '800', marginTop: 20, textAlign: 'center', color: Colors.textPrimary },
  permSub: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20, color: Colors.textMuted },
  permBtn: {
    marginTop: 28, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: 14, width: '100%', alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  permBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  permCancel: { marginTop: 14, paddingVertical: 8 },
  permCancelText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
});
