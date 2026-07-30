import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects || res.data);
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="featured-projects">
      <div className="projects-header">
        <div className="container">
          <h2>{t('featuredProjects.title')}</h2>
        </div>
      </div>
      <div className="container">
        {loading ? (
          <div className="loading-state">{t('featuredProjects.loading')}</div>
        ) : (
          <div className="projects-grid">
            {projects.slice(0, 3).map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image-placeholder"></div>
                <div className="project-content">
                  <h3 className="project-title">{project.name || project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <Link to={`/projects`} className="project-link">{t('featuredProjects.viewCase')} &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
