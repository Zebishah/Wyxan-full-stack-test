export type NavigationKind = 'site' | 'search' | 'not-found';

export type SearchResult = {
  address: string;
  title: string;
  author: string;
  snippet: string;
};

export type SiteSnapshot = {
  address: string;
  title: string;
  author: string;
  html: string;
};

export type NavigationEntry = {
  id: string;
  kind: NavigationKind;
  address?: string;
  query?: string;
  results?: SearchResult[];
  site?: SiteSnapshot;
  scrollY: number;
};

export type NavigationState = {
  entries: NavigationEntry[];
  currentIndex: number;
};
