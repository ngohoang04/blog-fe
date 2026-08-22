import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useLanguage } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { user } = useContext(AuthContext);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/posts/${slug}`);
        setStory(res.data);
        // Fetch comments for this post
        if (res.data && res.data.id) {
          const commentsRes = await api.get(`/comments/post/${res.data.id}`);
          setComments(commentsRes.data);
        }
      } catch (err) {
        setStory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setCommentError('');

    if (!commentContent.trim()) {
      setCommentError(t('storyDetail.commentRequired'));
      return;
    }

    if (!user && !guestName.trim()) {
      setCommentError(t('storyDetail.nameRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        content: commentContent.trim(),
      };

      // If not logged in, send guest info
      if (!user) {
        payload.guestName = guestName.trim();
        payload.guestEmail = guestEmail.trim();
      }

      const res = await api.post(`/comments/post/${story.id}`, payload);
      setComments(prev => [res.data, ...prev]);
      setCommentContent('');
      setCommentError('');
    } catch (err) {
      setCommentError(err.response?.data?.message || t('storyDetail.commentFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return language === 'vi' ? 'vừa xong' : 'just now';
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return language === 'vi' ? `${mins} phút trước` : `${mins}m ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return language === 'vi' ? `${hours} giờ trước` : `${hours}h ago`;
    }
    if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return language === 'vi' ? `${days} ngày trước` : `${days}d ago`;
    }
    return formatDate(dateString);
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

        {story.thumbnail && (
          <div className="story-featured-image">
            <img src={story.thumbnail} alt={story.title} />
          </div>
        )}

        <div 
          className="story-content-body"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
        />

        <div className="story-tags">
          {story.Tags && story.Tags.map(tag => (
            <span key={tag.id || tag} className="tag">{tag.name || tag}</span>
          ))}
        </div>
        
        {/* Comments Section */}
        <div className="comments-section">
          <h3>{t('storyDetail.comments')} ({comments.length})</h3>
          
          {/* Comment Form */}
          <form className="comment-form" onSubmit={handleSubmitComment}>
            {!user && (
              <div className="guest-fields">
                <input
                  type="text"
                  placeholder={t('storyDetail.yourName')}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="guest-input"
                />
                <input
                  type="email"
                  placeholder={t('storyDetail.yourEmail')}
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="guest-input"
                />
              </div>
            )}
            <textarea 
              placeholder={user ? t('storyDetail.leaveComment') : t('storyDetail.leaveCommentGuest')}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
            ></textarea>
            {commentError && <p className="comment-error">{commentError}</p>}
            <button 
              type="submit" 
              className="btn-primary mt-1"
              disabled={submitting}
            >
              {submitting ? t('storyDetail.posting') : t('storyDetail.postComment')}
            </button>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">{t('storyDetail.noComments')}</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <strong className="comment-author">{comment.displayName}</strong>
                    <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="comment-item reply">
                          <div className="comment-header">
                            <strong className="comment-author">{reply.displayName}</strong>
                            <span className="comment-time">{formatTimeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="comment-content">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryDetailPage;
