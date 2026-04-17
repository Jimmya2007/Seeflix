// TMDB API key from environment variable
export const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || '5fbddf6b517048e25bc3ac1bbeafb919';
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

// Embed sources - 15+ providers for maximum coverage
// Most sources have built-in language/subtitle selectors in their players
export const EMBED_SOURCES = [
  {
    name: 'VidSrc Pro',
    desc: 'Multi-lang',
    movie: (id) => `https://vidsrc.pro/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidSrc.cc',
    desc: 'HD Quality',
    movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidSrc.icu',
    desc: 'Fast',
    movie: (id) => `https://vidsrc.icu/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.icu/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'Embed.su',
    desc: 'Multi-lang',
    movie: (id) => `https://embed.su/embed/movie/${id}`,
    tv: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidLink',
    desc: 'HD',
    movie: (id) => `https://vidlink.pro/movie/${id}`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidBinge',
    desc: 'Multi-lang',
    movie: (id) => `https://vidbinge.dev/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidbinge.dev/embed/tv/${id}/${s}/${e}`
  },
  {
    name: '2Embed',
    desc: 'Multi-subs',
    movie: (id) => `https://www.2embed.skin/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`
  },
  {
    name: 'SuperEmbed',
    desc: 'FR/ES/DE',
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
  },
  {
    name: 'SmashyStream',
    desc: 'Multi-audio',
    movie: (id) => `https://player.smashy.stream/movie/${id}`,
    tv: (id, s, e) => `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`
  },
  {
    name: 'MoviesAPI',
    desc: 'Large DB',
    movie: (id) => `https://moviesapi.club/movie/${id}`,
    tv: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`
  },
  {
    name: 'VidSrc.xyz',
    desc: 'Stable',
    movie: (id) => `https://vidsrc.xyz/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'VidSrc.in',
    desc: 'Fast',
    movie: (id) => `https://vidsrc.in/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.in/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'AutoEmbed',
    desc: 'Multi-src',
    movie: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    tv: (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`
  },
  {
    name: 'NontonGo',
    desc: 'Asian+',
    movie: (id) => `https://www.NontonGo.win/embed/movie/${id}`,
    tv: (id, s, e) => `https://www.NontonGo.win/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'Rive',
    desc: '4K HDR',
    movie: (id) => `https://rivestream.live/embed?type=movie&id=${id}`,
    tv: (id, s, e) => `https://rivestream.live/embed?type=tv&id=${id}&season=${s}&episode=${e}`
  },
  {
    name: 'FilmXY',
    desc: 'Multi-lang',
    movie: (id) => `https://filmxy.wafflehacker.io/embed/movie/${id}`,
    tv: (id, s, e) => `https://filmxy.wafflehacker.io/embed/tv/${id}/${s}/${e}`
  }
];

export const getPlayerUrl = (source, type, id, season = 1, episode = 1, lang = 'en') => {
  const src = EMBED_SOURCES[source] || EMBED_SOURCES[0];
  return type === 'tv' ? src.tv(id, season, episode, lang) : src.movie(id, lang);
};
