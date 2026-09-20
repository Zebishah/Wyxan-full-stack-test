export function EmptyStart({ onOpen }: { onOpen: () => void }) {
  return <div className="empty-start"><p className="eyebrow">WELCOME TO THE SMALL WEB</p><h1>A few hundred one-page worlds,<br />written by strangers.</h1><p>Choose an address, follow a thread, and see where it leads.</p><button className="primary-button" onClick={onOpen}>Open a first page <span>→</span></button></div>;
}
