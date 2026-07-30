import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ProfileSection from '../components/ProfileSection';
import WhySection from '../components/WhySection';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="about-page fade-in">
      <div className="container" style={{ padding: '6rem 0 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>{t('about.title')}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          {t('about.subtitle')}
        </p>
      </div>
      <WhySection />
      <ProfileSection />
    </div>
  );
};

export default AboutPage;
