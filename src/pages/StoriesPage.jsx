import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import StoryCard from '../components/StoryCard';
import api from '../api/axios';
import './StoriesPage.css';

const StoriesPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categoryKeys = ['all', 'brands', 'people', 'business', 'culture'];
  const categoryApiValues = ['All', 'Brands', 'People', 'Business', 'Culture'];

  useEffect(() => {
    fetchStories(1, true);
  }, [activeTab]);

  const fetchStories = async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const categoryQuery = activeTab === 'All' ? '' : `&category=${activeTab}`;
      const res = await api.get(`/posts?page=${pageNum}&limit=9${categoryQuery}`);
      
      const newStories = res.data.posts || res.data;
      
      if (reset) {
        setStories(newStories);
      } else {
        setStories(prev => [...prev, ...newStories]);
      }
      
      setHasMore(newStories.length === 9);
      setPage(pageNum);
    } catch (error) {
      if(reset) setStories([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchStories(page + 1);
  };

  return (
    <div className="stories-page fade-in">
      <div className="stories-header">
        <div className="container">
          <h1 className="page-title">{t('storiesPage.title')}</h1>
          <p className="page-subtitle">{t('storiesPage.subtitle')}</p>
        </div>
      </div>
      
      <div className="container">
        <div className="stories-filters">
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
          
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input type="text" placeholder={t('latestStories.searchPlaceholder')} />
          </div>
        </div>

        <div className="stories-grid">
          {stories.map(story => (
            <StoryCard key={story.id || story.slug} story={story} />
          ))}
        </div>

        {loading && <div className="loading-state">{t('latestStories.loading')}</div>}
        
        {!loading && hasMore && (
          <div className="load-more-wrapper">
            <button className="btn-primary" onClick={handleLoadMore}>{t('storiesPage.loadMore')}</button>
          </div>
        )}
        
        {!loading && stories.length === 0 && (
          <div className="empty-state">{t('storiesPage.noStories')}</div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
