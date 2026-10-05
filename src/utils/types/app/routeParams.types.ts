export type IdParams = {
  id: string;
};

export type OptionalIdParams = {
  id?: string;
};

export type EmailParams = {
  email: string;
};

export type CategoryParams = {
  category: string;
};

export type SubcategoryParams = CategoryParams & {
  subcategory: string;
};

export type VehicleParams = IdParams & {
  category: string;
};

export type ReportParams = IdParams & {
  itemType?: string;
};

export type ChatParams = {
  chatId?: string;
  userId?: string;
  username?: string;
  listingId?: string;
  listingType?: string;
};
