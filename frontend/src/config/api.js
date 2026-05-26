export const BASE_URL = 'https://algeria-wander-hods.onrender.com';
export const API_URL = `${BASE_URL}/api`;
export const MEDIA_URL = `${BASE_URL}/media`;

export const getMediaUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${MEDIA_URL}/${path.replace(/^\/+/, '')}`;
};

export const getBackendAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
};
