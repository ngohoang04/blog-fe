import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import StoryCard from '../components/StoryCard';
import api from '../api/axios';
import './StoriesPage.css';

const ITEMS_PER_PAGE = 8;

const StoriesPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  const categoryKeys = ['all', 'brands', 'people', 'business', 'culture'];
  const categoryApiValues = ['All', 'Brands', 'People', 'Business', 'Culture'];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchStories(page);
  }, [activeTab, page]);

  const fetchStories = async (pageNum) => {
    setLoading(true);
    try {
      const categoryQuery = activeTab === 'All' ? '' : `&category=${activeTab}`;
      const searchQ = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : '';
      const res = await api.get(`/posts?page=${pageNum}&limit=${ITEMS_PER_PAGE}${categoryQuery}${searchQ}`);
      
      setStories(res.data.posts || res.data);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (error) {
      setStories([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStories(1);
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Show fewer page buttons on mobile to prevent wrapping
    const maxVisible = isMobile ? 3 : 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
          
          <form className="search-box" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={t('latestStories.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {loading ? (
          <div className="loading-state">{t('latestStories.loading')}</div>
        ) : stories.length === 0 ? (
          <div className="empty-state">{t('storiesPage.noStories')}</div>
        ) : (
          <>
            <div className="stories-grid stories-page-grid">
              {stories.map(story => (
                <StoryCard key={story.id || story.slug} story={story} />
              ))}
            </div>

            {/* Pagination (always show for testing) */}
            {totalPages >= 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn" 
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  <FiChevronLeft />
                </button>

                {getPageNumbers()[0] > 1 && (
                  <>
                    <button className="pagination-num" onClick={() => goToPage(1)}>1</button>
                    {getPageNumbers()[0] > 2 && <span className="pagination-dots">...</span>}
                  </>
                )}

                {getPageNumbers().map(p => (
                  <button 
                    key={p}
                    className={`pagination-num ${p === page ? 'active' : ''}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ))}

                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span className="pagination-dots">...</span>}
                    <button className="pagination-num" onClick={() => goToPage(totalPages)}>{totalPages}</button>
                  </>
                )}

                <button 
                  className="pagination-btn" 
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
