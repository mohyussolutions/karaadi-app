import { useMemo } from 'react';
import type { DropdownOption } from '../util/types';

function normalize(opt: string | DropdownOption): DropdownOption {
  return typeof opt === 'string' ? { label: opt, value: opt } : opt;
}

export function useDropdownOptions(options: (string | DropdownOption)[], search: string) {
  const normalized = useMemo(() => options.map(normalize), [options]);

  const filtered = useMemo(() => (
    search.trim()
      ? normalized.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
      : normalized
  ), [normalized, search]);

  return { normalized, filtered };
}
