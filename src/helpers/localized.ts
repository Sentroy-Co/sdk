import type { LocalizedString } from '../types';

/**
 * Çok dilli değeri tek dile indirger. Öncelik: istenen dil > "en" > ilk dil.
 */
export function resolveLocalized(
  value: LocalizedString | null | undefined,
  lang?: string,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (lang && value[lang]) return value[lang];
  if (value.en) return value.en;
  const firstKey = Object.keys(value)[0];
  return firstKey ? value[firstKey] : '';
}

/**
 * Değerin tüm mevcut dil anahtarlarını döner. Tek dil string ise `["en"]`.
 */
export function localizedLanguages(
  value: LocalizedString | null | undefined,
): string[] {
  if (!value) return [];
  if (typeof value === 'string') return value ? ['en'] : [];
  return Object.keys(value);
}

/**
 * Multilang olup olmadığını kontrol eder.
 */
export function isLocalizedMap(
  value: LocalizedString | null | undefined,
): value is Record<string, string> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
