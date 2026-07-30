import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { AuthContext } from '../../context/AuthContext';
import { FiArrowLeft, FiSave, FiCheck } from 'react-icons/fi';
import api from '../../api/axios';
import './CreatePost.css';

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Culture',
    status: 'draft',
    readTime: 5,
    excerpt: ''
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (isEditing) {
      const fetchPost = async () => {
        try {
          const res = await api.get(`/posts/${id}`);
          setFormData(res.data);
        } catch (err) {
          console.error('Failed to fetch post', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSave = async (status) => {
    setSaving(true);
    const payload = { ...formData, status };
    
    try {
      if (isEditing) {
        await api.put(`/posts/${id}`, payload);
      } else {
        await api.post('/posts', payload);
      }
      navigate('/admin');
    } catch (err) {
      console.error('Failed to save post', err);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-layout"><div className="admin-main">Loading...</div></div>;

  return (
    <div className="admin-layout">
      <main className="admin-main editor-main">
        <header className="editor-header">
          <div className="editor-title-area">
            <Link to="/admin" className="back-btn"><FiArrowLeft /></Link>
            <h1>{isEditing ? 'Edit Post' : 'New Post'}</h1>
          </div>
          <div className="editor-actions">
            <button 
              className="btn-secondary" 
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              <FiSave /> Save Draft
            </button>
            <button 
              className="btn-primary" 
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              <FiCheck /> Publish
            </button>
          </div>
        </header>

        <div className="editor-layout">
          <div className="editor-main-content">
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Post Title..."
                className="title-input"
              />
            </div>
            
            <div className="form-group editor-container">
              <label>Content</label>
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={handleContentChange} 
                className="quill-editor"
              />
            </div>
          </div>
          
          <div className="editor-sidebar">
            <div className="settings-panel">
              <h3>Post Settings</h3>
              
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Brands">Brands</option>
                  <option value="People">People</option>
                  <option value="Business">Business</option>
                  <option value="Culture">Culture</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Read Time (minutes)</label>
                <input 
                  type="number" 
                  name="readTime" 
                  value={formData.readTime} 
                  onChange={handleChange} 
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label>Excerpt</label>
                <textarea 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  rows="4"
                  placeholder="Brief summary for cards..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
