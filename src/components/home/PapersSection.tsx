"use client";

import { useId, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  FileText,
  Presentation,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { papers, type PaperItem } from "@/data/papers";
import { useCopyText } from "@/lib/useCopyText";
import { resolveContentUrl } from "@/lib/utils";

const actionLinkClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-slate-300 transition-colors hover:bg-white/[0.12] hover:text-white";

export function PapersSection() {
  if (papers.length === 0) return null;

  return (
    <section id="papers" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Papers
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            论文分享
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-right">
          课程论文、技术报告与阅读整理，附 PDF、代码和引用信息。
        </p>
      </div>

      <div className="space-y-5">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </section>
  );
}

function PaperCard({ paper }: { paper: PaperItem }) {
  const abstractId = useId();
  const [expanded, setExpanded] = useState(false);
  const { copied, copyText } = useCopyText(paper.bibtex ?? "");

  const meta = [paper.course, paper.venue, paper.date.slice(0, 4)]
    .filter(Boolean)
    .join(" · ");
  const hasActions = Boolean(
    paper.pdfUrl || paper.codeUrl || paper.slidesUrl || paper.bibtex
  );

  return (
    <article
      id={`paper-${paper.id}`}
      className="glass-panel glass-panel-hover scroll-mt-24 rounded-3xl border border-white/10 p-6 sm:p-7"
    >
      {meta && (
        <p className="font-mono text-[11px] tracking-[0.04em] text-muted">
          {meta}
        </p>
      )}

      <h3 className="mt-3 break-words text-lg font-semibold leading-snug text-white">
        {paper.title}
      </h3>

      {paper.authors.length > 0 && (
        <p className="mt-1.5 break-words text-xs leading-relaxed text-slate-400">
          {paper.authors.join("、")}
        </p>
      )}

      {paper.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {paper.abstract && (
        <div className="mt-4">
          <p
            id={abstractId}
            className={`text-[13px] leading-[1.9] text-slate-300 ${
              expanded ? "" : "line-clamp-4"
            }`}
          >
            {paper.abstract}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={abstractId}
            className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted transition-colors hover:text-slate-200"
          >
            {expanded ? "收起摘要" : "展开摘要"}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      {hasActions && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
          {paper.pdfUrl && (
            <a
              href={resolveContentUrl(paper.pdfUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={actionLinkClass}
              aria-label={`打开《${paper.title}》PDF`}
            >
              <FileText className="h-3.5 w-3.5" />
              PDF
            </a>
          )}

          {paper.codeUrl && (
            <a
              href={paper.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={actionLinkClass}
              aria-label={`打开《${paper.title}》源代码`}
            >
              <GithubIcon className="h-3.5 w-3.5" />
              代码
            </a>
          )}

          {paper.slidesUrl && (
            <a
              href={resolveContentUrl(paper.slidesUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={actionLinkClass}
              aria-label={`打开《${paper.title}》幻灯片`}
            >
              <Presentation className="h-3.5 w-3.5" />
              幻灯片
            </a>
          )}

          {paper.bibtex && (
            <button
              type="button"
              onClick={copyText}
              className={actionLinkClass}
              title={copied ? "引用已复制" : "复制 BibTeX"}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-accent" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "已复制" : "复制引用"}
            </button>
          )}

          <span className="sr-only" aria-live="polite">
            {copied ? "BibTeX 引用已复制到剪贴板" : ""}
          </span>
        </div>
      )}
    </article>
  );
}
