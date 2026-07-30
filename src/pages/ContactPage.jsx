import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ContactSection from '../components/ContactSection';

const ContactPage = () => {
  const { t } = useLanguage();

  return (
    <div className="contact-page fade-in">
      <div className="container" style={{ padding: '6rem 0 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>{t('contactPage.title')}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          {t('contactPage.subtitle')}
        </p>
      </div>
      <ContactSection />
    </div>
  );
};

export default ContactPage;
