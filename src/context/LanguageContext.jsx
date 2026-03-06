import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    home: 'Home',
    media: 'Media',
    about: 'About',
    contact: 'Contact',
    search: 'Search movies & TV shows...',
    trending: 'Trending Now',
    popular: 'Popular Movies',
    topRated: 'Top Rated',
    tvShows: 'TV Shows',
    back: 'Back',
    source: 'Source',
    season: 'Season',
    episode: 'Episode',
    episodes: 'Episodes',
    cast: 'Cast',
    director: 'Director',
    related: 'You May Also Like',
    loading: 'Loading...',
    noResults: 'No results found',
    language: 'Language'
  },
  fr: {
    home: 'Accueil',
    media: 'Médias',
    about: 'À propos',
    contact: 'Contact',
    search: 'Rechercher films & séries...',
    trending: 'Tendances',
    popular: 'Films Populaires',
    topRated: 'Les Mieux Notés',
    tvShows: 'Séries TV',
    back: 'Retour',
    source: 'Source',
    season: 'Saison',
    episode: 'Épisode',
    episodes: 'Épisodes',
    cast: 'Acteurs',
    director: 'Réalisateur',
    related: 'Vous aimerez aussi',
    loading: 'Chargement...',
    noResults: 'Aucun résultat',
    language: 'Langue'
  },
  es: {
    home: 'Inicio',
    media: 'Medios',
    about: 'Acerca de',
    contact: 'Contacto',
    search: 'Buscar películas y series...',
    trending: 'Tendencias',
    popular: 'Películas Populares',
    topRated: 'Mejor Valoradas',
    tvShows: 'Series de TV',
    back: 'Volver',
    source: 'Fuente',
    season: 'Temporada',
    episode: 'Episodio',
    episodes: 'Episodios',
    cast: 'Reparto',
    director: 'Director',
    related: 'También te gustará',
    loading: 'Cargando...',
    noResults: 'Sin resultados',
    language: 'Idioma'
  },
  de: {
    home: 'Startseite',
    media: 'Medien',
    about: 'Über uns',
    contact: 'Kontakt',
    search: 'Filme & Serien suchen...',
    trending: 'Im Trend',
    popular: 'Beliebte Filme',
    topRated: 'Bestbewertet',
    tvShows: 'TV-Serien',
    back: 'Zurück',
    source: 'Quelle',
    season: 'Staffel',
    episode: 'Folge',
    episodes: 'Folgen',
    cast: 'Besetzung',
    director: 'Regisseur',
    related: 'Das könnte dir auch gefallen',
    loading: 'Laden...',
    noResults: 'Keine Ergebnisse',
    language: 'Sprache'
  },
  pt: {
    home: 'Início',
    media: 'Mídia',
    about: 'Sobre',
    contact: 'Contato',
    search: 'Pesquisar filmes e séries...',
    trending: 'Em Alta',
    popular: 'Filmes Populares',
    topRated: 'Mais Bem Avaliados',
    tvShows: 'Séries de TV',
    back: 'Voltar',
    source: 'Fonte',
    season: 'Temporada',
    episode: 'Episódio',
    episodes: 'Episódios',
    cast: 'Elenco',
    director: 'Diretor',
    related: 'Você também pode gostar',
    loading: 'Carregando...',
    noResults: 'Nenhum resultado',
    language: 'Idioma'
  }
};

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('seeflix-lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('seeflix-lang', lang);
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
