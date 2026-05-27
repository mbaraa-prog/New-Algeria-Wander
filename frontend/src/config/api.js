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

export const getImageUrl = (entity) => {
  if (!entity) return 'https://via.placeholder.com/1200';
  
  const path = entity.external_image_url || entity.cover_image || entity.image || entity.background_image || (entity.images?.[0]?.image);
  
  if (!path) return 'https://via.placeholder.com/1200';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${BASE_URL}${path}`;
  if (path.startsWith('media/')) return `${BASE_URL}/${path}`;
  
  return `${MEDIA_URL}/${path.replace(/^\/+/, '')}`;
};
