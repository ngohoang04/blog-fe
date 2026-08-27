import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data.heroImage) setHeroImage(res.data.heroImage);
    }).catch(() => {});
  }, []);

  return (
    <section className="hero">
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-label">{t('hero.label')}</span>
          <h1 className="hero-title">
            {t('hero.title')}
          </h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <Link to="/stories" className="btn-primary hero-btn">
            {t('hero.cta')} &rarr;
          </Link>
        </motion.div>
        <motion.div 
          className="hero-image-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroImage ? (
            <img src={heroImage} alt="Vietnam Decoded" className="hero-image" />
          ) : (
            <div className="hero-image-placeholder"></div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
