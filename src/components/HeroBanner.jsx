import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdb, img } from '../api/tmdb';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  const [movies, setMovies]   = useState([]);
  const [idx,    setIdx]      = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    tmdb('/trending/all/week')
      .then(d => setMovies(d.results.slice(0, 6)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % movies.length), 7000);
    return () => clearInterval(t);
  }, [movies]);

  const current = movies[idx];
  if (!current) return <div className={styles.skeleton} />;

  const title = current.title || current.name;
  const type  = current.media_type || 'movie';
  const bg    = img(current.backdrop_path, 'original');
  const overview = current.overview?.slice(0, 180) + (current.overview?.length > 180 ? '...' : '');

  return (
    <div className={styles.hero}>
      {/* Background */}
      <div className={styles.bg} key={idx}>
        {bg && <img src={bg} alt={title} className={styles.bgImg} />}
        <div className={styles.gradients} />
      </div>

      {/* Content */}
      <div className={styles.content} key={`c-${idx}`}>
        <div className={styles.meta}>
          <span className={styles.badge}>{type === 'tv' ? 'TV Show' : 'Movie'}</span>
          {current.vote_average > 0 && (
            <span className={styles.rating}>
              <span>★</span> {current.vote_average.toFixed(1)}
            </span>
          )}
          <span className={styles.year}>
            {(current.release_date || current.first_air_date || '').slice(0, 4)}
          </span>
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.overview}>{overview}</p>

        <div className={styles.actions}>
          <button
            className={styles.btnWatch}
            onClick={() => navigate(`/watch/${type}/${current.id}`)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            Watch Now
          </button>
          <button
            className={styles.btnInfo}
            onClick={() => navigate(`/watch/${type}/${current.id}`)}
          >
            More Info
          </button>
        </div>
      </div>

      {/* Slide dots */}
      <div className={styles.dots}>
        {movies.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
