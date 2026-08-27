import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiHome, FiMessageSquare, FiImage, FiFileText, FiFolder, FiMail } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      // Include drafts for admin
      const res = await api.get('/posts?limit=50&includeDrafts=true');
      setPosts(res.data.posts || res.data || []);
    } catch (err) {
      console.error(err);
      // Dummy data
      setPosts([
        { _id: '1', title: 'The Evolution of Vietnam Coffee Culture', status: 'published', createdAt: new Date().toISOString() },
        { _id: '2', title: 'Draft: Top 10 Startups', status: 'draft', createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        fetchPosts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

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
          <Link to="/admin" className="active"><FiFileText /> {isEn ? 'Posts' : 'Bài viết'}</Link>
          <Link to="/admin/comments"><FiMessageSquare /> {isEn ? 'Comments' : 'Bình luận'}</Link>
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
          <h1>{isEn ? 'Dashboard' : 'Bảng điều khiển'}</h1>
          <Link to="/admin/create" className="btn-primary"><FiPlus /> {isEn ? 'New Post' : 'Bài viết mới'}</Link>
        </header>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>{isEn ? 'Total Posts' : 'Tổng bài viết'}</h3>
            <p className="stat-number">{posts.length}</p>
          </div>
          <div className="stat-card">
            <h3>{isEn ? 'Published' : 'Đã xuất bản'}</h3>
            <p className="stat-number">{posts.filter(p => p.status !== 'draft').length}</p>
          </div>
          <div className="stat-card">
            <h3>{isEn ? 'Drafts' : 'Bản nháp'}</h3>
            <p className="stat-number">{posts.filter(p => p.status === 'draft').length}</p>
          </div>
        </div>

        <div className="admin-content-box">
          <h2>{isEn ? 'Recent Posts' : 'Bài viết gần đây'}</h2>
          {loading ? (
            <p>{isEn ? 'Loading...' : 'Đang tải...'}</p>
          ) : (
            <table className="admin-table posts-table">
              <thead>
                <tr>
                  <th>{isEn ? 'Title' : 'Tiêu đề'}</th>
                  <th>{isEn ? 'Status' : 'Trạng thái'}</th>
                  <th>{isEn ? 'Date' : 'Ngày đăng'}</th>
                  <th>{isEn ? 'Actions' : 'Thao tác'}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>
                      <span className={`status-badge ${post.status === 'draft' ? 'draft' : 'published'}`}>
                        {post.status || 'published'}
                      </span>
                    </td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/edit/${post.id}`} className="action-btn edit"><FiEdit2 /></Link>
                        <button className="action-btn delete" onClick={() => handleDelete(post.id)}><FiTrash2 /></button>
                      </div>
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

export default Dashboard;
