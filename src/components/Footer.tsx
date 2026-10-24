import type { PageContent } from '../content';

interface FooterProps {
  copy: PageContent;
}

export function Footer({ copy }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-shell">
        <a className="brand footer-brand" href="#top" aria-label={copy.brand}>
          <img className="brand-avatar" src="/images/avatar.png" alt="" width="36" height="36" />
          <span>{copy.brand}</span>
        </a>
        <p>{copy.footer.note}</p>
        <a className="text-link" href="#top">{copy.footer.backToTop}<span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
