import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiLogOut, FiHome, FiMessageSquare, FiSave, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';

const AdminSettings = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    heroImage: '',
    profileImage: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) fetchSettings();
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      setMessage('Đã lưu thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData);
      setSettings(prev => ({ ...prev, [key]: res.data.url }));
    } catch (err) {
      alert('Upload thất bại');
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const imageFields = [
    { key: 'heroImage', label: 'Ảnh Hero (trang chủ, bên phải)', desc: 'Ảnh lớn hiển thị ở phần đầu trang chủ. Tỉ lệ khuyến nghị: 4:5' },
    { key: 'profileImage', label: 'Ảnh chân dung (phần giới thiệu)', desc: 'Ảnh cá nhân trong mục "About Me". Tỉ lệ khuyến nghị: 3:4' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand"><h2>VD Admin</h2></div>
        <nav className="sidebar-nav">
          <Link to="/admin">Posts</Link>
          <Link to="/admin/comments"><FiMessageSquare /> Comments</Link>
          <Link to="/admin/projects">Projects</Link>
          <Link to="/admin/messages">Messages</Link>
          <Link to="/admin/settings" className="active"><FiImage /> Ảnh trang chủ</Link>
          <Link to="/" className="home-link"><FiHome /> Trang chủ</Link>
          <button className="logout-btn" onClick={logout}><FiLogOut /> Logout</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Quản lý ảnh trang chủ</h1>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            <FiSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </header>

        {message && <div className="admin-message">{message}</div>}

        <div style={{ display: 'grid', gap: '2rem' }}>
          {imageFields.map(({ key, label, desc }) => (
            <div key={key} className="admin-content-box">
              <h2 style={{ marginBottom: '0.5rem' }}>{label}</h2>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>{desc}</p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={settings[key] || ''}
                  onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder="Dán URL ảnh..."
                  style={{ flex: 1, padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}
                />
                <label className="btn-primary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '0.6rem 1rem', fontSize: '0.85rem', opacity: uploading[key] ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {uploading[key] ? 'Đang tải...' : '📁 Upload'}
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(key, e)} disabled={uploading[key]} style={{ display: 'none' }} />
                </label>
                {settings[key] && (
                  <button onClick={() => setSettings(prev => ({ ...prev, [key]: '' }))} style={{ padding: '0.6rem 1rem', borderRadius: '6px', background: '#fee', color: '#e74c3c', border: '1px solid #fcc', cursor: 'pointer' }}>
                    Xóa
                  </button>
                )}
              </div>

              {settings[key] ? (
                <div style={{ borderRadius: '8px', overflow: 'hidden', maxWidth: '400px', border: '1px solid #eee' }}>
                  <img src={settings[key]} alt={label} style={{ width: '100%', display: 'block' }} />
                </div>
              ) : (
                <div style={{ width: '400px', height: '200px', background: 'linear-gradient(135deg, #e0d8cc, #c4a882)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>
                  Chưa có ảnh
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
