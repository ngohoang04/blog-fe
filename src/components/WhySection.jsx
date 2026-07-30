import React from 'react';
import { FiSearch, FiEdit3, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './WhySection.css';

const WhySection = () => {
  const { t } = useLanguage();

  return (
    <section className="why-section">
      <div className="container why-container">
        <div className="why-content">
          <h2 className="why-title">{t('why.title')}</h2>
          
          <div className="why-points">
            <div className="why-point">
              <div className="why-icon"><FiSearch /></div>
              <div>
                <h4>{t('why.research')}</h4>
                <p>{t('why.researchDesc')}</p>
              </div>
            </div>
            <div className="why-point">
              <div className="why-icon"><FiEdit3 /></div>
              <div>
                <h4>{t('why.stories')}</h4>
                <p>{t('why.storiesDesc')}</p>
              </div>
            </div>
            <div className="why-point">
              <div className="why-icon"><FiGlobe /></div>
              <div>
                <h4>{t('why.perspective')}</h4>
                <p>{t('why.perspectiveDesc')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="why-quote-area">
          <blockquote className="why-quote">
            <span className="quote-mark">"</span>
            {t('why.quote')}
          </blockquote>
          <p className="why-attribution">{t('why.attribution')}</p>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
