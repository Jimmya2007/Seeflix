import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { img } from '../api/tmdb';
import styles from './MediaCard.module.css';

const MediaCard = ({ item, type = 'movie' }) => {
  const [hovered, setHovered] = useState(false);
  const [imgErr,  setImgErr]  = useState(false);
  const navigate = useNavigate();

  const title   = item.title || item.name;
  const year    = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating  = item.vote_average?.toFixed(1);
  const poster  = img(item.poster_path);
  const mediaType = item.media_type || type;

  const handleClick = () => navigate(`/watch/${mediaType}/${item.id}`);

  return (
    <div
      className={`${styles.card} ${hovered ? styles.hovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div className={styles.imgWrap}>
        {poster && !imgErr ? (
          <img
            src={poster}
            alt={title}
            className={styles.img}
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={styles.imgFallback}>
            <span>🎬</span>
            <span>{title}</span>
          </div>
        )}

        <div className={styles.overlay}>
          <div className={styles.playBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
          <span className={styles.watchLabel}>Watch Now</span>
        </div>

        {rating && (
          <div className={styles.rating}>
            <span className={styles.star}>★</span>{rating}
          </div>
        )}

        <div className={styles.typeBadge}>
          {mediaType === 'tv' ? 'TV' : 'FILM'}
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        {year && <p className={styles.year}>{year}</p>}
      </div>
    </div>
  );
};

export default MediaCard;
