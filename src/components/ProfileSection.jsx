import React from 'react';
import { FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './ProfileSection.css';

const ProfileSection = () => {
  const { t } = useLanguage();

  return (
    <section className="profile-section">
      <div className="container profile-container">
        <div className="profile-content">
          <h2 className="profile-greeting">{t('profile.greeting')}</h2>
          <h3 className="profile-role">{t('profile.role')}</h3>
          <p className="profile-tagline">{t('profile.tagline')}</p>
          
          <p className="profile-bio">
            {t('profile.bio')}
          </p>
          
          <div className="profile-actions">
            <a href="#" className="btn-primary">{t('profile.viewCV')} &rarr;</a>
            <div className="profile-socials">
              <a href="#"><FiLinkedin /></a>
              <a href="#"><FiInstagram /></a>
              <a href="#"><FiMail /></a>
            </div>
          </div>
        </div>
        
        <div className="profile-image-wrapper">
          <div className="profile-image-placeholder"></div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
