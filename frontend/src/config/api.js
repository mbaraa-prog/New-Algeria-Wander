// VITE_API_URL can be set with or without /api suffix — we normalise here
const _rawApiUrl = import.meta.env.VITE_API_URL || 'https://algeria-wander-hods.onrender.com';
// Strip trailing /api or /api/ so BASE_URL is always the bare domain
const BASE_URL = _rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

export const API_BASE_URL = BASE_URL;
export const API_URL = `${BASE_URL}/api`;
export const MEDIA_URL = `${BASE_URL}/media`;

export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.replace(/^\/+/, '');
  return `${MEDIA_URL}/${cleanPath}`;
};

export const getBackendAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.replace(/^\/+/, '');
  return `${BASE_URL}/${cleanPath}`;
};

export const getImageUrl = (entity) => {
  if (!entity) return 'https://via.placeholder.com/1200?text=No+Image';

  let path = null;

  if (typeof entity === 'object') {
    path = entity.external_image_url ||
      entity.cover_image ||
      entity.image ||
      entity.background_image ||
      entity.avatar ||
      (entity.images && entity.images.length > 0 && entity.images[0].image) ||
      entity.featured_image ||
      entity.photo ||
      entity.picture;
  } else if (typeof entity === 'string') {
    path = entity;
  }

  if (!path) return 'https://via.placeholder.com/1200?text=Image+Coming+Soon';

  if (path.startsWith('http')) return path;

  let cleanPath = path.replace(/^\/+/, '');

  if (cleanPath.startsWith('media/')) {
    return `${BASE_URL}/${cleanPath}`;
  }

  return `${BASE_URL}/media/${cleanPath}`;
};