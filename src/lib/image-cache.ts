declare const __APP_BUILD_TIME__: string | undefined;

const DEFAULT_CACHE_VERSION = typeof __APP_BUILD_TIME__ !== 'undefined'
  ? String(__APP_BUILD_TIME__)
  : '1';

function isUrlCacheBypassCandidate(url: string): boolean {
  return Boolean(url) && !url.startsWith('data:') && !url.startsWith('blob:');
}

export function withCacheVersion(url: string, version: string = DEFAULT_CACHE_VERSION): string {
  if (!isUrlCacheBypassCandidate(url)) return url;
  if (/[?&]v=/.test(url)) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${version}`;
}

export function withUploadCacheVersion(url: string): string {
  return withCacheVersion(url, String(Date.now()));
}
