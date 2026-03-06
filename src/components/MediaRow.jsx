import React from 'react';
import MediaCard from './MediaCard';
import styles from './MediaRow.module.css';

const MediaRow = ({ title, items = [], type = 'movie' }) => {
  if (!items.length) return null;
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.scroll}>
        <div className={styles.row}>
          {items.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              type={item.media_type || type}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaRow;
