// Torrent search APIs - using public torrent APIs
const TORRENT_APIS = {
  // YTS API for movies (high quality, small size)
  yts: {
    search: async (query) => {
      try {
        const res = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(query)}&limit=10`);
        const data = await res.json();
        if (data.status === 'ok' && data.data.movies) {
          return data.data.movies.map(m => ({
            title: m.title,
            year: m.year,
            quality: m.torrents?.[0]?.quality || '720p',
            size: m.torrents?.[0]?.size || 'N/A',
            seeds: m.torrents?.[0]?.seeds || 0,
            magnet: m.torrents?.[0]?.hash ? 
              `magnet:?xt=urn:btih:${m.torrents[0].hash}&dn=${encodeURIComponent(m.title)}&tr=udp://tracker.opentrackr.org:1337&tr=udp://tracker.openbittorrent.com:6969` : null,
            hash: m.torrents?.[0]?.hash,
            poster: m.medium_cover_image
          }));
        }
        return [];
      } catch (e) {
        console.error('YTS API error:', e);
        return [];
      }
    },
    getByImdb: async (imdbId) => {
      try {
        const res = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`);
        const data = await res.json();
        if (data.status === 'ok' && data.data.movies?.[0]) {
          const m = data.data.movies[0];
          return m.torrents?.map(t => ({
            quality: t.quality,
            type: t.type,
            size: t.size,
            seeds: t.seeds,
            peers: t.peers,
            hash: t.hash,
            magnet: `magnet:?xt=urn:btih:${t.hash}&dn=${encodeURIComponent(m.title)}&tr=udp://tracker.opentrackr.org:1337&tr=udp://tracker.openbittorrent.com:6969&tr=udp://exodus.desync.com:6969&tr=udp://tracker.torrent.eu.org:451`
          })) || [];
        }
        return [];
      } catch (e) {
        console.error('YTS API error:', e);
        return [];
      }
    }
  }
};

// Get torrents for a movie by IMDB ID
export const getTorrentsForMovie = async (imdbId) => {
  if (!imdbId) return [];
  return TORRENT_APIS.yts.getByImdb(imdbId);
};

// Search torrents by query
export const searchTorrents = async (query) => {
  return TORRENT_APIS.yts.search(query);
};
