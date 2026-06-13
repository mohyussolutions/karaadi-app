import { Dimensions, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.shadow },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 12,
      backgroundColor: Colors.shadow80, gap: 12,
    },
    headerTitle: { flex: 1, color: Colors.whiteAlpha35, fontSize: 14, fontWeight: '500' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    counter: { color: Colors.whiteAlpha35, fontSize: 13 },
    closeBtn: {
      width: 38, height: 38, borderRadius: 19,
      backgroundColor: Colors.whiteAlpha15, alignItems: 'center', justifyContent: 'center',
    },
    imgWrap: { width, flex: 1, justifyContent: 'center' },
    image: { width, height: height * 0.65 },
    arrow: {
      position: 'absolute', top: '50%', marginTop: -28,
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: Colors.shadow55, alignItems: 'center', justifyContent: 'center',
    },
    arrowL: { left: 12 },
    arrowR: { right: 12 },
    thumbBar: { backgroundColor: Colors.shadow80, paddingTop: 12 },
    thumbList: { paddingHorizontal: 12, gap: 8 },
    thumb: {
      width: 56, height: 56, borderRadius: 8,
      borderWidth: 2, borderColor: Colors.whiteAlpha15, opacity: 0.6,
    },
    thumbActive: { borderColor: Colors.white, opacity: 1 },
  });
}
