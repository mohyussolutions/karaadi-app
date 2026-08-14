export type ListingRoute =
  | { pathname: '/listing/vehicle/[id]'; params: { id: string; category: string } }
  | { pathname: '/listing/real-estate/[id]'; params: { id: string } }
  | { pathname: '/listing/job/[id]'; params: { id: string } }
  | { pathname: '/listing/item-detail/[id]'; params: { id: string } };
