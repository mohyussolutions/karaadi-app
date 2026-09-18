import type { ComponentProps } from "react";
import type { Stack } from "expo-router";
import { ROUTES } from "../../constants/constants";

type StackScreenOptions = ComponentProps<typeof Stack.Screen>["options"];
const bare = (route: string) => route.slice(1);

export type ContentPadding = "default" | "zero" | "auth";

export interface RootStackScreenConfig {
  name: string;
  options: Omit<StackScreenOptions, "contentStyle">;
  contentPadding?: ContentPadding;
}

const MODAL_DETAIL_OPTIONS: Omit<StackScreenOptions, "contentStyle"> = {
  headerShown: false,
  presentation: "modal",
  animation: "slide_from_bottom",
  gestureEnabled: true,
  gestureDirection: "vertical",
};

export const ROOT_STACK_SCREENS: RootStackScreenConfig[] = [
  { name: "(tabs)", options: { headerShown: false } },
  { name: "(auth)", options: { headerShown: false }, contentPadding: "auth" },
  { name: bare(ROUTES.chat), options: { headerShown: false }, contentPadding: "zero" },
  { name: bare(ROUTES.vehicleDetail), options: MODAL_DETAIL_OPTIONS, contentPadding: "zero" },
  { name: bare(ROUTES.itemDetail), options: MODAL_DETAIL_OPTIONS, contentPadding: "zero" },
  { name: bare(ROUTES.realEstateDetail), options: MODAL_DETAIL_OPTIONS, contentPadding: "zero" },
  { name: bare(ROUTES.jobDetail), options: MODAL_DETAIL_OPTIONS, contentPadding: "zero" },
  { name: bare(ROUTES.subscriptionDetail), options: MODAL_DETAIL_OPTIONS, contentPadding: "zero" },
  {
    name: bare(ROUTES.report),
    options: { headerShown: false, presentation: "modal", animation: "slide_from_bottom" },
    contentPadding: "zero",
  },
  { name: "browse/[category]/index", options: { headerShown: false } },
  { name: bare(ROUTES.browseSubcategory), options: { headerShown: false } },
  { name: "business/[id]", options: { headerShown: false, presentation: "card" } },
];
