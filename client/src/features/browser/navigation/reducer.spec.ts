import { describe, expect, it } from 'vitest';
import {
  back, createNotFoundEntry, createSearchEntry, createSiteEntry, forward,
  initialNavigationState, navigate, updateCurrentScroll
} from './reducer';

const site = (address: string) => createSiteEntry({ address, title: address, author: 'Test', html: '<p>page</p>' });

describe('browser navigation model', () => {
  it('navigates, goes back and forward, and respects boundaries', () => {
    let state = navigate(initialNavigationState, site('a.zz'));
    state = navigate(state, site('b.zz'));
    state = navigate(state, site('c.zz'));
    expect(state.entries[state.currentIndex].address).toBe('c.zz');
    state = back(back(state));
    expect(state.entries[state.currentIndex].address).toBe('a.zz');
    state = forward(state);
    expect(state.entries[state.currentIndex].address).toBe('b.zz');
    expect(back(back(state)).currentIndex).toBe(0);
    expect(back(back(back(state))).currentIndex).toBe(0);
  });

  it('clears the forward branch after a new navigation', () => {
    let state = navigate(initialNavigationState, site('a.zz'));
    state = navigate(state, site('b.zz'));
    state = navigate(state, site('c.zz'));
    state = navigate(back(state), site('x.zz'));
    expect(state.entries.map((entry) => entry.address)).toEqual(['a.zz', 'b.zz', 'x.zz']);
    expect(forward(state)).toEqual(state);
  });

  it('keeps search and broken addresses as first-class entries', () => {
    let state = navigate(initialNavigationState, createSearchEntry('ocean', []));
    state = navigate(state, createNotFoundEntry('lost.zz'));
    expect(back(state).entries[0].kind).toBe('search');
    expect(state.entries[1].kind).toBe('not-found');
  });

  it('treats a link destination as ordinary browser navigation', () => {
    let state = navigate(initialNavigationState, site('tidepool.zz'));
    state = navigate(state, site('observatory.zz'));
    expect(state.entries[state.currentIndex].address).toBe('observatory.zz');
    const returned = back(state);
    expect(returned.entries[returned.currentIndex].address).toBe('tidepool.zz');
  });

  it('retains restoration scroll state on the entry', () => {
    const state = navigate(initialNavigationState, site('a.zz'));
    expect(updateCurrentScroll(state, 412).entries[0].scrollY).toBe(412);
  });
});
