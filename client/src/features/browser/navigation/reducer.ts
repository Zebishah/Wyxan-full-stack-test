import type { NavigationEntry, NavigationState, SearchResult, SiteSnapshot } from './types';

export type { NavigationEntry, NavigationState, SearchResult, SiteSnapshot } from './types';

export const initialNavigationState: NavigationState = {
  entries: [],
  currentIndex: -1
};

const id = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createSiteEntry = (site: SiteSnapshot): NavigationEntry => ({
  id: id(), kind: 'site', address: site.address, site, scrollY: 0
});

export const createNotFoundEntry = (address: string): NavigationEntry => ({
  id: id(), kind: 'not-found', address, scrollY: 0
});

export const createSearchEntry = (query: string, results: SearchResult[]): NavigationEntry => ({
  id: id(), kind: 'search', query, results, scrollY: 0
});

export const navigate = (state: NavigationState, entry: NavigationEntry): NavigationState => {
  const entries = state.entries.slice(0, state.currentIndex + 1);
  entries.push(entry);
  return { entries, currentIndex: entries.length - 1 };
};

export const back = (state: NavigationState): NavigationState =>
  state.currentIndex > 0 ? { ...state, currentIndex: state.currentIndex - 1 } : state;

export const forward = (state: NavigationState): NavigationState =>
  state.currentIndex < state.entries.length - 1
    ? { ...state, currentIndex: state.currentIndex + 1 } : state;

export const updateCurrentScroll = (state: NavigationState, scrollY: number): NavigationState => {
  if (state.currentIndex < 0) return state;
  const entries = state.entries.slice();
  entries[state.currentIndex] = { ...entries[state.currentIndex], scrollY };
  return { ...state, entries };
};
