import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { tmdb }  from '../api/tmdb';
import styles from './Media.module.css';

const GENRES_MOVIE = [
  { id: 28, name: 'Action' },  { id: 35, name: 'Comedy' },
  { id: 27, name: 'Horror' },  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' }, { id: 53, name: 'Thriller' },
  { id: 18, name: 'Drama' },   { id: 16, name: 'Animation' },
  { id: 12, name: 'Adventure' },{ id: 10751, name: 'Family' },
];
const GENRES_TV = [
  { id: 10759, name: 'Action' },{ id: 35, name: 'Comedy' },
  { id: 18,   name: 'Drama' },  { id: 10765, name: 'Sci-Fi' },
  { id: 9648, name: 'Mystery' },{ id: 10762, name: 'Kids' },
  { id: 16,   name: 'Anime' },  { id: 80,   name: 'Crime' },
];

const Media = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';

  const [tab,     setTab]     = useState('movies');
  const [genre,   setGenre]   = useState(null);
  const [items,   setItems]   = useState([]);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1); setItems([]);
    if (query) setTab('search');
  }, [query]);

  useEffect(() => {
    if (tab === 'search' && !query) return;
    setLoading(true);

    let endpoint, params = { page };

    if (tab === 'search' && query) {
      endpoint = '/search/multi';
      params.query = query;
    } else if (tab === 'movies') {
      endpoint = genre
        ? '/discover/movie'
        : '/movie/popular';
      if (genre) params.with_genres = genre;
    } else {
      endpoint = genre
        ? '/discover/tv'
        : '/tv/popular';
      if (genre) params.with_genres = genre;
    }

    tmdb(endpoint, params).then(d => {
      setItems(prev => page === 1 ? d.results : [...prev, ...d.results]);
      setTotal(d.total_pages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [tab, genre, page, query]);

  const switchTab = (t) => {
    setTab(t); setGenre(null); setPage(1); setItems([]);
  };

  const genres = tab === 'tv' ? GENRES_TV : GENRES_MOVIE;
  const typeFor = tab === 'tv' ? 'tv' : 'movie';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        {query ? (
          <h1 className={styles.heading}>Results for "<span>{query}</span>"</h1>
        ) : (
          <h1 className={styles.heading}>Browse Media</h1>
        )}

        {/* Tabs */}
        {!query && (
          <div className={styles.tabs}>
            {['movies','tv'].map(t => (
              <button
                key={t}
                className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                onClick={() => switchTab(t)}
              >
                {t === 'movies' ? '🎬 Movies' : '📺 TV Shows'}
              </button>
            ))}
          </div>
        )}

        {/* Genres */}
        {!query && (
          <div className={styles.genres}>
            <button
              className={`${styles.genreBtn} ${!genre ? styles.genreActive : ''}`}
              onClick={() => { setGenre(null); setPage(1); setItems([]); }}
            >All</button>
            {genres.map(g => (
              <button
                key={g.id}
                className={`${styles.genreBtn} ${genre === g.id ? styles.genreActive : ''}`}
                onClick={() => { setGenre(g.id); setPage(1); setItems([]); }}
              >{g.name}</button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {items.map(item => (
          <MediaCard
            key={`${item.id}-${item.media_type || typeFor}`}
            item={item}
            type={item.media_type || typeFor}
          />
        ))}
        {loading && Array.from({length: 12}).map((_,i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>

      {/* Load more */}
      {!loading && page < total && items.length > 0 && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadBtn}
            onClick={() => setPage(p => p + 1)}
          >Load More</button>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className={styles.empty}>
          <span>🎬</span>
          <p>No results found</p>
        </div>
      )}
    </div>
  );
};

export default Media;
