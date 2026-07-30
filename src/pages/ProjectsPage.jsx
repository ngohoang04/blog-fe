import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import FeaturedProjects from '../components/FeaturedProjects';

const ProjectsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="projects-page fade-in">
      <div className="container" style={{ padding: '6rem 0 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>{t('projectsPage.title')}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          {t('projectsPage.subtitle')}
        </p>
      </div>
      <FeaturedProjects />
    </div>
  );
};

export default ProjectsPage;
