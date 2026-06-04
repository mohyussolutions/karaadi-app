import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export const common = StyleSheet.create({
  flex1: { flex: 1 },
  row: { flexDirection: 'row' },
  center: { alignItems: 'center', justifyContent: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  spaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  container: { flex: 1, backgroundColor: COLORS.background },
  padding: { padding: 16 },
  paddingH: { paddingHorizontal: 16 },
  paddingV: { paddingVertical: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  divider: { height: 1, backgroundColor: COLORS.border },
  textPrimary: { color: COLORS.textPrimary, fontSize: 15 },
  textSecondary: { color: COLORS.textSecondary, fontSize: 13 },
  textMuted: { color: COLORS.textMuted, fontSize: 12 },
  heading: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  subheading: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
