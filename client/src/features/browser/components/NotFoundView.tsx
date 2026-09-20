export function NotFoundView({ address, onTryAgain }: { address: string; onTryAgain: () => void }) {
  return <div className="not-found-view"><span className="big-index">404</span><p className="eyebrow">NO SUCH PLACE</p><h1>{address || 'That address'}</h1><p>This corner of the small web has not been built yet. It may be a typo, a broken link, or a place someone is still imagining.</p><button className="text-button" onClick={onTryAgain}>Try the address again <span>↗</span></button></div>;
}
