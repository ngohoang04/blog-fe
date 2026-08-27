import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import CreatePost from './pages/admin/CreatePost';
import AdminProjects from './pages/admin/AdminProjects';
import AdminMessages from './pages/admin/AdminMessages';
import AdminComments from './pages/admin/AdminComments';
import AdminSettings from './pages/admin/AdminSettings';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-layout">
      {!isAdminRoute && <Navbar />}
      <main className="main-content">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/stories/:slug" element={<StoryDetailPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/create" element={<CreatePost />} />
              <Route path="/admin/edit/:id" element={<CreatePost />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/comments" element={<AdminComments />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
