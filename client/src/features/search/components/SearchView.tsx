'use client';

import type { FormEvent } from 'react';
import type { SearchResult } from '../types';

export function SearchView({ query, setQuery, onSearch, results, onOpen }: { query: string; setQuery: (value: string) => void; onSearch: (event: FormEvent) => void; results?: SearchResult[]; onOpen: (address: string) => void }) {
  return <div className="content-view search-view"><div className="view-heading"><div><p className="eyebrow">LOOK THROUGH THE PAGES</p><h1>Search the small web</h1></div><span className="view-number">01</span></div><form className="large-search" onSubmit={onSearch}><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ocean, maps, rain…" aria-label="Search page text" /><button>Search</button></form>{results ? <div className="results"><div className="results-meta">{results.length} {results.length === 1 ? 'page' : 'pages'} found for “{query}”</div>{results.length ? results.map((result) => <button className="result-row" key={result.address} onClick={() => onOpen(result.address)}><span className="result-arrow">↗</span><span><strong>{result.title}</strong><small>{result.address} · {result.author}</small><em>{result.snippet}</em></span></button>) : <div className="quiet-empty">No page mentions that yet. Try a more wandering phrase.</div>}</div> : <div className="search-instruction"><span>TIP</span><p>Search reads the words inside pages, not just their titles. A query can be the beginning of a trail.</p></div>}</div>;
}
