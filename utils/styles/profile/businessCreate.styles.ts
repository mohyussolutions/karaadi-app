import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: 16, flexGrow: 1 },
    flexFull: { flex: 1 },
    bottomSpacer: { height: 40 },

    logoSection: {
      flexDirection: 'row', alignItems: 'center', gap: 16,
      marginBottom: 24, backgroundColor: Colors.card,
      borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border,
    },
    logoImg: { width: 80, height: 80, borderRadius: 12 },
    logoPlaceholder: {
      width: 80, height: 80, borderRadius: 12,
      backgroundColor: Colors.primaryGhost,
      borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed',
      alignItems: 'center', justifyContent: 'center', gap: 4,
    },
    logoHint: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
    logoInfo: { flex: 1 },
    logoTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    logoSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    logoRemove: { fontSize: 12, color: Colors.error, fontWeight: '600', marginTop: 6 },

    sectionHeader: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      marginBottom: 12, marginTop: 8, paddingBottom: 8,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    sectionTitle: {
      fontSize: 13, fontWeight: '700', color: Colors.textPrimary,
      textTransform: 'uppercase', letterSpacing: 0.5,
    },

    fieldWrap: { marginBottom: 14 },
    fieldRow: { flexDirection: 'row', gap: 12 },
    fieldRowItem: { flex: 1 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
    req: { color: Colors.error },
    input: {
      backgroundColor: Colors.card, borderRadius: 10,
      paddingHorizontal: 14, paddingVertical: 12,
      fontSize: 15, color: Colors.text,
      borderWidth: 1, borderColor: Colors.border,
    },
    inputError: { borderColor: Colors.error },
    textarea: { height: 110, textAlignVertical: 'top' },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 4 },

    submitBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: Colors.primary, borderRadius: 14,
      paddingVertical: 16, marginTop: 16, marginBottom: 4,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28,
      shadowRadius: 8,
      elevation: 5,
    },
    submitBtnDisabled: { opacity: 0.65 },
    submitText: { color: Colors.white, fontSize: 16, fontWeight: '700' },

    cancelBtn: { alignItems: 'center', paddingVertical: 10 },
    cancelText: { fontSize: 13, color: Colors.textMuted },

    heading: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 6 },

    statusScroll: { padding: 24, alignItems: 'center', flexGrow: 1 },
    statusIconWrap: {
      width: 96, height: 96, borderRadius: 48,
      alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 24,
    },
    statusTitle: { fontSize: 19, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 8 },
    statusMessage: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
    statusCard: {
      width: '100%', backgroundColor: Colors.card, borderRadius: 14,
      borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 10,
    },
    statusRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    statusRowLast: { paddingBottom: 0, borderBottomWidth: 0 },
    statusLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
    statusValue: { fontSize: 14, color: Colors.text, fontWeight: '700' },
    statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    statusBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

    refreshBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 14, marginTop: 8,
    },
    refreshText: { fontSize: 13, color: Colors.primary, fontWeight: '700' },

    planCard: {
      width: '100%', backgroundColor: Colors.card, borderRadius: 14,
      borderWidth: 1.5, borderColor: Colors.border, padding: 16, marginBottom: 12, gap: 6,
    },
    planCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
    planHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    planName: { fontSize: 16, fontWeight: '800', color: Colors.text },
    tierBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    tierBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    planPrice: { fontSize: 22, fontWeight: '800', color: Colors.primary },
    planDuration: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
    planMeta: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    featureText: { fontSize: 13, color: Colors.textPrimary },

    categoryGrid: {
      flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8,
    },
    categoryGridItem: {
      width: '47%', backgroundColor: Colors.card, borderRadius: 14,
      borderWidth: 1, borderColor: Colors.border, padding: 18,
      alignItems: 'center', gap: 10,
    },
    categoryGridIconWrap: {
      width: 52, height: 52, borderRadius: 26,
      backgroundColor: Colors.primaryGhost,
      alignItems: 'center', justifyContent: 'center',
    },
    categoryGridLabel: { fontSize: 14, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  });
}
