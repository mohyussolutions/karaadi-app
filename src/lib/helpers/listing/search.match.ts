import {
  REGEX_SEARCH_CLEAN, REGEX_SEARCH_SPLIT, REGEX_THOUSANDS_COMMA, SEARCH_MAX_KEYWORDS, SEARCH_PRICE_TOLERANCE,
} from '../../../actions/constants';
import type { SearchQuery, SearchableListing } from '../../../utils/types';

const toNumber = (word: string) => Number(word.replace(REGEX_THOUSANDS_COMMA, ''));

function parseSearchQuery(query: string): SearchQuery {
  const words = query.trim().split(REGEX_SEARCH_SPLIT).map((word) => word.trim().replace(REGEX_SEARCH_CLEAN, ''));
  const keywords = Array.from(new Set(words.filter(Boolean))).slice(0, SEARCH_MAX_KEYWORDS);
  const priceWord = keywords.find((word) => !Number.isNaN(toNumber(word)));
  return { keywords, priceValue: priceWord ? toNumber(priceWord) : null };
}

function matchesPrice(item: SearchableListing, priceValue: number | null): boolean {
  if (!priceValue) return false;
  if (item.salary != null) return item.salary >= priceValue;
  const price = Number(item.price);
  return price >= priceValue * (1 - SEARCH_PRICE_TOLERANCE) && price <= priceValue * (1 + SEARCH_PRICE_TOLERANCE);
}

function matchesWord(item: SearchableListing, word: string): boolean {
  const needle = word.toLowerCase();
  return [item.title, item.description, item.city, item.region, item.brand, item.make, item.type]
    .some((field) => typeof field === 'string' && field.toLowerCase().includes(needle));
}

function matchesSearch(item: SearchableListing, search: SearchQuery): boolean {
  if (!search.keywords.length) return true;
  return search.keywords.every((word) => matchesWord(item, word) || matchesPrice(item, search.priceValue));
}

export function filterBySearch<T extends SearchableListing>(items: T[], query: string): T[] {
  const search = parseSearchQuery(query);
  return search.keywords.length ? items.filter((item) => matchesSearch(item, search)) : items;
}
