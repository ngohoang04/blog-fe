import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './editorial/Header';
import { EditorialFooter as Footer } from './editorial/StaticSections';
import { SiteImages } from './editorial/SiteImages';
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
import './editorial/editorial.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Automatically scroll to top when changing routes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`app-layout ${isAdminRoute ? '' : 'editorial-site'}`}>
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
          <SiteImages><Layout>
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
          </Layout></SiteImages>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
