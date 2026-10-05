import type { TextStyle, ViewStyle } from 'react-native';
import type { ColorPalette } from '../../types';
import { RADII } from '../../colors/colors';

export const MODAL_CARD_MAX_WIDTH = 400;
export const MODAL_SHEET_RADIUS = RADII.xxl;

const button: ViewStyle = {
  flex: 1,
  minHeight: 48,
  borderRadius: RADII.lg,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 16,
};

export const createModalBase = (Colors: ColorPalette) => {
  const backdrop: ViewStyle = {
    flex: 1,
    backgroundColor: Colors.shadow55,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  };

  const card: ViewStyle = {
    width: '100%',
    maxWidth: MODAL_CARD_MAX_WIDTH,
    borderRadius: RADII.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    padding: 24,
    alignItems: 'center',
  };

  const iconCircle: ViewStyle = {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: Colors.primaryGhost,
  };

  const title: TextStyle = {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.text,
  };

  const message: TextStyle = {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.textSecondary,
  };

  const actions: ViewStyle = {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  };

  const primaryBtn: ViewStyle = { ...button, backgroundColor: Colors.primary };
  const destructiveBtn: ViewStyle = { ...button, backgroundColor: Colors.error };
  const secondaryBtn: ViewStyle = { ...button, borderWidth: 1, borderColor: Colors.border };
  const btnDisabled: ViewStyle = { opacity: 0.65 };
  const primaryBtnText: TextStyle = { fontSize: 15, fontWeight: '700', color: Colors.white };
  const secondaryBtnText: TextStyle = { fontSize: 15, fontWeight: '600', color: Colors.text };

  const closeBtn: ViewStyle = {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const sheetBackdrop: ViewStyle = { flex: 1, backgroundColor: Colors.shadow55 };

  const sheet: ViewStyle = {
    backgroundColor: Colors.background,
    borderTopLeftRadius: MODAL_SHEET_RADIUS,
    borderTopRightRadius: MODAL_SHEET_RADIUS,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
  };

  const handle: ViewStyle = {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    marginTop: 10,
    marginBottom: 6,
  };

  return {
    backdrop,
    card,
    iconCircle,
    title,
    message,
    actions,
    primaryBtn,
    destructiveBtn,
    secondaryBtn,
    btnDisabled,
    primaryBtnText,
    secondaryBtnText,
    closeBtn,
    sheetBackdrop,
    sheet,
    handle,
  };
};
