import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HomeIntro, HomeNote, HomeExplore, PersonalNote } from '../editorial/StaticSections';
import StoriesFeed from '../editorial/StoriesFeed';
export default function HomePage() {
  const { language } = useLanguage();
  return <div className="editorial-home"><HomeIntro /><div className="shell"><HomeNote /></div>
    <section className="shell section"><div className="sectiontitle"><div><div className="eyebrow">{language === 'vi' ? 'Bài viết mới' : 'Recent writing'}</div><h2>{language === 'vi' ? 'Từ trang viết.' : 'From the journal.'}</h2></div><Link className="cta" to="/stories">{language === 'vi' ? 'Tất cả bài viết' : 'All stories'} ↗</Link></div><StoriesFeed home /></section>
    <PersonalNote /><section className="shell section"><div className="sectiontitle"><div><div className="eyebrow">{language === 'vi' ? 'Khám phá chủ đề' : 'Explore the subjects'}</div><h2>{language === 'vi' ? 'Bắt đầu từ đâu.' : 'Where to begin.'}</h2></div></div><HomeExplore /></section>
  </div>;
}
