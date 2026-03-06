import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, img, EMBED_SOURCES, getPlayerUrl } from '../api/tmdb';
import { getTorrentsForMovie } from '../api/torrent';
import MediaRow from '../components/MediaRow';
import TorrentPlayer from '../components/TorrentPlayer';
import styles from './Watch.module.css';

const Watch = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [detail,   setDetail]   = useState(null);
  const [season,   setSeason]   = useState(1);
  const [episode,  setEpisode]  = useState(1);
  const [related,  setRelated]  = useState([]);
  const [seasons,  setSeasons]  = useState([]);
  const [source,   setSource]   = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [torrents, setTorrents] = useState([]);
  const [showTorrent, setShowTorrent] = useState(false);
  const [selectedMagnet, setSelectedMagnet] = useState(null);
  const [loadingTorrents, setLoadingTorrents] = useState(false);
  const playerWrapRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const endpoint = type === 'tv' ? `/tv/${id}` : `/movie/${id}`;
    tmdb(endpoint, { append_to_response: 'credits' }).then(d => {
      setDetail(d);
      if (type === 'tv') setSeasons(d.seasons || []);
    });
    tmdb(`/${type === 'tv' ? 'tv' : 'movie'}/${id}/similar`)
      .then(d => setRelated(d.results?.slice(0, 12) || []));
    
    // Load torrents for movies
    if (type === 'movie') {
      tmdb(`/movie/${id}/external_ids`).then(async (ids) => {
        if (ids.imdb_id) {
          setLoadingTorrents(true);
          const t = await getTorrentsForMovie(ids.imdb_id);
          setTorrents(t);
          setLoadingTorrents(false);
        }
      }).catch(() => {});
    }
  }, [type, id]);

  if (!detail) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>Loading...</p>
    </div>
  );

  const title    = detail.title || detail.name;
  const year     = (detail.release_date || detail.first_air_date || '').slice(0, 4);
  const runtime  = detail.runtime || (detail.episode_run_time?.[0]);
  const genres   = detail.genres?.map(g => g.name).join(' • ') || '';
  const cast     = detail.credits?.cast?.slice(0, 6).map(c => c.name).join(', ');
  const director = detail.credits?.crew?.find(c => c.job === 'Director')?.name;

  // Build player src
  const playerSrc = getPlayerUrl(source, type, id, season, episode);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerWrapRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={styles.page}>
      {/* Player */}
      <div className={`${styles.playerWrap} ${isFullscreen ? styles.fullscreen : ''}`} ref={playerWrapRef}>
        <iframe
          key={playerSrc}
          src={playerSrc}
          className={styles.player}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          title={title}
        />
        <button 
          className={styles.fullscreenBtn} 
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          )}
        </button>
      </div>

      <div className={styles.body}>
        {/* Info */}
        <div className={styles.info}>
          <button className={styles.back} onClick={() => navigate(-1)}>
            ← Back
          </button>

          {/* Source selector */}
          <div className={styles.sourceSelector}>
            <label>Source:</label>
            <div className={styles.sourceButtons}>
              {EMBED_SOURCES.map((src, i) => (
                <button
                  key={src.name}
                  className={`${styles.sourceBtn} ${source === i ? styles.active : ''}`}
                  onClick={() => setSource(i)}
                  title={src.desc}
                >
                  {src.name}
                  <span className={styles.sourceLang}>{src.desc}</span>
                </button>
              ))}
            </div>
            <p className={styles.sourceHint}>
              💡 Chaque lecteur a ses propres options de langue/sous-titres dans les paramètres vidéo
            </p>
          </div>

          {/* Torrent section for movies */}
          {type === 'movie' && (
            <div className={styles.torrentSection}>
              <h3 className={styles.torrentTitle}>🎬 Torrent (P2P)</h3>
              {loadingTorrents && <p className={styles.torrentLoading}>Searching torrents...</p>}
              {!loadingTorrents && torrents.length === 0 && (
                <p className={styles.torrentNone}>No torrents found for this movie</p>
              )}
              {torrents.length > 0 && (
                <div className={styles.torrentList}>
                  {torrents.map((t, i) => (
                    <button
                      key={i}
                      className={styles.torrentBtn}
                      onClick={() => { setSelectedMagnet(t.magnet); setShowTorrent(true); }}
                    >
                      <span className={styles.torrentQuality}>{t.quality}</span>
                      <span className={styles.torrentSize}>{t.size}</span>
                      <span className={styles.torrentSeeds}>🌱 {t.seeds}</span>
                    </button>
                  ))}
                </div>
              )}
              <p className={styles.torrentHint}>
                ⚠️ Torrent streaming uses P2P. May be slow to start.
              </p>
            </div>
          )}

          <div className={styles.meta}>
            {detail.vote_average > 0 && (
              <span className={styles.rating}>★ {detail.vote_average.toFixed(1)}</span>
            )}
            {year && <span className={styles.pill}>{year}</span>}
            {runtime && <span className={styles.pill}>{runtime} min</span>}
            {detail.original_language && (
              <span className={styles.pill}>{detail.original_language.toUpperCase()}</span>
            )}
          </div>

          <h1 className={styles.title}>{title}</h1>
          {genres && <p className={styles.genres}>{genres}</p>}
          <p className={styles.overview}>{detail.overview}</p>

          {cast && (
            <p className={styles.castLine}>
              <span className={styles.label}>Cast:</span> {cast}
            </p>
          )}
          {director && (
            <p className={styles.castLine}>
              <span className={styles.label}>Director:</span> {director}
            </p>
          )}
        </div>

        {/* Season/Episode picker for TV */}
        {type === 'tv' && seasons.length > 0 && (
          <div className={styles.picker}>
            <h3 className={styles.pickerTitle}>Episodes</h3>
            <div className={styles.pickerRow}>
              <div className={styles.selectWrap}>
                <label>Season</label>
                <select
                  value={season}
                  onChange={e => { setSeason(+e.target.value); setEpisode(1); }}
                  className={styles.select}
                >
                  {seasons
                    .filter(s => s.season_number > 0)
                    .map(s => (
                      <option key={s.season_number} value={s.season_number}>
                        Season {s.season_number}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.selectWrap}>
                <label>Episode</label>
                <select
                  value={episode}
                  onChange={e => setEpisode(+e.target.value)}
                  className={styles.select}
                >
                  {Array.from({ length: seasons.find(s => s.season_number === season)?.episode_count || 12 },
                    (_, i) => i + 1
                  ).map(ep => (
                    <option key={ep} value={ep}>Episode {ep}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className={styles.related}>
            <MediaRow title="You May Also Like" items={related} type={type} />
          </div>
        )}
      </div>

      {/* Torrent Player Modal */}
      {showTorrent && selectedMagnet && (
        <TorrentPlayer 
          magnet={selectedMagnet} 
          onClose={() => { setShowTorrent(false); setSelectedMagnet(null); }} 
        />
      )}
    </div>
  );
};

export default Watch;
