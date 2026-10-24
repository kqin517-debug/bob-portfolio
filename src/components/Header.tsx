import { useEffect, useState } from 'react';
import type { Language, PageContent } from '../content';

interface HeaderProps {
  copy: PageContent;
  language: Language;
  onLanguageChange: () => void;
}

export function Header({ copy, language, onLanguageChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen && !projectsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      setProjectsOpen(false);
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('.nav-group') && !event.target.closest('.mobile-nav-group')) {
        setProjectsOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, [menuOpen, projectsOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setProjectsOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <a className="brand" href="#top" aria-label={copy.brand} onClick={closeMenu}>
          <img className="brand-avatar" src="/images/avatar.png" alt="" width="36" height="36" />
          <span>{copy.brand}</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {copy.nav.map((item) => item.children ? (
            <div className={`nav-group${projectsOpen ? ' is-open' : ''}`} key={item.label}>
              <button
                className="nav-trigger"
                type="button"
                aria-expanded={projectsOpen}
                aria-controls="desktop-project-menu"
                onClick={() => setProjectsOpen((open) => !open)}
              >
                {item.label}
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
                </svg>
              </button>
              {projectsOpen && (
                <div id="desktop-project-menu" className="nav-submenu">
                  {item.children.map((child) => (
                    <a key={child.href} href={child.href} onClick={closeMenu}>{child.label}</a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="language-toggle text-button"
            type="button"
            onClick={() => {
              onLanguageChange();
              closeMenu();
            }}
            aria-label={copy.languageLabel}
          >
            {copy.languageToggle}
          </button>
          <a className="button button-outline header-contact" href="#contact">{copy.headerContact}</a>
          <a className="button button-dark header-work" href="#work">{copy.headerWork}</a>
          <button
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open);
              setProjectsOpen(false);
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? ' is-open' : ''}`} aria-label="Mobile navigation" hidden={!menuOpen}>
        <div className="page-shell">
          {copy.nav.map((item) => item.children ? (
            <div className={`mobile-nav-group${projectsOpen ? ' is-open' : ''}`} key={item.label}>
              <button
                className="mobile-project-trigger"
                type="button"
                aria-expanded={projectsOpen}
                aria-controls="mobile-project-menu"
                onClick={() => setProjectsOpen((open) => !open)}
              >
                <span>{item.label}</span>
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
                </svg>
              </button>
              {projectsOpen && (
                <div id="mobile-project-menu" className="mobile-project-links">
                  {item.children.map((child) => (
                    <a key={child.href} href={child.href} onClick={closeMenu}>{child.label}</a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
          ))}
          <a className="mobile-contact" href="#contact" onClick={closeMenu}>{copy.headerContact}</a>
        </div>
      </nav>
      <span className="sr-only" aria-live="polite">{language === 'en' ? 'English' : '中文'}</span>
    </header>
  );
}
