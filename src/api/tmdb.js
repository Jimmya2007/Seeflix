// TMDB free API key (public read-only)
export const TMDB_KEY  = '5fbddf6b517048e25bc3ac1bbeafb919';
export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const IMG_BASE  = 'https://image.tmdb.org/t/p';

export const img = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const tmdb = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', TMDB_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
};

// Embed URLs — free streaming sources with fallbacks
export const playerUrl = (type, id) =>
  `https://vidsrc.xyz/embed/${type}/${id}`;

export const playerUrlAlt = (type, id) =>
  `https://www.2embed.cc/embed/${id}`;
