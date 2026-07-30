import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/posts/${slug}`);
        setStory(res.data);
      } catch (err) {
        setStory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return <div className="container loading-state">{t('storyDetail.loading')}</div>;
  if (!story) return <div className="container error-state">{t('storyDetail.notFound')}</div>;

  const category = story.Categories && story.Categories.length > 0 
    ? story.Categories[0].name 
    : story.category || '';

  const authorName = story.User ? story.User.username : (story.author || 'Cúc');

  return (
    <article className="story-detail-page fade-in">
      <div className="container story-detail-container">
        <div className="breadcrumb">
          <Link to="/">{t('common.home')}</Link> / <Link to="/stories">{t('nav.stories')}</Link> / <span>{category}</span>
        </div>
        
        <header className="story-header">
          <span className="story-category-pill">{category}</span>
          <h1 className="story-main-title">{story.title}</h1>
          
          <div className="story-meta-large">
            <div className="author-info">
              <div className="author-avatar"></div>
              <span>{t('storyDetail.by')} {authorName}</span>
            </div>
            <div className="meta-divider"></div>
            <span>{formatDate(story.createdAt)}</span>
            <div className="meta-divider"></div>
            <span>{story.readTime || '5 ' + t('storyCard.minRead')}</span>
          </div>
        </header>

        <div className="story-featured-image"></div>

        <div 
          className="story-content-body"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
        />

        <div className="story-tags">
          {story.Tags && story.Tags.map(tag => (
            <span key={tag.id || tag} className="tag">{tag.name || tag}</span>
          ))}
        </div>
        
        <div className="comments-section">
          <h3>{t('storyDetail.comments')} (0)</h3>
          <div className="comment-form">
            <textarea placeholder={t('storyDetail.leaveComment')}></textarea>
            <button className="btn-primary mt-1">{t('storyDetail.postComment')}</button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryDetailPage;
