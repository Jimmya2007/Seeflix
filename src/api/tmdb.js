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

// Embed sources - multiple providers for better coverage
export const EMBED_SOURCES = [
  {
    name: 'VidSrc',
    movie: (id) => `https://vidsrc.xyz/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidSrc.to',
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
  },
  {
    name: '2Embed',
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
  },
  {
    name: 'SuperEmbed',
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
  },
  {
    name: 'VidLink',
    movie: (id) => `https://vidlink.pro/movie/${id}`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`
  }
];

export const getPlayerUrl = (source, type, id, season = 1, episode = 1) => {
  const src = EMBED_SOURCES[source] || EMBED_SOURCES[0];
  return type === 'tv' ? src.tv(id, season, episode) : src.movie(id);
};
