import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiLogOut, FiHome, FiMessageSquare, FiSave, FiImage, FiFileText, FiFolder, FiMail } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';

const AdminSettings = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { language, setLanguage } = useLanguage();
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
      setMessage(language === 'en' ? 'Saved successfully!' : 'Đã lưu thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(language === 'en' ? 'Save failed' : 'Lưu thất bại');
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const isEn = language === 'en';

  const imageFields = [
    { key: 'heroImage', label: isEn ? 'Hero Image (Homepage right)' : 'Ảnh Hero (trang chủ, bên phải)', desc: isEn ? 'Large image in the hero section. Recommended ratio: 4:5' : 'Ảnh lớn hiển thị ở phần đầu trang chủ. Tỉ lệ khuyến nghị: 4:5' },
    { key: 'profileImage', label: isEn ? 'Portrait Image (About section)' : 'Ảnh chân dung (phần giới thiệu)', desc: isEn ? 'Personal image in "About Me". Recommended ratio: 3:4' : 'Ảnh cá nhân trong mục "About Me". Tỉ lệ khuyến nghị: 3:4' },
  ];

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
          <Link to="/admin"><FiFileText /> Posts</Link>
          <Link to="/admin/comments"><FiMessageSquare /> Comments</Link>
          <Link to="/admin/projects"><FiFolder /> Projects</Link>
          <Link to="/admin/messages"><FiMail /> Messages</Link>
          <Link to="/admin/settings" className="active"><FiImage /> Homepage Images</Link>
          <Link to="/" className="home-link"><FiHome /> Go to Homepage</Link>
          <button className="logout-btn" onClick={logout}><FiLogOut /> Logout</button>

          <div className="admin-lang-toggle" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', color: '#fff' }}>
            <span style={{ cursor: 'pointer', fontWeight: language === 'en' ? 'bold' : 'normal', opacity: language === 'en' ? 1 : 0.6 }} onClick={() => setLanguage('en')}>EN</span>
            <span>/</span>
            <span style={{ cursor: 'pointer', fontWeight: language === 'vi' ? 'bold' : 'normal', opacity: language === 'vi' ? 1 : 0.6 }} onClick={() => setLanguage('vi')}>VI</span>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{isEn ? 'Homepage Images' : 'Quản lý ảnh trang chủ'}</h1>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            <FiSave /> {saving ? (isEn ? 'Saving...' : 'Đang lưu...') : (isEn ? 'Save Changes' : 'Lưu thay đổi')}
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
                  placeholder={isEn ? 'Paste Image URL...' : 'Dán URL ảnh...'}
                  style={{ flex: 1, padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}
                />
                <label className="btn-primary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '0.6rem 1rem', fontSize: '0.85rem', opacity: uploading[key] ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {uploading[key] ? (isEn ? 'Uploading...' : 'Đang tải...') : '📁 Upload'}
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(key, e)} disabled={uploading[key]} style={{ display: 'none' }} />
                </label>
                {settings[key] && (
                  <button onClick={() => setSettings(prev => ({ ...prev, [key]: '' }))} style={{ padding: '0.6rem 1rem', borderRadius: '6px', background: '#fee', color: '#e74c3c', border: '1px solid #fcc', cursor: 'pointer' }}>
                    {isEn ? 'Remove' : 'Xóa'}
                  </button>
                )}
              </div>

              {settings[key] ? (
                <div style={{ borderRadius: '8px', overflow: 'hidden', maxWidth: '400px', border: '1px solid #eee' }}>
                  <img src={settings[key]} alt={label} style={{ width: '100%', display: 'block' }} />
                </div>
              ) : (
                <div style={{ width: '400px', height: '200px', background: 'linear-gradient(135deg, #e0d8cc, #c4a882)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>
                  {isEn ? 'No Image Selected' : 'Chưa có ảnh'}
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
