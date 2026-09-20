'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  back, createNotFoundEntry, createSearchEntry, createSiteEntry, forward,
  initialNavigationState, navigate, updateCurrentScroll
} from '../navigation/reducer';
import type { NavigationEntry, NavigationState } from '../navigation/types';
import { api, type Person, type Site, type Visit } from '../../../lib/api';
import { HistoryView } from '../../history/components/HistoryView';
import { PublishView } from '../../publishing/components/PublishView';
import { SearchView } from '../../search/components/SearchView';
import { PersonSelector } from '../../people/components/PersonSelector';
import { EmptyStart } from './EmptyStart';
import { NotFoundView } from './NotFoundView';
import { SiteRenderer } from './SiteRenderer';
import type { Panel, Source } from '../types';

export function BrowserApp() {
  const [navigation, setNavigation] = useState<NavigationState>(initialNavigationState);
  const [address, setAddress] = useState('tidepool.zz');
  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState('');
  const [history, setHistory] = useState<Visit[]>([]);
  const [panel, setPanel] = useState<Panel>('site');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');
  const viewportRef = useRef<HTMLDivElement>(null);
  const current = navigation.currentIndex >= 0 ? navigation.entries[navigation.currentIndex] : undefined;
  const currentId = current?.id;
  const currentScrollY = current?.scrollY ?? 0;

  useEffect(() => {
    api.people().then((result) => {
      setPeople(result);
      const saved = window.localStorage.getItem('small-web-person');
      setPersonId(result.some((person) => person._id === saved) ? saved! : result[0]?._id ?? '');
    }).catch((error: Error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    if (personId) api.visits(personId).then(setHistory).catch((error: Error) => setMessage(error.message));
  }, [personId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport && currentId) viewport.scrollTop = currentScrollY;
  }, [currentId, currentScrollY]);

  const persistScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport) setNavigation((state) => updateCurrentScroll(state, viewport.scrollTop));
  }, []);

  const recordVisit = useCallback((site: Site, source: Source) => {
    if (!personId) return;
    api.visit({ personId, address: site.address, title: site.title, source }).then(() => api.visits(personId).then(setHistory)).catch(() => undefined);
  }, [personId]);

  const showSite = useCallback((site: Site, source: Source) => {
    persistScroll();
    setNavigation((state) => navigate(state, createSiteEntry(site)));
    setAddress(site.address);
    setPanel('site');
    setMessage('');
    recordVisit(site, source);
  }, [persistScroll, recordVisit]);

  const openAddress = useCallback(async (rawAddress: string, source: Source = 'typed') => {
    const nextAddress = rawAddress.trim().toLowerCase();
    setAddress(nextAddress);
    if (!nextAddress) return;
    setLoading(true); setMessage('');
    try {
      const site = await api.site(nextAddress);
      showSite(site, source);
    } catch (error) {
      persistScroll();
      setNavigation((state) => navigate(state, createNotFoundEntry(nextAddress)));
      setPanel('not-found');
      setMessage(error instanceof Error ? error.message : 'That address could not be opened.');
    } finally { setLoading(false); }
  }, [persistScroll, showSite]);

  const selectedEntry = useCallback((entry: NavigationEntry, source: Source) => {
    setAddress(entry.address ?? '');
    setPanel(entry.kind);
    if (entry.kind === 'site' && entry.site) recordVisit(entry.site as Site, source);
    if (entry.kind === 'search') setQuery(entry.query ?? '');
  }, [recordVisit]);

  const move = useCallback((direction: 'back' | 'forward') => {
    const withScroll = updateCurrentScroll(navigation, viewportRef.current?.scrollTop ?? 0);
    const next = direction === 'back' ? back(withScroll) : forward(withScroll);
    setNavigation(next);
    const entry = next.currentIndex >= 0 ? next.entries[next.currentIndex] : undefined;
    if (entry) selectedEntry(entry, direction);
    setMessage('');
  }, [navigation, selectedEntry]);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setLoading(true); setMessage('');
    try {
      const results = await api.search(cleanQuery);
      persistScroll();
      setNavigation((state) => navigate(state, createSearchEntry(cleanQuery, results)));
      setPanel('search');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Search is unavailable.'); }
    finally { setLoading(false); }
  };

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPublishError(''); setPublishSuccess('');
    const form = new FormData(event.currentTarget);
    const payload = { address: String(form.get('address') ?? '').trim().toLowerCase(), title: String(form.get('title') ?? '').trim(), author: String(form.get('author') ?? '').trim(), html: String(form.get('html') ?? '') };
    try {
      const site = await api.publish(payload);
      setPublishSuccess(`Published ${site.address}. Opening it now…`);
      showSite(site, 'typed');
      event.currentTarget.reset();
    } catch (error) { setPublishError(error instanceof Error ? error.message : 'The site could not be published.'); }
  };

  const currentTitle = useMemo(() => current?.kind === 'site' && current.site ? current.site.title : current?.kind === 'search' ? `Search: ${current.query}` : current?.kind === 'not-found' ? 'Address not found' : 'The Small Web', [current]);
  const onPersonChange = (value: string) => { setPersonId(value); window.localStorage.setItem('small-web-person', value); };

  return <main className="app-shell">
    <header className="topbar"><div className="brand-mark" aria-label="The Small Web home"><span className="brand-dot" /> <span>the small web</span></div><div className="utility-line"><span className="eyebrow">A browser for a handmade internet</span><PersonSelector people={people} personId={personId} onChange={onPersonChange} /></div></header>
    <section className="browser-bar" aria-label="Browser controls"><div className="nav-buttons"><button className="icon-button" onClick={() => move('back')} disabled={navigation.currentIndex <= 0} aria-label="Back">←</button><button className="icon-button" onClick={() => move('forward')} disabled={navigation.currentIndex >= navigation.entries.length - 1} aria-label="Forward">→</button></div><form className="address-form" onSubmit={(event) => { event.preventDefault(); void openAddress(address); }}><span className="address-lock">⌁</span><input value={address} onChange={(event) => setAddress(event.target.value)} aria-label="Fictional address" spellCheck={false} /><button type="submit">Go</button></form><nav className="browser-nav" aria-label="Application views"><button className={panel === 'search' ? 'active' : ''} onClick={() => setPanel('search')}>Search</button><button className={panel === 'history' ? 'active' : ''} onClick={() => setPanel('history')}>History</button><button className={panel === 'publish' ? 'active' : ''} onClick={() => setPanel('publish')}>Publish</button></nav></section>
    <div className="status-strip"><span className="status-live" /> {loading ? 'Finding a page…' : currentTitle}<span className="entry-count">{navigation.entries.length ? `${navigation.currentIndex + 1} / ${navigation.entries.length}` : 'ready'}</span></div>
    {message && <div className="toast" role="status">{message}</div>}
    <div className="viewport" ref={viewportRef}>{loading && <div className="loading-line" />}{panel === 'site' && current?.site && <SiteRenderer site={current.site as Site} onNavigate={(next) => void openAddress(next, 'link')} />}{panel === 'not-found' && <NotFoundView address={current?.address ?? address} onTryAgain={() => void openAddress(address)} />}{panel === 'search' && <SearchView query={query} setQuery={setQuery} onSearch={handleSearch} results={current?.kind === 'search' ? (current.results ?? []) : undefined} onOpen={(next) => void openAddress(next, 'search')} />}{panel === 'history' && <HistoryView people={people} personId={personId} visits={history} onOpen={(next) => void openAddress(next, 'history')} />}{panel === 'publish' && <PublishView onSubmit={handlePublish} error={publishError} success={publishSuccess} />}{!current && panel === 'site' && <EmptyStart onOpen={() => void openAddress('tidepool.zz')} />}</div>
    <footer className="shell-footer"><span>Nothing here is real. Everything here is worth wandering through.</span><span>Scroll is remembered when you go back.</span></footer>
  </main>;
}
