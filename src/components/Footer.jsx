import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.brand}>
        <img src="/logo.svg" alt="Seeflix" height="28" />
        <p className={styles.tagline}>Free streaming, unlimited entertainment.</p>
      </div>
      <div className={styles.cols}>
        <div className={styles.col}>
          <h4>Menu</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/media">Media</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Contact</h4>
          <ul>
            <li>contact@seeflix.com</li>
            <li>(+509) 3215-0000</li>
            <li>Pétion-Ville, Haïti</li>
          </ul>
        </div>
      </div>
    </div>
    <div className={styles.bottom}>
      <span>© 2025 Seeflix — All rights reserved</span>
      <span>Powered by <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a></span>
    </div>
  </footer>
);

export default Footer;
