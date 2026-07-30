import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/stories', label: t('nav.stories') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo">
            VIETNAM<br className="logo-break" /> DECODED
          </Link>

          {/* Desktop nav */}
          <div className="navbar-links-desktop">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                {item.label}
              </NavLink>
            ))}
            <div className="language-toggle">
              <span
                className={language === 'en' ? 'active' : ''}
                onClick={() => setLanguage('en')}
              >EN</span>
              <span className="lang-divider">/</span>
              <span
                className={language === 'vi' ? 'active' : ''}
                onClick={() => setLanguage('vi')}
              >VI</span>
            </div>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div className={`mobile-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-logo" onClick={() => setIsOpen(false)}>
            VIETNAM DECODED
          </Link>
          <button className="mobile-close-btn" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <FiX size={28} />
          </button>
        </div>

        <nav className="mobile-nav">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <span className="mobile-nav-number">0{index + 1}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-lang-toggle">
            <button
              className={`mobile-lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button
              className={`mobile-lang-btn ${language === 'vi' ? 'active' : ''}`}
              onClick={() => setLanguage('vi')}
            >
              Tiếng Việt
            </button>
          </div>
          <p className="mobile-menu-quote">"Local stories. Global impact."</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
