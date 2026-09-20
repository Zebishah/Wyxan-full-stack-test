'use client';

import type { Person } from '../../../lib/api';

export function PersonSelector({ people, personId, onChange }: { people: Person[]; personId: string; onChange: (value: string) => void }) {
  return <label>Browsing as <select value={personId} onChange={(event) => onChange(event.target.value)} aria-label="Select browsing person">{people.map((person) => <option key={person._id} value={person._id}>{person.name}</option>)}</select></label>;
}
