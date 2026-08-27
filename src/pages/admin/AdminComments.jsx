import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiTrash2, FiLogOut, FiHome, FiMessageSquare, FiImage, FiFileText, FiFolder, FiMail } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';

const AdminComments = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { language, setLanguage } = useLanguage();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'guest', 'user'

  useEffect(() => {
    if (isAuthenticated) fetchComments();
  }, [isAuthenticated]);

  const fetchComments = async () => {
    try {
      const res = await api.get('/comments');
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa bình luận này?')) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete comment', err);
      alert('Xóa thất bại');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const truncate = (str, len = 80) => {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'guest') return !c.userId;
    if (filter === 'user') return !!c.userId;
    return true;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isEn = language === 'en';

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Admin</h2>
          <button className="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', color: '#fff', border: 'none', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }}>
            ☰
          </button>
        </div>
        <nav className={`sidebar-nav ${isSidebarOpen ? 'open' : ''}`}>
          <Link to="/admin"><FiFileText /> {isEn ? 'Posts' : 'Bài viết'}</Link>
          <Link to="/admin/comments" className="active"><FiMessageSquare /> {isEn ? 'Comments' : 'Bình luận'}</Link>
          <Link to="/admin/projects"><FiFolder /> {isEn ? 'Projects' : 'Dự án'}</Link>
          <Link to="/admin/messages"><FiMail /> {isEn ? 'Messages' : 'Tin nhắn'}</Link>
          <Link to="/admin/settings"><FiImage /> {isEn ? 'Homepage Images' : 'Ảnh trang chủ'}</Link>
          <Link to="/" className="home-link"><FiHome /> {isEn ? 'Go to Homepage' : 'Trang chủ'}</Link>
          <button className="logout-btn" onClick={logout}><FiLogOut /> {isEn ? 'Logout' : 'Đăng xuất'}</button>

          <div className="admin-lang-toggle" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', color: '#fff' }}>
            <span style={{ cursor: 'pointer', fontWeight: language === 'en' ? 'bold' : 'normal', opacity: language === 'en' ? 1 : 0.6 }} onClick={() => setLanguage('en')}>EN</span>
            <span>/</span>
            <span style={{ cursor: 'pointer', fontWeight: language === 'vi' ? 'bold' : 'normal', opacity: language === 'vi' ? 1 : 0.6 }} onClick={() => setLanguage('vi')}>VI</span>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{isEn ? 'Comments Management' : 'Quản lý bình luận'} ({filteredComments.length})</h1>
          <div className="comment-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >{isEn ? 'All' : 'Tất cả'}</button>
            <button
              className={`filter-btn ${filter === 'guest' ? 'active' : ''}`}
              onClick={() => setFilter('guest')}
            >{isEn ? 'Guests' : 'Khách'}</button>
            <button
              className={`filter-btn ${filter === 'user' ? 'active' : ''}`}
              onClick={() => setFilter('user')}
            >{isEn ? 'Members' : 'Thành viên'}</button>
          </div>
        </header>

        <div className="admin-content-box">
          {loading ? (
            <p>{isEn ? 'Loading...' : 'Đang tải...'}</p>
          ) : filteredComments.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>{isEn ? 'No comments found.' : 'Chưa có bình luận nào.'}</p>
          ) : (
            <table className="admin-table comments-table">
              <thead>
                <tr>
                  <th>{isEn ? 'Author' : 'Người bình luận'}</th>
                  <th>{isEn ? 'Content' : 'Nội dung'}</th>
                  <th>{isEn ? 'Post' : 'Bài viết'}</th>
                  <th>{isEn ? 'Date' : 'Ngày'}</th>
                  <th>{isEn ? 'Actions' : 'Thao tác'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.map(comment => (
                  <tr key={comment.id}>
                    <td>
                      <div>
                        <strong>{comment.displayName}</strong>
                        {!comment.userId && <span className="status-badge draft" style={{ marginLeft: '0.5rem' }}>{isEn ? 'Guest' : 'Khách'}</span>}
                      </div>
                      {comment.guestEmail && (
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{comment.guestEmail}</div>
                      )}
                    </td>
                    <td title={comment.content}>{truncate(comment.content)}</td>
                    <td>
                      {comment.Post ? (
                        <Link to={`/stories/${comment.Post.slug}`} style={{ color: '#007bff', fontSize: '0.9rem' }}>
                          {truncate(comment.Post.title, 40)}
                        </Link>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{formatDate(comment.createdAt)}</td>
                    <td>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(comment.id)}
                        title="Xóa bình luận"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminComments;
