import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiLogOut, FiMail, FiCheckCircle, FiTrash2, FiClock, FiHome, FiMessageSquare, FiImage, FiFileText, FiFolder } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';
import './AdminExtra.css';

const AdminMessages = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (isAuthenticated) fetchMessages();
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      setMessages(res.data.contacts || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      fetchMessages();
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg({ ...selectedMsg, isRead: true });
      }
      setInfo('Marked as read');
      setTimeout(() => setInfo(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isEn = language === 'en';

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const unreadCount = messages.filter(m => !m.isRead).length;

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
          <Link to="/admin/comments"><FiMessageSquare /> {isEn ? 'Comments' : 'Bình luận'}</Link>
          <Link to="/admin/projects"><FiFolder /> {isEn ? 'Projects' : 'Dự án'}</Link>
          <Link to="/admin/messages" className="active"><FiMail /> {isEn ? 'Messages' : 'Tin nhắn'}</Link>
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
          <h1>{isEn ? 'Messages' : 'Tin nhắn'} {unreadCount > 0 && <span className="unread-badge">{unreadCount} {isEn ? 'new' : 'mới'}</span>}</h1>
        </header>

        {info && <div className="admin-message">{info}</div>}

        <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="stat-card">
            <h3>{isEn ? 'Total Messages' : 'Tổng số'}</h3>
            <p className="stat-number">{messages.length}</p>
          </div>
          <div className="stat-card">
            <h3>{isEn ? 'Unread' : 'Chưa đọc'}</h3>
            <p className="stat-number">{unreadCount}</p>
          </div>
        </div>

        <div className="admin-messages-layout">
          <div className="admin-content-box message-list-box">
            <h2>{isEn ? 'Inbox' : 'Hộp thư'}</h2>
            {loading ? (
              <p>{isEn ? 'Loading...' : 'Đang tải...'}</p>
            ) : messages.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0' }}>{isEn ? 'No messages yet.' : 'Chưa có tin nhắn nào.'}</p>
            ) : (
              <div className="messages-list">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message-item ${!msg.isRead ? 'unread' : ''} ${selectedMsg?.id === msg.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMsg(msg)}
                  >
                    <div className="message-item-header">
                      <span className="message-sender">{msg.name}</span>
                      {!msg.isRead && <span className="unread-dot" />}
                    </div>
                    <div className="message-subject">{msg.subject || (isEn ? '(No subject)' : '(Không có chủ đề)')}</div>
                    <div className="message-preview">{msg.message?.substring(0, 80)}...</div>
                    <div className="message-time">
                      <FiClock size={12} /> {formatDate(msg.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-content-box message-detail-box">
            {selectedMsg ? (
              <>
                <div className="message-detail-header">
                  <h2>{selectedMsg.subject || (isEn ? '(No subject)' : '(Không có chủ đề)')}</h2>
                  <div className="message-detail-actions">
                    {!selectedMsg.isRead && (
                      <button className="action-btn edit" onClick={() => handleMarkRead(selectedMsg.id)} title={isEn ? 'Mark as read' : 'Đánh dấu đã đọc'}>
                        <FiCheckCircle />
                      </button>
                    )}
                    <button className="action-btn delete" onClick={() => handleDelete(selectedMsg.id)} title={isEn ? 'Delete' : 'Xóa'}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="message-meta">
                  <p><strong>{isEn ? 'From:' : 'Từ:'}</strong> {selectedMsg.name}</p>
                  <p><strong>Email:</strong> <a href={`mailto:${selectedMsg.email}`}>{selectedMsg.email}</a></p>
                  <p><strong>{isEn ? 'Date:' : 'Ngày:'}</strong> {formatDate(selectedMsg.createdAt)}</p>
                  <p><strong>{isEn ? 'Status:' : 'Trạng thái:'}</strong>
                    <span className={`status-badge ${selectedMsg.isRead ? 'published' : 'draft'}`} style={{ marginLeft: '0.5rem' }}>
                      {selectedMsg.isRead ? (isEn ? 'Read' : 'Đã đọc') : (isEn ? 'Unread' : 'Chưa đọc')}
                    </span>
                  </p>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />
                <div className="message-body">
                  {selectedMsg.message}
                </div>
              </>
            ) : (
              <div className="no-message-selected">
                <FiMail size={48} color="#ccc" />
                <p>{isEn ? 'Select a message to read' : 'Chọn một tin nhắn để đọc'}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
