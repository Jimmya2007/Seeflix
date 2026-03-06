import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, img, playerUrl } from '../api/tmdb';
import MediaRow from '../components/MediaRow';
import styles from './Watch.module.css';

const Watch = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [detail,   setDetail]   = useState(null);
  const [season,   setSeason]   = useState(1);
  const [episode,  setEpisode]  = useState(1);
  const [related,  setRelated]  = useState([]);
  const [seasons,  setSeasons]  = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const endpoint = type === 'tv' ? `/tv/${id}` : `/movie/${id}`;
    tmdb(endpoint, { append_to_response: 'credits' }).then(d => {
      setDetail(d);
      if (type === 'tv') setSeasons(d.seasons || []);
    });
    tmdb(`/${type === 'tv' ? 'tv' : 'movie'}/${id}/similar`)
      .then(d => setRelated(d.results?.slice(0, 12) || []));
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
  const playerSrc = type === 'tv'
    ? `${playerUrl('tv', id)}/${season}/${episode}`
    : playerUrl('movie', id);

  return (
    <div className={styles.page}>
      {/* Player */}
      <div className={styles.playerWrap}>
        <iframe
          key={playerSrc}
          src={playerSrc}
          className={styles.player}
          allowFullScreen
          allow="autoplay; fullscreen"
          title={title}
        />
      </div>

      <div className={styles.body}>
        {/* Info */}
        <div className={styles.info}>
          <button className={styles.back} onClick={() => navigate(-1)}>
            ← Back
          </button>

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
    </div>
  );
};

export default Watch;
