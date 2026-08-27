import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
import StoryCard from './StoryCard';
import './LatestStories.css';

const LatestStories = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryKeys = ['all', 'brands', 'people', 'business', 'culture'];
  const categoryApiValues = ['All', 'Brands', 'People', 'Business', 'Culture'];

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const query = activeTab === 'All' ? '' : `?category=${activeTab}`;
        try {
          const res = await api.get(`/posts${query}`);
          setStories(res.data.posts || res.data);
        } catch (err) {
          setStories([]);
        }
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [activeTab]);

  return (
    <section className="latest-stories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('latestStories.title')}</h2>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input type="text" placeholder={t('latestStories.searchPlaceholder')} />
          </div>
        </div>
        
        <div className="category-tabs">
          {categoryKeys.map((key, index) => (
            <button 
              key={key} 
              className={`tab-btn ${activeTab === categoryApiValues[index] ? 'active' : ''}`}
              onClick={() => setActiveTab(categoryApiValues[index])}
            >
              {t(`latestStories.${key}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">{t('latestStories.loading')}</div>
        ) : (
          <div className="stories-grid">
            {stories.slice(0, 3).map(story => (
              <StoryCard key={story.id || story.slug} story={story} />
            ))}
          </div>
        )}

        <div className="view-all-wrapper">
          <Link to="/stories" className="btn-primary">{t('latestStories.viewAll')} &rarr;</Link>
        </div>
      </div>
    </section>
  );
};

export default LatestStories;
