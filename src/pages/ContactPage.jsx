import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ContactSection from '../components/ContactSection';
export default function ContactPage() {
  const { language } = useLanguage();
  return <div className="editorial-contact"><header className="shell quiet-pagehead"><div className="eyebrow">{language === 'vi' ? 'Bắt đầu một cuộc trò chuyện' : 'Start a conversation'}</div><h1>{language === 'vi' ? 'Kết nối' : 'Let’s connect'}<span style={{ color:'var(--blue)' }}>.</span></h1></header><ContactSection /></div>;
}
