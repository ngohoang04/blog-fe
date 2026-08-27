import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiTrash2, FiLogOut, FiHome, FiMessageSquare, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';

const AdminComments = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
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

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin">Posts</Link>
          <Link to="/admin/comments" className="active"><FiMessageSquare /> Comments</Link>
          <Link to="/admin/projects">Projects</Link>
          <Link to="/admin/messages">Messages</Link>
          <Link to="/admin/settings"><FiImage /> Ảnh trang chủ</Link>
          <Link to="/" className="home-link"><FiHome /> Trang chủ</Link>
          <button className="logout-btn" onClick={logout}><FiLogOut /> Logout</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Quản lý bình luận ({filteredComments.length})</h1>
          <div className="comment-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >Tất cả</button>
            <button
              className={`filter-btn ${filter === 'guest' ? 'active' : ''}`}
              onClick={() => setFilter('guest')}
            >Khách</button>
            <button
              className={`filter-btn ${filter === 'user' ? 'active' : ''}`}
              onClick={() => setFilter('user')}
            >Thành viên</button>
          </div>
        </header>

        <div className="admin-content-box">
          {loading ? (
            <p>Loading...</p>
          ) : filteredComments.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Chưa có bình luận nào.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Người bình luận</th>
                  <th>Nội dung</th>
                  <th>Bài viết</th>
                  <th>Ngày</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.map(comment => (
                  <tr key={comment.id}>
                    <td>
                      <div>
                        <strong>{comment.displayName}</strong>
                        {!comment.userId && <span className="status-badge draft" style={{ marginLeft: '0.5rem' }}>Khách</span>}
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
