import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [search,   setSearch]     = useState('');
  const [showSrch, setShowSrch]   = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [showLang, setShowLang] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/media?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowSrch(false);
    }
  };

  const links = [
    { to: '/',        label: t('home')    },
    { to: '/media',   label: t('media')   },
    { to: '/about',   label: t('about')   },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.solid : ''}`}>
      <Link to="/" className={styles.logo}>
        <img src="/logo.svg" alt="Seeflix" height="30" />
      </Link>

      <ul className={styles.links}>
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={location.pathname === l.to ? styles.active : ''}
            >{l.label}</Link>
          </li>
        ))}
      </ul>

      <div className={styles.searchWrap}>
        {showSrch && (
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search movies, shows..."
              className={styles.searchInput}
              onBlur={() => !search && setShowSrch(false)}
            />
          </form>
        )}
        <button
          className={styles.searchBtn}
          onClick={() => setShowSrch(s => !s)}
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>

      <div className={styles.langWrap}>
        <button
          className={styles.langBtn}
          onClick={() => setShowLang(s => !s)}
        >
          {LANGUAGES.find(l => l.code === lang)?.flag} {lang.toUpperCase()}
        </button>
        {showLang && (
          <div className={styles.langDropdown}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                className={`${styles.langOption} ${lang === l.code ? styles.activeLang : ''}`}
                onClick={() => { setLang(l.code); setShowLang(false); }}
              >
                {l.flag} {l.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
