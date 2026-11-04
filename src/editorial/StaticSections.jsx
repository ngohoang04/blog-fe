import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EditorialImage, EditorialImageCredit } from './SiteImages';

export function HomeIntro() {
  const { language } = useLanguage();
  return (
<div className="home-opening"><div className="opening-photo"><EditorialImage alt="Everyday street life in Hanoi" fetchPriority="high" kind="hero" /><div className="photo-caption">{"HANOI, VIETNAM "}<span>{"A place to begin looking closer."}</span></div></div><div className="shell opening-shell"><div className="opening-copy"><div className="eyebrow">{"Business · Media · Culture"}</div><h1>{language === 'vi' ? <>{"Việt Nam,"}<br />{"trong từng "}<em>{"bối cảnh."}</em></> : <>{"Vietnam,"}<br />{"in "}<em>{"context."}</em></>}</h1><p>{language === 'vi' ? <>{"Những câu chuyện về doanh nghiệp, ý tưởng và các quyết định thường ngày đang định hình một Việt Nam đổi thay."}</> : <>{"Stories about the businesses, ideas and everyday decisions shaping a changing Vietnam."}</>}</p><Link className="cta" to="/stories">{language === 'vi' ? <>{"Khám phá bài viết "}<span>{"↗"}</span></> : <>{"Explore the journal "}<span>{"↗"}</span></>}</Link><div className="opening-signature">{"Written & edited by Ngô Cúc (Camille Ngo)"}</div></div></div></div>
  );
}

export function HomeNote() {
  const { language } = useLanguage();
  return (
<div className="editor-note"><div className="eyebrow">{"Look a little closer."}</div><p>{language === 'vi' ? <>{"Một câu chuyện kinh doanh thường kết nối với nhiều điều khác: cách con người làm việc, những giá trị họ theo đuổi và cách một nơi chốn đang thay đổi."}</> : <>{"A business story rarely begins and ends with a business. It connects to how people work, what they value, and the ways a place is changing."}</>}</p></div>
  );
}

export function PersonalNote() {
  const { language } = useLanguage();
  return (
<section className="personal-note"><div className="shell personal-grid"><div><div className="eyebrow">{"Behind the journal"}</div><h2>{language === 'vi' ? <>{"Góc nhìn từ"}<br /><em>{"công việc thực tế."}</em></> : <>{"A working"}<br /><em>{"perspective."}</em></>}</h2></div><div><p>{language === 'vi' ? <>{"Mình là Cúc, hiện làm việc trong lĩnh vực giáo dục, truyền thông và vận hành. Vietnam Decoded là nơi mình dành thời gian nhìn lại những câu hỏi nảy sinh từ chính công việc đó."}</> : <>{"I’m Cúc. I work across education, communication and business operations. Vietnam Decoded is where I step back from that work to examine the questions it raises."}</>}</p><p>{language === 'vi' ? <>{"Mục đích của mình khá đơn giản: hiểu một vấn đề kỹ hơn và giúp người đọc nhìn rõ bối cảnh của nó."}</> : <>{"The intention is simple: to understand a subject more carefully, and to make the context easier to see."}</>}</p><Link className="cta" to="/about">{language === 'vi' ? <>{"Một chút về mình ↗"}</> : <>{"A little more about me ↗"}</>}</Link></div></div></section>
  );
}

export function HomeExplore() {
  const { language } = useLanguage();
  return (
<div className="explore"><Link to="/stories?category=Brands"><span>{"01 / BRANDS"}</span>{"Local ambition ↗"}</Link><Link to="/stories?category=People"><span>{"02 / PEOPLE"}</span>{"People & decisions ↗"}</Link><Link to="/stories?category=Business"><span>{"03 / BUSINESS"}</span>{"Markets in motion ↗"}</Link><Link to="/stories?category=Culture"><span>{"04 / CULTURE"}</span>{"Everyday identity ↗"}</Link></div>
  );
}

export function AboutContent() {
  const { language } = useLanguage();
  return (
<div className=""><div className="shell"><header className="quiet-pagehead"><div className="eyebrow">{"About / Ngô Thị Cúc"}</div><h1>{language === 'vi' ? <>{"Một chút "}<em>{"về mình."}</em></> : <>{"A little "}<em>{"context."}</em></>}</h1><p className="about-dek">{language === 'vi' ? <>{"Làm việc trong giáo dục, truyền thông và những thực tế thường ngày của việc vận hành một tổ chức."}</> : <>{"Working across education, communication and the everyday realities of building a business."}</>}</p></header><div className="about-editorial"><figure className="context-photo"><EditorialImage alt="A street-side cafe in Hanoi; an editorial illustration of local context" kind="profile" /><EditorialImageCredit /></figure><article className="about-prose"><div className="eyebrow">{"Ngô Thị Cúc"}</div><h2>{language === 'vi' ? <>{"Công việc gợi ra câu hỏi."}<br />{"Viết giúp mình tìm hiểu chúng."}</> : <>{"Business gives me questions."}<br />{"Writing gives me room to explore them."}</>}</h2><p>{language === 'vi' ? <>{"Mình là Đồng sáng lập và COO tại Run By Linh Academy, phụ trách các công việc liên quan đến vận hành chương trình, marketing, trải nghiệm học viên và phối hợp với giảng viên. Một phần lớn công việc của mình là kết nối ý tưởng với những điều kiện thực tế để triển khai nó."}</> : <>{"I work with Run By Linh Academy as Co-founder and COO, with responsibilities spanning programme operations, marketing, learner experience and coordination with trainers. Much of that work involves connecting an idea with the practical conditions needed to make it work."}</>}</p><p>{language === 'vi' ? <>{"Mình có nền tảng học thuật về kinh doanh quốc tế từ chương trình liên kết giữa Đại học Thương mại và Université de Rouen Normandie. Trải nghiệm nghiên cứu thị trường tại VTVLive, cùng công việc biên tập trong truyền thông sinh viên trước đây, góp phần hình thành mối quan tâm của mình về cách doanh nghiệp giao tiếp trong những thị trường và bối cảnh khác nhau."}</> : <>{"My academic background is in international business through the joint programme between Thuongmai University and Université de Rouen Normandie. Earlier experience in market research at VTVLive, alongside editorial work in student media, helped shape my interest in how businesses communicate across different markets and contexts."}</>}</p><p>{language === 'vi' ? <>{"Vietnam Decoded là một dự án nội dung cá nhân phát triển từ những mối quan tâm đó. Mình dùng không gian này để tìm hiểu kỹ hơn về thương hiệu Việt, thương mại số và truyền thông, chú ý đến các quyết định, động lực và điều kiện địa phương phía sau một kết quả mà chúng ta nhìn thấy."}</> : <>{"Vietnam Decoded is a personal editorial project that grows out of those interests. I use it to look more closely at Vietnamese brands, digital commerce and media — paying attention to the decisions, incentives and local circumstances behind a visible result."}</>}</p><p className="about-closing">{language === 'vi' ? <>{"Mình quan tâm đến những điều trở nên rõ ràng hơn khi chúng ta dành thêm thời gian cho một câu hỏi."}</> : <>{"I’m interested in what becomes clearer when we spend a little longer with a question."}</>}</p><Link className="cta" to="/stories">{language === 'vi' ? <>{"Đọc bài viết ↗"}</> : <>{"Read the journal ↗"}</>}</Link></article></div><section className="practice-links"><span className="eyebrow">{"Areas of work"}</span><Link to="/projects">{"Education & operations "}<span>{"↗"}</span></Link><Link to="/stories">{"Business & media writing "}<span>{"↗"}</span></Link></section></div></div>
  );
}

export function WorkHeader() {
  const { language } = useLanguage();
  return (
<header className="quiet-pagehead"><div className="eyebrow">{"Work & experience"}</div><h1>{language === 'vi' ? <>{"Những việc "}<em>{"mình làm."}</em></> : <>{"Work, "}<em>{"in practice."}</em></>}</h1><p className="about-dek">{language === 'vi' ? <>{"Một chút bối cảnh về những công việc hình thành góc nhìn của mình."}</> : <>{"A closer look at the work behind the perspective."}</>}</p></header>
  );
}

export function EarlierWork() {
  const { language } = useLanguage();
  return (
<section className="earlier-work"><div className="eyebrow">{"Earlier experience"}</div><p>{language === 'vi' ? <>{"Nghiên cứu thị trường và content marketing tại VTVLive, trong đó có nghiên cứu thị trường Indonesia (2025). Trải nghiệm biên tập trước đây bao gồm MC Times, một dự án truyền thông sinh viên. Ngoài ra, mình đã thực hiện hơn 7 dự án cá nhân khác."}</> : <>{"Market research and content marketing at VTVLive, including an Indonesia market-entry study (2025). Previous editorial experience includes MC Times, a student media initiative. I’ve also worked on 7+ other personal projects."}</>}</p></section>
  );
}

export function EditorialFooter() {
  const { language } = useLanguage();
  return (
<footer className="footer"><div className="shell"><div className="footgrid"><div><Link className="brand" to="/">{"VIETNAM DECODED"}</Link><p>{"Vietnamese stories, explored with curiosity."}<br />{"Written and edited by Ngô Cúc (Camille Ngo)."}</p></div><div><h4>{"Discover"}</h4><Link to="/">{"Home"}</Link><Link to="/stories">{"Stories"}</Link><Link to="/projects">{"Projects"}</Link></div><div><h4>{"Behind the stories"}</h4><Link to="/about">{"About Cúc"}</Link><Link to="/contact">{"Start a conversation ↗"}</Link><a href="/admin/login" target="_blank" rel="noopener">{"Current admin ↗"}</a></div></div><div className="footbottom"><span>© {new Date().getFullYear()} Vietnam Decoded · Ngô Cúc</span><span>{"Independent writing. Considered perspectives."}</span></div></div></footer>
  );
}

