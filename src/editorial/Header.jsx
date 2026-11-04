import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef(null);
  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return <header className="nav"><div className="shell navinner">
    <Link className="brand" to="/">VIETNAM DECODED<small>BUSINESS, MEDIA & EVERYDAY CONTEXT</small></Link>
    <nav id="editorial-navigation" className={open ? 'open' : ''} aria-label={language === 'vi' ? 'Điều hướng chính' : 'Main navigation'}>
      {['home', 'stories', 'about', 'projects', 'contact'].map(key =>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} key={key} end={key === 'home'} to={key === 'home' ? '/' : `/${key}`}>{t(`nav.${key}`)}</NavLink>)}
    </nav>
    <button className="lang" onClick={toggleLanguage} aria-label={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}>{language === 'en' ? 'EN / VI' : 'VI / EN'}</button>
    <button ref={menuButton} className="menu" onClick={() => setOpen(v => !v)} aria-label={language === 'vi' ? 'Mở hoặc đóng menu' : 'Toggle navigation'} aria-expanded={open} aria-controls="editorial-navigation">{open ? '✕' : '☰'}</button>
  </div></header>;
}
