'use client';

import type { FormEvent } from 'react';
import { addressPattern, initialHtml, maxAddressLength } from '../validation';

export function PublishView({ onSubmit, error, success }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string; success: string }) {
  return <div className="content-view publish-view"><div className="view-heading"><div><p className="eyebrow">LEAVE SOMETHING BEHIND</p><h1>Publish a small site</h1></div><span className="view-number">03</span></div><p className="view-intro">Give a page a home in the fictional web. Try an address like developer.com, notes.local, or my-page.</p><form className="publish-form" onSubmit={onSubmit}><div className="form-grid"><label>Author<input name="author" required placeholder="Your name" /></label><label>Address<input name="address" required pattern={addressPattern} maxLength={maxAddressLength} placeholder="your-page.example" /></label></div><label>Title<input name="title" required maxLength={120} placeholder="A title for this page" /></label><label>HTML<textarea name="html" required defaultValue={initialHtml} maxLength={30000} spellCheck={false} /></label><div className="form-actions"><button className="primary-button" type="submit">Publish page <span>→</span></button>{error && <p className="form-error" role="alert">{error}</p>}{success && <p className="form-success" role="status">{success}</p>}</div></form></div>;
}
