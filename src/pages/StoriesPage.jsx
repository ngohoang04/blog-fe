import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import StoriesFeed from '../editorial/StoriesFeed';
export default function StoriesPage() {
  const { language, t } = useLanguage();
  return <div className="shell"><header className="quiet-pagehead"><div className="eyebrow">{language === 'vi' ? 'Trang viết / Những góc nhìn' : 'The journal / A collection of perspectives'}</div><h1>{t('nav.stories')}<span style={{color:'var(--blue)'}}>.</span></h1><p className="about-dek">{language === 'vi' ? 'Thương hiệu, con người, kinh doanh và văn hoá Việt Nam. Bắt đầu từ một câu hỏi, khám phá những kết nối.' : 'Vietnamese brands, people, business and culture. Start with a question. Stay for the connections.'}</p></header><StoriesFeed /></div>;
}
