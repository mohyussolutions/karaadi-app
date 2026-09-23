import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { RADII } from '../../colors/colors';
import { createCommonStyles } from '../common/common.styles';

const MAX_CONTENT_WIDTH = 720;

export function createStyles(Colors: ColorPalette, width: number) {
  const common = createCommonStyles(Colors);
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);

  return StyleSheet.create({
    safe: common.safeBase,
    center: { ...common.center, padding: 32, gap: 12, backgroundColor: Colors.background },
    content: { padding: 16, gap: 16, width: contentWidth, alignSelf: 'center' },

    primaryBtn: {
      marginTop: 8, backgroundColor: Colors.primary, borderRadius: RADII.lg,
      paddingVertical: 14, paddingHorizontal: 32,
    },
    primaryBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

    emptyContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyIcon: {
      padding: 20, borderRadius: RADII.xxl, backgroundColor: Colors.surface, marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20, fontWeight: '900', color: Colors.text, textAlign: 'center', textTransform: 'uppercase',
    },
    emptyDesc: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 16 },

    hero: {
      backgroundColor: Colors.primary, borderRadius: RADII.xl, paddingHorizontal: 20, paddingVertical: 18,
    },
    heroLabel: {
      fontSize: 11, fontWeight: '900', color: Colors.textOnPrimary, opacity: 0.7,
      textTransform: 'uppercase', letterSpacing: 1.5,
    },
    heroTitle: { fontSize: 20, fontWeight: '900', color: Colors.textOnPrimary, marginTop: 2 },

    section: { ...common.card, borderRadius: RADII.xl, overflow: 'hidden' },
    sectionHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.surface,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    sectionTitle: {
      fontSize: 12, fontWeight: '900', color: Colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 1.2,
    },
    linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    linkText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

    itemsList: { padding: 12, gap: 8 },
    item: {
      borderRadius: RADII.lg, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.card,
      overflow: 'hidden',
    },
    itemSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
    itemMain: { flexDirection: 'row', gap: 12, padding: 12 },
    thumbWrap: {
      width: 64, height: 64, borderRadius: RADII.md, overflow: 'hidden', backgroundColor: Colors.surface,
    },
    thumb: { width: '100%', height: '100%' },
    thumbCount: {
      position: 'absolute', right: 0, bottom: 0, paddingHorizontal: 5, paddingVertical: 1,
      borderTopLeftRadius: RADII.sm, backgroundColor: Colors.overlay,
      color: Colors.white, fontSize: 9, fontWeight: '700',
    },
    itemBody: { flex: 1, minWidth: 0 },
    itemTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    itemInfo: { flex: 1, minWidth: 0, gap: 2 },
    itemTitle: { fontSize: 14, fontWeight: '900', color: Colors.text },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaCategory: { flexShrink: 1, fontSize: 12, fontWeight: '700', color: Colors.primary },
    metaPlace: { flexShrink: 1, fontSize: 12, fontWeight: '500', color: Colors.textMuted },
    itemRight: { alignItems: 'flex-end', gap: 6 },
    itemPrice: { fontSize: 14, fontWeight: '900', color: Colors.primary },
    radio: {
      width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border,
      alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.card,
    },
    radioOn: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    itemDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 4, lineHeight: 17 },
    gallery: { gap: 6, paddingHorizontal: 12, paddingBottom: 12 },
    galleryImg: {
      width: 56, height: 56, borderRadius: RADII.md, borderWidth: 1, borderColor: Colors.blueTint,
    },
    itemFooter: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border,
      backgroundColor: Colors.surface,
    },
    pendingPill: {
      paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADII.pill, backgroundColor: Colors.warning,
    },
    pendingText: {
      fontSize: 10, fontWeight: '800', color: Colors.white, textTransform: 'uppercase', letterSpacing: 0.5,
    },
    removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 20 },
    removeText: { fontSize: 12, fontWeight: '700', color: Colors.error },

    summaryBody: { padding: 16, gap: 10 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    summaryLabel: { fontSize: 14, fontWeight: '500', color: Colors.textMuted },
    summaryValue: { flexShrink: 1, fontSize: 14, fontWeight: '700', color: Colors.text, textAlign: 'right' },
    planNote: {
      padding: 14, borderRadius: RADII.lg, backgroundColor: Colors.warningGhost,
      borderWidth: 1, borderColor: Colors.warning,
    },
    planNoteText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, textAlign: 'center' },
    payBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      paddingVertical: 14, borderRadius: RADII.lg, backgroundColor: Colors.primary, marginTop: 4,
    },
    payBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  });
}
