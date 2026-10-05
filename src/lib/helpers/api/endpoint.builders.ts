export const withId = (base: string) => (id: string | number) => `${base}/${id}`;

export const withIdSuffix = (base: string, suffix: string) => (id: string | number) =>
  `${base}/${id}/${suffix}`;

export function createCrudEndpoints(base: string) {
  return {
    LIST: base,
    BY_ID: withId(base),
    CREATE: base,
    UPDATE: withId(base),
    DELETE: withId(base),
  };
}
