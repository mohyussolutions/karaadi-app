import type { CategorySpecField } from '../../util/types';

export function buildSpecItems(
  item: any,
  fields: CategorySpecField[],
  t: (key: string) => string,
): { label: string; value: string; icon?: string }[] {
  const seen = new Set<string>();
  const result: { label: string; value: string; icon?: string }[] = [];

  for (const field of fields) {
    const raw = item?.[field.key];
    if (raw === undefined || raw === null || raw === '') continue;
    const label = t(field.labelKey);
    if (seen.has(label)) continue;
    seen.add(label);
    result.push({
      label,
      value: field.format ? field.format(raw, t) : String(raw),
      icon: field.icon,
    });
  }
  return result;
}
