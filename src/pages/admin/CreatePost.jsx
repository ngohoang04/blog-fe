import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { AuthContext } from '../../context/AuthContext';
import { FiArrowLeft, FiSave, FiCheck, FiImage, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import './CreatePost.css';

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const isEditing = !!id;
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Culture',
    status: 'draft',
    readTime: 5,
    excerpt: '',
    thumbnail: ''
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (isEditing) {
      const fetchPost = async () => {
        try {
          const res = await api.get(`/posts/id/${id}`);
          setFormData(res.data);
          if (res.data.thumbnail) {
            setThumbnailPreview(res.data.thumbnail);
          }
        } catch (err) {
          console.error('Failed to fetch post', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isAuthenticated, navigate]);

  // Upload image to server/cloudinary
  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    const res = await api.post('/upload', formDataUpload);
    return res.data.url;
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, thumbnail: url }));
      setThumbnailPreview(url);
    } catch (err) {
      console.error('Failed to upload thumbnail', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: '' }));
    setThumbnailPreview('');
  };

  // Quill image handler — insert image into editor content
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const url = await uploadImage(file);
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', url);
          quill.setSelection(range.index + 1);
        }
      } catch (err) {
        console.error('Failed to upload image', err);
        alert('Failed to upload image.');
      }
    };
  };

  // Quill modules with custom image handler
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ align: [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSave = async (status) => {
    setSaving(true);
    const payload = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      thumbnail: formData.thumbnail,
      category: formData.category,
      readTime: formData.readTime,
      status
    };
    
    console.log('Saving post:', { isEditing, id, payload: { ...payload, content: payload.content?.substring(0, 50) + '...' } });
    
    try {
      if (isEditing) {
        await api.put(`/posts/${id}`, payload);
      } else {
        await api.post('/posts', payload);
      }
      navigate('/admin');
    } catch (err) {
      console.error('Failed to save post', err.response?.data || err.message);
      alert('Failed to save: ' + (err.response?.data?.message || err.message));
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
                ref={quillRef}
                theme="snow" 
                value={formData.content} 
                onChange={handleContentChange} 
                modules={modules}
                className="quill-editor"
              />
            </div>
          </div>
          
          <div className="editor-sidebar">
            <div className="settings-panel">
              <h3>Post Settings</h3>

              {/* Thumbnail Upload */}
              <div className="form-group">
                <label>Thumbnail</label>
                {thumbnailPreview ? (
                  <div className="thumbnail-preview">
                    <img src={thumbnailPreview} alt="Thumbnail preview" />
                    <button 
                      type="button" 
                      className="remove-thumbnail-btn" 
                      onClick={removeThumbnail}
                      title="Remove thumbnail"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <label className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-placeholder">
                      {uploading ? (
                        <span>Uploading...</span>
                      ) : (
                        <>
                          <FiImage size={24} />
                          <span>Click to upload thumbnail</span>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>
              
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
