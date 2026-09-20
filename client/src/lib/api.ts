export type Site = { _id?: string; address: string; title: string; author: string; html: string };
export type Person = { _id: string; name: string; slug: string; bio: string };
export type SearchResult = { address: string; title: string; author: string; snippet: string };
export type Visit = { _id: string; address: string; title: string; source: string; visitedAt: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) } });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string | string[] };
    const message = Array.isArray(payload.message) ? payload.message.join(', ') : payload.message;
    throw new Error(message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  people: () => request<Person[]>('/people'),
  site: (address: string) => request<Site>(`/sites/${encodeURIComponent(address)}`),
  search: (query: string) => request<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`),
  visits: (personId: string) => request<Visit[]>(`/visits/person/${personId}`),
  publish: (payload: { address: string; title: string; author: string; html: string }) => request<Site>('/sites', { method: 'POST', body: JSON.stringify(payload) }),
  visit: (payload: { personId: string; address: string; title: string; source: string }) => request<Visit>('/visits', { method: 'POST', body: JSON.stringify(payload) })
};
