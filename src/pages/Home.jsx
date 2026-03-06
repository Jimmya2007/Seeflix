import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MediaRow   from '../components/MediaRow';
import { tmdb }   from '../api/tmdb';
import styles from './Home.module.css';

const Home = () => {
  const [data, setData] = useState({
    trending:     [],
    topMovies:    [],
    topTV:        [],
    action:       [],
    comedy:       [],
    horror:       [],
    anime:        [],
    bollywood:    [],
  });

  useEffect(() => {
    const load = async () => {
      const [trending, topMovies, topTV, action, comedy, horror, anime] = await Promise.all([
        tmdb('/trending/all/week'),
        tmdb('/movie/popular', { page: 1 }),
        tmdb('/tv/popular',    { page: 1 }),
        tmdb('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc' }),
        tmdb('/discover/movie', { with_genres: '35', sort_by: 'popularity.desc' }),
        tmdb('/discover/movie', { with_genres: '27', sort_by: 'popularity.desc' }),
        tmdb('/discover/tv',    { with_genres: '16', with_origin_country: 'JP' }),
      ]);
      setData({
        trending:  trending.results,
        topMovies: topMovies.results,
        topTV:     topTV.results,
        action:    action.results,
        comedy:    comedy.results,
        horror:    horror.results,
        anime:     anime.results,
      });
    };
    load();
  }, []);

  return (
    <div>
      <HeroBanner />
      <div className={styles.rows}>
        <MediaRow title="🔥 Trending This Week" items={data.trending} />
        <MediaRow title="🎬 Popular Movies"     items={data.topMovies} type="movie" />
        <MediaRow title="📺 Popular TV Shows"   items={data.topTV}     type="tv" />
        <MediaRow title="💥 Action & Adventure" items={data.action}    type="movie" />
        <MediaRow title="😂 Comedy"             items={data.comedy}    type="movie" />
        <MediaRow title="😱 Horror"             items={data.horror}    type="movie" />
        <MediaRow title="🎌 Anime"              items={data.anime}     type="tv" />
      </div>
    </div>
  );
};

export default Home;
