import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar  from './components/Navbar';
import Footer  from './components/Footer';
import Home    from './pages/Home';
import Media   from './pages/Media';
import Watch   from './pages/Watch';
import About   from './pages/About';
import Contact from './pages/Contact';

const App = () => (
  <LanguageProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/media"         element={<Media />} />
        <Route path="/watch/:type/:id" element={<Watch />} />
        <Route path="/about"         element={<About />} />
        <Route path="/contact"       element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </LanguageProvider>
);

export default App;
