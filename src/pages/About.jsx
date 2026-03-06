import React from 'react';
import styles from './About.module.css';

const About = () => (
  <div className={styles.page}>
    <div className={styles.container}>
      <div className={styles.hero}>
        <img src="/logo.svg" alt="Seeflix" className={styles.logo} />
        <h1 className={styles.title}>About Seeflix</h1>
        <p className={styles.sub}>Your free gateway to unlimited entertainment</p>
      </div>

      <div className={styles.grid}>
        {[
          { icon: '🎬', title: 'Our Mission', text: 'Seeflix is a free streaming discovery platform. We connect you to thousands of movies and TV shows from around the world, all in one place.' },
          { icon: '🌍', title: 'Global Access', text: 'Whether you love Hollywood blockbusters, K-dramas, Bollywood hits, or Japanese anime — Seeflix has something for everyone.' },
          { icon: '🔍', title: 'Powered by TMDB', text: 'Our data is powered by The Movie Database (TMDB), the most comprehensive movie and TV database on the web.' },
          { icon: '📱', title: 'Watch Anywhere', text: 'Seeflix works on any device — desktop, tablet, or mobile. No account needed, no subscriptions, just press play.' },
          { icon: '⚡', title: 'Always Updated', text: 'New movies and shows are added constantly. Trending content, new releases, and hidden gems updated daily.' },
          { icon: '💬', title: 'Community Driven', text: 'Ratings and reviews come from millions of real viewers. Find what the world is watching right now.' },
        ].map(card => (
          <div key={card.title} className={styles.card}>
            <span className={styles.cardIcon}>{card.icon}</span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardText}>{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
