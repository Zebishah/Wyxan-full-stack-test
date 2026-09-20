'use client';

import { useRef } from 'react';
import type { Site } from '../../../lib/api';

export const fictionalAddress = /^(?=.{1,80}$)[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i;

export function SiteRenderer({ site, onNavigate }: { site: Site; onNavigate: (address: string) => void }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const bindLinks = () => {
    const frame = frameRef.current;
    const document = frame?.contentDocument;
    if (!document) return;
    document.querySelectorAll('a').forEach((anchor) => {
      const handler = (event: Event) => {
        event.preventDefault();
        const href = anchor.getAttribute('href')?.trim().toLowerCase() ?? '';
        if (fictionalAddress.test(href)) onNavigate(href);
      };
      anchor.addEventListener('click', handler);
    });
  };

  return (
    <div className="site-wrap">
      <div className="site-label"><span>FICTIONAL SITE</span><span>{site.address}</span></div>
      <iframe
        ref={frameRef}
        className="site-frame"
        title={`${site.title} at ${site.address}`}
        srcDoc={site.html}
        sandbox="allow-same-origin"
        onLoad={bindLinks}
      />
      <p className="site-footnote">Rendered in a contained page · authored by {site.author}</p>
    </div>
  );
}
