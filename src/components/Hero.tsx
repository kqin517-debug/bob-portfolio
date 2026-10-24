import type { PageContent } from '../content';
import { ActionCard } from './ActionCard';

interface HeroProps {
  copy: PageContent['hero'];
}

export function Hero({ copy }: HeroProps) {
  return (
    <section className="hero page-shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">{copy.title}</h1>
        <p className="hero-subtitle">{copy.subtitle}</p>
        <ActionCard copy={copy} />
      </div>
      <figure className="hero-media">
        <img src="/images/workbench.webp" alt={copy.imageAlt} width="1536" height="1024" fetchPriority="high" />
      </figure>
    </section>
  );
}
