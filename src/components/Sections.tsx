import { useState, type FormEvent } from 'react';
import type { DownloadableFile, PageContent, SkillNode } from '../content';

interface SectionsProps {
  copy: PageContent;
}

type TicketStatus = 'idle' | 'submitting' | 'success' | 'error';

interface DownloadFileProps {
  file: DownloadableFile;
  labels: PageContent['download'];
}

function DownloadFile({ file, labels }: DownloadFileProps) {
  const storageKey = `portfolio-downloads:${file.href}`;
  const [downloadCount, setDownloadCount] = useState(() => {
    try {
      const stored = Number(window.localStorage.getItem(storageKey));
      return Number.isFinite(stored) && stored >= 0 ? stored : 0;
    } catch {
      return 0;
    }
  });

  const recordDownload = () => {
    setDownloadCount((current) => {
      const next = current + 1;
      try {
        window.localStorage.setItem(storageKey, String(next));
      } catch {
        // The download still works when storage is unavailable.
      }
      return next;
    });
  };

  return (
    <a
      className="download-file"
      href={file.href}
      download={file.name}
      onClick={recordDownload}
    >
      <span className="download-file-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20">
          <path d="M5 2.5h6l4 4V17.5H5zM11 2.5v4h4M10 9v4M8 11.5l2 2 2-2" />
        </svg>
      </span>
      <span className="download-file-info">
        <span className="download-file-name">{file.name}</span>
        <span className="download-file-size">{file.size}</span>
      </span>
      <span className="download-file-side">
        <span className="download-file-count" aria-live="polite">
          {labels.count} <strong>{downloadCount}</strong>
        </span>
        <span className="download-file-action">
          {labels.action}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 3v8M4.5 7.5 8 11l3.5-3.5" />
          </svg>
        </span>
      </span>
    </a>
  );
}

function SkillTree({
  nodes,
  level = 0,
  downloadLabels,
}: {
  nodes: SkillNode[];
  level?: number;
  downloadLabels: PageContent['download'];
}) {
  return (
    <div className={`skill-tree${level > 0 ? ' skill-tree-nested' : ''}`}>
      {nodes.map((node, index) => (
        <details
          id={node.id}
          className="skill-node"
          data-level={level}
          key={node.id}
          open={index === 0 && (level === 0 || (level === 1 && Boolean(node.children?.length))) ? true : undefined}
        >
          <summary>
            <span className="skill-node-title">{node.title}</span>
            <svg className="skill-chevron" viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3.5 6 4.5 4.5L12.5 6" />
            </svg>
          </summary>
          <div className="skill-node-body">
            {node.children && node.children.length > 0 ? (
              <SkillTree nodes={node.children} level={level + 1} downloadLabels={downloadLabels} />
            ) : node.file ? (
              <DownloadFile file={node.file} labels={downloadLabels} />
            ) : (
              <p className="skill-node-empty">{node.emptyNote}</p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

function ContactForm({ copy }: { copy: PageContent['contact'] }) {
  const [status, setStatus] = useState<TicketStatus>('idle');
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const website = String(data.get('website') ?? '');
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!name || !emailPattern.test(email) || message.length < 5) {
      setError(copy.form.required);
      setStatus('error');
      return;
    }

    setError('');
    setStatus('submitting');

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; ticket?: { id?: string } }
        | null;

      if (!response.ok || !result?.ok || !result.ticket?.id) {
        throw new Error('request failed');
      }

      setTicketId(result.ticket.id);
      setStatus('success');
      formElement.reset();
    } catch {
      setError(copy.form.error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-form contact-success" role="status">
        <p className="contact-success-kicker">{copy.form.successTitle}</p>
        <p className="contact-success-body">{copy.form.successBody}</p>
        <p className="contact-ticket-id">{ticketId}</p>
        <button
          className="button button-outline contact-success-button"
          type="button"
          onClick={() => {
            setStatus('idle');
            setTicketId('');
          }}
        >
          {copy.form.successAgain}
        </button>
      </div>
    );
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      aria-busy={status === 'submitting'}
      noValidate
    >
      <div className="contact-form-grid">
        <div className="contact-field">
          <label htmlFor="contact-name">{copy.form.name}</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            placeholder={copy.form.namePlaceholder}
          />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">{copy.form.email}</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={200}
            placeholder={copy.form.emailPlaceholder}
          />
        </div>
        <div className="contact-field contact-field-full">
          <label htmlFor="contact-subject">{copy.form.subject}</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={200}
            placeholder={copy.form.subjectPlaceholder}
          />
        </div>
        <div className="contact-field contact-field-full">
          <label htmlFor="contact-message">{copy.form.message}</label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={5000}
            placeholder={copy.form.messagePlaceholder}
          />
        </div>
      </div>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="contact-form-footer">
        <p className="contact-note">{copy.form.note}</p>
        <button
          className="button button-dark contact-submit"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? copy.form.submitting : copy.form.submit}
        </button>
      </div>
      {status === 'error' && (
        <p className="contact-status error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export function Sections({ copy }: SectionsProps) {
  return (
    <>
      <section id="about" className="section about-section page-shell" aria-labelledby="about-title">
        <h2 id="about-title" className="section-title">{copy.about.title}</h2>
        <div className="about-copy">
          <p className="section-intro">{copy.about.intro}</p>
          <p>{copy.about.body}</p>
          <a className="text-link" href="#skills">{copy.about.link}<span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section id="work" className="section work-section page-shell" aria-labelledby="work-title">
        <div className="section-heading-row">
          <h2 id="work-title" className="section-title">{copy.work.title}</h2>
          <p>{copy.work.intro}</p>
        </div>
        {copy.work.projects.length > 0 && (
          <div className="project-list">
            {copy.work.projects.map((project) => (
              <details className="project" key={project.title}>
                <summary>
                  <span className="project-title">{project.title}</span>
                  <span className="project-category">{project.category}</span>
                  <span className="project-toggle" aria-hidden="true" />
                </summary>
                <div className="project-detail">
                  <p className="project-summary">{project.summary}</p>
                  <p>{project.detail}</p>
                  <p className="project-meta">{project.meta}</p>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      <section id="skills" className="section page-shell" aria-labelledby="skills-title">
        <h2 id="skills-title" className="section-title">{copy.skills.title}</h2>
        <SkillTree nodes={copy.skills.groups} downloadLabels={copy.download} />
      </section>

      <section id="journey" className="section page-shell" aria-labelledby="journey-title">
        <h2 id="journey-title" className="section-title">{copy.journey.title}</h2>
        <div className="journey-list">
          {copy.journey.items.map((item) => (
            <article className="journey-item" key={item.title}>
              <time>{item.period}</time>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact-section page-shell" aria-labelledby="contact-title">
        <h2 id="contact-title" className="contact-title">{copy.contact.title}</h2>
        <p className="contact-body">{copy.contact.body}</p>
        <ContactForm copy={copy.contact} />
      </section>
    </>
  );
}
