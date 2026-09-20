'use client';

import type { Person, Visit } from '../types';

export function HistoryView({ people, personId, visits, onOpen }: { people: Person[]; personId: string; visits: Visit[]; onOpen: (address: string) => void }) {
  const person = people.find((item) => item._id === personId);
  return <div className="content-view history-view"><div className="view-heading"><div><p className="eyebrow">A RECORD OF WHERE YOU HAVE BEEN</p><h1>{person?.name ?? 'Your'}’s history</h1></div><span className="view-number">02</span></div><p className="view-intro">This is a person’s trail through the web, separate from the back button.</p>{visits.length ? <div className="history-list">{visits.map((visit) => <button className="history-row" key={visit._id} onClick={() => onOpen(visit.address)}><time>{new Date(visit.visitedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</time><span><strong>{visit.title}</strong><small>{visit.address}</small></span><em>{visit.source}</em><span className="row-arrow">↗</span></button>)}</div> : <div className="quiet-empty">No visits for this person yet. Open a page and the trail will begin.</div>}</div>;
}
