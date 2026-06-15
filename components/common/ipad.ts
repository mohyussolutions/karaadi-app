import { StyleSheet } from 'react-native';

export const TABLET_HEADER_ICON_SIZES = {
  back: 34,
  notif: 30,
  langChevron: 18,
  search: 20,
  searchClear: 20,
};

export const tabletHeaderStyles = StyleSheet.create({
  inner: { paddingHorizontal: 24, paddingVertical: 16 },
  backSlot: { width: 38, height: 38 },
  logo: { width: 150, height: 54 },
  notifBtn: { width: 52, height: 52, borderRadius: 26, marginLeft: 12 },
  langBtn: { paddingHorizontal: 16, paddingVertical: 9, minWidth: 60, gap: 5 },
  langText: { fontSize: 16 },
  searchBar: { paddingHorizontal: 16, paddingVertical: 14, marginHorizontal: 24, marginBottom: 14 },
  searchInput: { fontSize: 16 },
  langDropdown: { minWidth: 200 },
  langOption: { paddingHorizontal: 18, paddingVertical: 16 },
  langOptionText: { fontSize: 16 },
});

export const TABLET_LANG_DROPDOWN_TOP_OFFSET = 68;

export const TABLET_MODAL_ICON_SIZES = {
  zoomClose: 26,
  videoClose: 26,
  filterClose: 24,
  filterCheckbox: 24,
  filterPin: 22,
  filterSearch: 22,
  filterClear: 20,
  shareIcon: 32,
};

export const tabletModalStyles = StyleSheet.create({
  zoomCloseBtn: { width: 48, height: 48, borderRadius: 24 },
  zoomHeaderTitle: { fontSize: 17 },
  zoomCounter: { fontSize: 15 },
  zoomThumb: { width: 72, height: 72, borderRadius: 10 },

  videoBackdrop: { padding: 32 },
  videoPlayer: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  videoCloseBtn: { width: 44, height: 44, borderRadius: 22 },

  filterSheet: { maxWidth: 480, marginHorizontal: 'auto', bottom: '8%', height: '78%', borderRadius: 24 },
  filterSheetTitle: { fontSize: 19 },
  filterSearchBox: { paddingVertical: 14 },
  filterSearchInput: { fontSize: 17 },
  filterOption: { paddingVertical: 18 },
  filterOptionText: { fontSize: 17 },
  filterFooterBtn: { paddingVertical: 16 },
  filterApplyText: { fontSize: 16 },
  filterClearText: { fontSize: 16 },

  shareSheet: { alignSelf: 'center', width: '100%', maxWidth: 480, borderRadius: 24, paddingHorizontal: 32 },
  shareIconWrap: { width: 72, height: 72, borderRadius: 20 },
  shareLabel: { fontSize: 13 },
  shareHeading: { fontSize: 18 },
  shareSub: { fontSize: 14 },
});
