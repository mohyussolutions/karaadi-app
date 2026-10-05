import { Platform } from "react-native";
import { ROUTES, MODAL_ANIMATION } from "../../actions/constants";
import type {
  RootStackScreenConfig,
  StackScreenBaseOptions,
} from "../../utils/types";

const toScreenName = (route: string) => route.slice(1);

const PLAIN: StackScreenBaseOptions = { headerShown: false };

const CARD: StackScreenBaseOptions = {
  headerShown: false,
  presentation: "card",
};

const DETAIL_MODAL: StackScreenBaseOptions = {
  headerShown: false,
  presentation: Platform.OS === "ios" ? "fullScreenModal" : "modal",
  animation: MODAL_ANIMATION,
  gestureEnabled: true,
  gestureDirection: "vertical",
};

const SHEET_MODAL: StackScreenBaseOptions = {
  headerShown: false,
  presentation: "modal",
  animation: MODAL_ANIMATION,
};

const DETAIL_ROUTES = [
  ROUTES.vehicleDetail,
  ROUTES.itemDetail,
  ROUTES.realEstateDetail,
  ROUTES.jobDetail,
  ROUTES.subscriptionDetail,
];

export const ROOT_STACK_SCREENS: RootStackScreenConfig[] = [
  { name: "(tabs)", options: PLAIN },
  { name: "(auth)", options: PLAIN, contentPadding: "auth" },
  { name: toScreenName(ROUTES.chat), options: PLAIN, contentPadding: "zero" },
  ...DETAIL_ROUTES.map(
    (route): RootStackScreenConfig => ({
      name: toScreenName(route),
      options: DETAIL_MODAL,
      contentPadding: "zero",
    }),
  ),
  {
    name: toScreenName(ROUTES.report),
    options: SHEET_MODAL,
    contentPadding: "zero",
  },
  { name: `${toScreenName(ROUTES.browseCategory)}/index`, options: PLAIN },
  { name: toScreenName(ROUTES.browseSubcategory), options: PLAIN },
  { name: toScreenName(ROUTES.businessDetail), options: CARD },
];
