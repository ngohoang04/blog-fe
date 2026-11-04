import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
import { WorkHeader, EarlierWork } from '../editorial/StaticSections';
export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const [state, setState] = useState({ loading: true, projects: [], error: false });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState(v => ({...v, loading:true}));
    api.get('/projects', { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) setState({ loading: false, projects: Array.isArray(data) ? data : data.projects || [], error: false });
    }).catch(() => { if (!controller.signal.aborted) setState({ loading: false, projects: [], error: true }); });
    return () => controller.abort();
  }, [retry]);
  return <div className="shell"><WorkHeader />
    {state.loading ? <p className="results">{t('featuredProjects.loading')}</p> : state.error ? <p className="results"><button className="cta" onClick={()=>setRetry(v=>v+1)}>{language==='vi'?'Tải lại công việc':'Retry loading work'} ↗</button></p> : <div className="project-list">{state.projects.map(project => {
      const name = project.name || project.title;
      const runByLinh = /run\s*by\s*linh/i.test(name);
      const decoded = /vietnam decoded/i.test(name);
      const earlier = /vtvlive/i.test(name);
      const thumbnail = decoded && project.thumbnail === 'https://res.cloudinary.com/d36z15vh/image/upload/v1787722649/vietnam-decoded/d0pte2m9moes4f7ackvs.jpg'
        ? '/images/editorial-hanoi-cafe.jpg'
        : project.thumbnail;
      const link = decoded && project.link === 'https://www.facebook.com/' ? null : project.link;
      return <article key={project.id} className={`work-row ${earlier ? 'work-secondary' : ''}`}><div><div className="eyebrow">{runByLinh ? (language === 'vi' ? 'Giáo dục & vận hành' : 'Education & operations') : decoded ? (language === 'vi' ? 'Dự án nội dung cá nhân' : 'Independent editorial work') : (language === 'vi' ? 'Kinh nghiệm' : 'Experience')}</div><h2>{name}</h2><div className="work-role">{runByLinh ? 'Co-founder & COO · 2024–present' : earlier ? (language === 'vi' ? 'Nghiên cứu thị trường · 2025' : 'Market research · 2025') : ''}</div>{thumbnail && <img className="work-thumbnail" src={thumbnail} alt={name} loading="lazy" />}</div><div><p>{project.description}</p>
      {runByLinh && <p className="work-detail">{language === 'vi' ? 'Lập kế hoạch triển khai chương trình, tổ chức quy trình nội bộ và phối hợp giữa học viên, giảng viên và đội ngũ.' : 'Day-to-day work includes planning programme delivery, organising internal workflows and coordinating learners, trainers and the team.'}</p>}
      {decoded && <p className="work-detail">{language === 'vi' ? 'Các bài viết về kinh doanh Việt Nam, thương mại số và truyền thông, chú ý đến bối cảnh phía sau những chuyển động thị trường.' : 'Long-form writing on Vietnamese business, digital commerce and media, with attention to the context behind market shifts.'}</p>}
      {link && <a href={link} target="_blank" rel="noopener noreferrer" className="cta">{language === 'vi' ? 'Xem dự án' : 'Project link'} ↗</a>}</div></article>;
    })}</div>}
    <EarlierWork />
  </div>;
}
