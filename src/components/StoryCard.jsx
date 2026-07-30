import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './StoryCard.css';

const StoryCard = ({ story }) => {
  const { language, t } = useLanguage();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  // Get category name - handle both API response formats
  const getCategoryName = () => {
    if (story.Categories && story.Categories.length > 0) {
      return story.Categories[0].name;
    }
    return story.category || t('storyCard.story');
  };

  return (
    <Link to={`/stories/${story.slug}`} className="story-card">
      <div className="story-image-wrapper">
        <div className="story-image-placeholder">
           {/* Fallback image placeholder */}
        </div>
      </div>
      <div className="story-content">
        <span className="story-category">{getCategoryName()}</span>
        <h3 className="story-title">{story.title}</h3>
        <div className="story-meta">
          <span>{formatDate(story.createdAt)}</span>
          <span className="meta-dot">·</span>
          <span>{story.readTime || '5 ' + t('storyCard.minRead')}</span>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
