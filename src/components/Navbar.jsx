import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [search,   setSearch]     = useState('');
  const [showSrch, setShowSrch]   = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();

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
    { to: '/',        label: 'Home'    },
    { to: '/media',   label: 'Media'   },
    { to: '/about',   label: 'About'   },
    { to: '/contact', label: 'Contact' },
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

      {/* Search */}
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
    </nav>
  );
};

export default Navbar;
