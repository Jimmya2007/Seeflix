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
    name: 'VidSrc Pro',
    movie: (id) => `https://vidsrc.pro/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidSrc.cc',
    movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidSrc.icu',
    movie: (id) => `https://vidsrc.icu/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.icu/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'Embed.su',
    movie: (id) => `https://embed.su/embed/movie/${id}`,
    tv: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'AutoEmbed',
    movie: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    tv: (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`
  },
  {
    name: 'SmashyStream',
    movie: (id) => `https://player.smashy.stream/movie/${id}`,
    tv: (id, s, e) => `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`
  },
  {
    name: 'NontonGo',
    movie: (id) => `https://www.NontonGo.win/embed/movie/${id}`,
    tv: (id, s, e) => `https://www.NontonGo.win/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'MoviesAPI',
    movie: (id) => `https://moviesapi.club/movie/${id}`,
    tv: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`
  }
];

export const getPlayerUrl = (source, type, id, season = 1, episode = 1) => {
  const src = EMBED_SOURCES[source] || EMBED_SOURCES[0];
  return type === 'tv' ? src.tv(id, season, episode) : src.movie(id);
};
