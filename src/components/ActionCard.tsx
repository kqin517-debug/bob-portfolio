import type { PageContent } from '../content';

interface ActionCardProps {
  copy: PageContent['hero'];
}

export function ActionCard({ copy }: ActionCardProps) {
  return (
    <div className="action-root">
      <div className="action-card">
        <a className="action-button action-button-outline" href="#work">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="6" height="6" rx="1" />
            <rect x="12" y="2" width="6" height="6" rx="1" />
            <rect x="2" y="12" width="6" height="6" rx="1" />
            <rect x="12" y="12" width="6" height="6" rx="1" />
          </svg>
          {copy.primary}
        </a>
        <div className="action-divider" aria-hidden="true">{copy.divider}</div>
        <a className="action-button action-button-dark" href="#contact">{copy.secondary}</a>
        <p className="action-note">{copy.note}</p>
      </div>
      <a className="button button-outline about-button" href="#about">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="6" r="3" />
          <path d="M4 17c.5-4 2.5-6 6-6s5.5 2 6 6" />
        </svg>
        {copy.about}
      </a>
    </div>
  );
}
