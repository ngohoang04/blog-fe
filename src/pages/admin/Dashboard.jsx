import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiHome, FiMessageSquare, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
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
      const res = await api.get('/posts?limit=50');
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

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="active">Posts</Link>
          <Link to="/admin/comments"><FiMessageSquare /> Comments</Link>
          <Link to="/admin/projects">Projects</Link>
          <Link to="/admin/messages">Messages</Link>
          <Link to="/admin/settings"><FiImage /> Ảnh trang chủ</Link>
          <Link to="/" className="home-link"><FiHome /> Trang chủ</Link>
          <button className="logout-btn" onClick={logout}><FiLogOut /> Logout</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard</h1>
          <Link to="/admin/create" className="btn-primary"><FiPlus /> New Post</Link>
        </header>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p className="stat-number">{posts.length}</p>
          </div>
          <div className="stat-card">
            <h3>Published</h3>
            <p className="stat-number">{posts.filter(p => p.status !== 'draft').length}</p>
          </div>
          <div className="stat-card">
            <h3>Drafts</h3>
            <p className="stat-number">{posts.filter(p => p.status === 'draft').length}</p>
          </div>
        </div>

        <div className="admin-content-box">
          <h2>Recent Posts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
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
