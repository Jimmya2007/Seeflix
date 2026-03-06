// TMDB free API key (public read-only)
export const TMDB_KEY  = '5fbddf6b517048e25bc3ac1bbeafb919';
export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const IMG_BASE  = 'https://image.tmdb.org/t/p';

// Image quality options: w300, w500, w780, w1280, original
export const img = (path, size = 'w780') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

// High quality image for backdrops and hero sections
export const imgHQ = (path) =>
  path ? `${IMG_BASE}/original${path}` : null;

export const tmdb = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', TMDB_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
};

// Embed sources - multiple providers with multi-language support
// Most sources have built-in language/subtitle selectors in their players
export const EMBED_SOURCES = [
  {
    name: 'VidSrc Pro',
    desc: 'Multi-lang subs',
    movie: (id, lang) => `https://vidsrc.pro/embed/movie/${id}`,
    tv: (id, s, e, lang) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidSrc.cc',
    desc: 'Multi-audio',
    movie: (id, lang) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id, s, e, lang) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'Embed.su',
    desc: 'Multi-lang',
    movie: (id, lang) => `https://embed.su/embed/movie/${id}`,
    tv: (id, s, e, lang) => `https://embed.su/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'SuperEmbed',
    desc: 'FR/ES/DE subs',
    movie: (id, lang) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id, s, e, lang) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
  },
  {
    name: 'VidBinge',
    desc: 'Multi-lang',
    movie: (id, lang) => `https://vidbinge.dev/embed/movie/${id}`,
    tv: (id, s, e, lang) => `https://vidbinge.dev/embed/tv/${id}/${s}/${e}`
  },
  {
    name: '2Embed',
    desc: 'Multi-subs',
    movie: (id, lang) => `https://www.2embed.skin/embed/${id}`,
    tv: (id, s, e, lang) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`
  },
  {
    name: 'SmashyStream',
    desc: 'Multi-audio',
    movie: (id, lang) => `https://player.smashy.stream/movie/${id}`,
    tv: (id, s, e, lang) => `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`
  },
  {
    name: 'MoviesAPI',
    desc: 'Multi-lang',
    movie: (id, lang) => `https://moviesapi.club/movie/${id}`,
    tv: (id, s, e, lang) => `https://moviesapi.club/tv/${id}-${s}-${e}`
  }
];

export const getPlayerUrl = (source, type, id, season = 1, episode = 1, lang = 'en') => {
  const src = EMBED_SOURCES[source] || EMBED_SOURCES[0];
  return type === 'tv' ? src.tv(id, season, episode, lang) : src.movie(id, lang);
};
