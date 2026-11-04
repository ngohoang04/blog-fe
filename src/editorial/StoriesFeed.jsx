import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
const categories = ['All', 'Brands', 'People', 'Business', 'Culture'];
function readTime(value, language) {
  const amount = String(value || '5').replace(/\s*min read$/i, '').trim();
  return `${amount} ${language === 'vi' ? 'phút đọc' : 'min read'}`;
}
export function EditorialStoryCard({ story }) {
  const { language, t } = useLanguage();
  const alt = story.originalLang && story.originalLang !== language && story.titleAlt;
  const title = alt ? story.titleAlt : story.title;
  const excerpt = alt && story.excerptAlt ? story.excerptAlt : story.excerpt;
  const category = story.Categories?.[0]?.name || story.category || t('storyCard.story');
  return <Link className="story" to={`/stories/${story.slug}`}><div className="photo">
    {story.thumbnail && !(String(story.id) === '90001' && story.thumbnail === 'https://res.cloudinary.com/d36z15vh/image/upload/v1787642844/vietnam-decoded/smv0yofxrvxo50cwbe1j.jpg') ? <img src={story.thumbnail} alt={title} loading="lazy" /> :
      <div className="fallback"><span>VIETNAM DECODED</span><b>{category}<br />in focus.</b><i>BUSINESS, MEDIA & EVERYDAY CONTEXT</i></div>}
    </div><div className="meta">{category} · {readTime(story.readTime, language)}</div>
    <h3>{title}</h3>{excerpt && <p>{excerpt}</p>}
  </Link>;
}
export default function StoriesFeed({ home = false }) {
  const { language, t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const category = categories.includes(params.get('category')) ? params.get('category') : 'All';
  const query = params.get('search') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [draft, setDraft] = useState(query);
  const [state, setState] = useState({ loading: true, stories: [], pages: 1, total: 0, error: false });
  const [retry, setRetry] = useState(0);
  useEffect(() => setDraft(query), [query]);
  useEffect(() => {
    const controller = new AbortController();
    const request = { page: home ? 1 : page, limit: home ? 3 : 8 };
    if (!home && category !== 'All') request.category = category;
    if (!home && query.trim()) request.search = query.trim();
    setState(v => ({ ...v, loading: true, error: false }));
    api.get('/posts', { params: request, signal: controller.signal }).then(({ data }) => {
      if (controller.signal.aborted) return;
      const stories = Array.isArray(data) ? data : data.posts || [];
      setState({ loading: false, stories, pages: data.pages || 1, total: data.total ?? stories.length, error: false });
    }).catch(() => { if (!controller.signal.aborted) setState({ loading: false, stories: [], pages: 1, total: 0, error: true }); });
    return () => controller.abort();
  }, [home, page, category, query, retry]);
  const update = updates => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(updates)) value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };
  return <>
    {!home && <div className="archive-tools">
      <form onSubmit={e => { e.preventDefault(); update({ search: draft.trim(), page: '' }); }} className="editorial-search">
        <label className="sr-only" htmlFor="editorial-search">{t('latestStories.searchPlaceholder')}</label>
        <input id="editorial-search" className="search" type="search" value={draft} onChange={e => { setDraft(e.target.value); if (!e.target.value) update({ search: '', page: '' }); }} placeholder={t('latestStories.searchPlaceholder')} />
        <button className="cta" type="submit">{language === 'vi' ? 'Tìm kiếm' : 'Search'} ↗</button>
      </form>
      <div className="filters">{categories.map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'active' : ''} onClick={() => update({ category: c === 'All' ? '' : c, page: '' })}>{t(`latestStories.${c.toLowerCase()}`)}</button>)}</div>
    </div>}
    <div aria-live="polite" className="results">{state.loading ? t('latestStories.loading') : state.error ? <><span>{language === 'vi' ? 'Chưa tải được bài viết. ' : 'Unable to load stories. '}</span><button className="cta" onClick={() => setRetry(v => v + 1)}>{language === 'vi' ? 'Thử lại' : 'Try again'}</button></> : !home && `${state.total} ${language === 'vi' ? 'bài viết' : state.total === 1 ? 'story' : 'stories'}`}</div>
    {!state.loading && !state.error && (state.stories.length ? <div className={`stories ${home ? '' : 'allstories'}`}>{state.stories.map(s => <EditorialStoryCard key={s.id || s.slug} story={s} />)}</div> : <p className="no-results">{t('storiesPage.noStories')}</p>)}
    {!home && state.pages > 1 && <nav className="editorial-pagination" aria-label={language === 'vi' ? 'Phân trang' : 'Pagination'}>
      <button disabled={page <= 1} onClick={() => update({ page: String(page - 1) })} aria-label={language === 'vi' ? 'Trang trước' : 'Previous page'}>←</button>
      <span>{page} / {state.pages}</span>
      <button disabled={page >= state.pages} onClick={() => update({ page: String(page + 1) })} aria-label={language === 'vi' ? 'Trang sau' : 'Next page'}>→</button>
    </nav>}
  </>;
}
