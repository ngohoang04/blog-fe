import React, { useState } from 'react';
import { FiMail, FiMapPin, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
import './ContactSection.css';

const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: t('contact.sendingStatus') });
    
    try {
      await api.post('/contact', formData);
      setStatus({ type: 'success', message: t('contact.success') });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: t('contact.error') });
    }
  };

  return (
    <section className="contact-section">
      <div className="container contact-container">
        <div className="contact-info">
          <h2 className="contact-title">{t('contact.title')}</h2>
          <p className="contact-desc">
            {t('contact.desc')}
          </p>
          
          <div className="contact-details">
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>hello@vietnamdecoded.com</span>
            </div>
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <span>Hanoi, Vietnam</span>
            </div>
          </div>
          
          <div className="contact-socials">
            <a href="#" className="social-link"><FiLinkedin /> LinkedIn</a>
            <a href="#" className="social-link"><FiInstagram /> Instagram</a>
          </div>
        </div>
        
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">{t('contact.name')}</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('contact.email')}</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">{t('contact.subject')}</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact.message')}</label>
              <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            
            {status.message && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}
            
            <button type="submit" className="btn-primary" disabled={status.type === 'loading'}>
              {status.type === 'loading' ? t('contact.sending') : `${t('contact.send')} →`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
