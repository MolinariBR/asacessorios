export const MAX_PRODUCT_IMAGES = 5;

const IMAGE_SEPARATOR_REGEX = /[\n,;]+/;

export function parseProductImageList(rawValue: string | null | undefined): string[] {
  if (!rawValue) return [];
  const normalized = rawValue
    .split(IMAGE_SEPARATOR_REGEX)
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set(normalized)];
}

export function serializeProductImageList(images: string[]): string {
  const normalized = images.map((value) => value.trim()).filter(Boolean);
  const unique = [...new Set(normalized)];
  return unique.join('\n');
}

export function getPrimaryProductImage(rawValue: string | null | undefined): string {
  return parseProductImageList(rawValue)[0] ?? '/placeholder.svg';
}
