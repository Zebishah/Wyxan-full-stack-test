import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isFictionalAddress } from './address';

test('accepts internal fictional address forms', () => {
  for (const address of ['developer.com', 'developer.zz', 'notes.local', 'my-page', 'archive.site', 'v2.archive.site']) {
    assert.equal(isFictionalAddress(address), true, address);
  }
});

test('rejects URLs, whitespace, and unsafe address syntax', () => {
  for (const address of ['https://google.com', 'http:google.com', 'javascript:alert(1)', 'data:text/html,x', 'file:///tmp/a', 'hello world', '/foo', '.hidden', '-draft', 'page.', 'page-']) {
    assert.equal(isFictionalAddress(address), false, address);
  }
});

test('enforces a reasonable maximum length', () => {
  assert.equal(isFictionalAddress(`a${'b'.repeat(80)}`), false);
});
