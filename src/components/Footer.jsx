import React from 'react';
import { Link } from 'react-router-dom';
import { FiLinkedin, FiInstagram, FiTwitter } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">VIETNAM DECODED</h2>
            <p className="footer-quote">{t('footer.quote')}</p>
          </div>
          
          <div className="footer-links-group">
            <h3>{t('footer.navigation')}</h3>
            <div className="footer-links">
              <Link to="/">{t('nav.home')}</Link>
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/stories">{t('nav.stories')}</Link>
              <Link to="/projects">{t('nav.projects')}</Link>
              <Link to="/contact">{t('nav.contact')}</Link>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h3>{t('footer.connect')}</h3>
            <div className="footer-socials">
              <a href="#"><FiLinkedin /> LinkedIn</a>
              <a href="#"><FiInstagram /> Instagram</a>
              <a href="#"><FiTwitter /> Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Vietnam Decoded. {t('footer.rights')}</p>
          <div className="footer-legal">
            <Link to="#">{t('footer.privacy')}</Link>
            <Link to="#">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
