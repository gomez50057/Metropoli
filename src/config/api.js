const trimSlash = (value) => (value || '').replace(/\/+$/, '');

const joinUrl = (base, path = '') => {
  const cleanBase = trimSlash(base);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanBase ? `${cleanBase}${cleanPath}` : cleanPath;
};

const rawApiBase = trimSlash(process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL);
const rawApiOrigin = trimSlash(
  process.env.NEXT_PUBLIC_API_URL || (rawApiBase.endsWith('/api') ? rawApiBase.slice(0, -4) : rawApiBase)
);

export const API_BASE_URL = rawApiBase
  ? rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`
  : '';

export const API_ORIGIN_URL = rawApiOrigin;
export const ACUERDOS_API_BASE_URL = trimSlash(
  process.env.NEXT_PUBLIC_ACUERDOS_API_BASE_URL || joinUrl(API_BASE_URL, '/acuerdos-metropolitanos')
);

export const MEDIA_BASE_URL = trimSlash(process.env.NEXT_PUBLIC_MEDIA_BASE_URL);
export const SITE_URL = trimSlash(process.env.NEXT_PUBLIC_SITE_URL);
export const EXTERNAL_ASSETS_BASE_URL = trimSlash(process.env.NEXT_PUBLIC_EXTERNAL_ASSETS_BASE_URL);

export const apiUrl = (path = '') => joinUrl(API_BASE_URL, path);
export const apiOriginUrl = (path = '') => joinUrl(API_ORIGIN_URL, path);
export const acuerdosUrl = (path = '') => joinUrl(ACUERDOS_API_BASE_URL, path);
export const mediaUrl = (path = '') => joinUrl(MEDIA_BASE_URL, path);
export const externalAssetUrl = (path = '') => joinUrl(EXTERNAL_ASSETS_BASE_URL, path);
