import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiExternalLink } from 'react-icons/fi';
import api from '../../api/axios';
import './Dashboard.css';
import './AdminExtra.css';

const AdminProjects = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', link: '', thumbnail: '', displayOrder: 0 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', link: '', thumbnail: '', displayOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
        setMessage('Project updated successfully!');
      } else {
        await api.post('/projects', form);
        setMessage('Project created successfully!');
      }
      resetForm();
      fetchProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving project');
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      description: project.description || '',
      link: project.link || '',
      thumbnail: project.thumbnail || '',
      displayOrder: project.displayOrder || 0,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
        setMessage('Project deleted!');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>VD Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin">Posts</Link>
          <Link to="/admin/projects" className="active">Projects</Link>
          <Link to="/admin/messages">Messages</Link>
          <button className="logout-btn" onClick={logout}><FiLogOut /> Logout</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Projects</h1>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FiPlus /> {showForm ? 'Cancel' : 'New Project'}
          </button>
        </header>

        {message && <div className="admin-message">{message}</div>}

        {showForm && (
          <div className="admin-content-box" style={{ marginBottom: '2rem' }}>
            <h2>{editingId ? 'Edit Project' : 'New Project'}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Vietnam Decoded"
                  />
                </div>
                <div className="form-group">
                  <label>Link</label>
                  <input
                    type="text"
                    value={form.link}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  placeholder="Brief description of the project..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="text"
                    value={form.thumbnail}
                    onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="Image URL"
                  />
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        <div className="admin-content-box">
          <h2>All Projects ({projects.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0' }}>No projects yet. Create your first project!</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.displayOrder}</td>
                    <td><strong>{project.name}</strong></td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.description}
                    </td>
                    <td>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                          <FiExternalLink />
                        </a>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleEdit(project)}><FiEdit2 /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(project.id)}><FiTrash2 /></button>
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

export default AdminProjects;
