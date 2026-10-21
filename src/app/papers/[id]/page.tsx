import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  FileText,
  Presentation,
} from "lucide-react";
import { ArticleBody } from "@/components/content/ArticleBody";
import { CopyButton } from "@/components/content/CopyButton";
import { ModuleShell } from "@/components/layout/ModuleShell";
import { GithubIcon } from "@/components/ui/Icons";
import { papers } from "@/data/papers";
import {
  formatDate,
  getPaperCategory,
  getPaperReadingMinutes,
} from "@/lib/content";
import { resolveContentUrl } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return papers.map((paper) => ({ id: paper.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const paper = papers.find((item) => item.id === id);

  if (!paper) return { title: "论文未找到" };

  return {
    title: `${paper.title} | 论文索引`,
    description: paper.abstract.slice(0, 140),
  };
}

const resourceLinkClass =
  "flex w-full items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-left text-[11.5px] text-slate-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white";

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = papers.find((item) => item.id === id);

  if (!paper) notFound();

  const category = getPaperCategory(paper.category);
  const categoryName = category?.name ?? paper.category;
  const venue =
    paper.venue && paper.venue !== categoryName ? paper.venue : undefined;
  const sorted = [...papers].sort((a, b) => b.date.localeCompare(a.date));
  const currentIndex = sorted.findIndex((item) => item.id === paper.id);
  const newer = sorted[currentIndex - 1];
  const older = sorted[currentIndex + 1];
  const related = papers.filter(
    (item) => item.id !== paper.id && item.category === paper.category
  );
  const readingMinutes = getPaperReadingMinutes(paper);
  const hasResources = Boolean(
    paper.pdfUrl || paper.codeUrl || paper.slidesUrl || paper.bibtex
  );

  return (
    <ModuleShell active="papers">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="面包屑"
          className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted"
        >
          <Link href="/" className="transition-colors hover:text-slate-200">
            首页
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <Link
            href="/papers/"
            className="transition-colors hover:text-slate-200"
          >
            论文索引
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="truncate text-slate-400">{categoryName}</span>
        </nav>

        <header className="mt-6 border-b border-white/[0.06] pb-7">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 font-medium text-accent">
              {categoryName}
            </span>
            {venue && (
              <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-slate-300">
                {venue}
              </span>
            )}
            {paper.course && (
              <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-slate-300">
                {paper.course}
              </span>
            )}
            <time dateTime={paper.date} className="font-mono text-muted">
              {formatDate(paper.date)}
            </time>
            <span className="font-mono text-muted">
              约 {readingMinutes} 分钟
            </span>
          </div>

          <h1 className="mt-4 text-balance text-2xl font-semibold leading-[1.25] tracking-tight text-white sm:text-3xl md:text-4xl">
            {paper.title}
          </h1>

          {paper.authors.length > 0 && (
            <p className="mt-3 text-sm text-slate-300">
              {paper.authors.join("、")}
            </p>
          )}

          {paper.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {paper.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10.5px] text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <article className="min-w-0">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Abstract · 摘要
              </p>
              <p className="mt-3 text-[13.5px] leading-[1.95] text-slate-300">
                {paper.abstract}
              </p>
            </div>

            {paper.sections && paper.sections.length > 0 && (
              <div className="mt-10">
                <ArticleBody sections={paper.sections} />
              </div>
            )}

            {(newer || older) && (
              <nav
                aria-label="相邻论文"
                className="mt-12 grid gap-3 border-t border-white/[0.06] pt-6 sm:grid-cols-2"
              >
                {newer && (
                  <Link
                    href={`/papers/${newer.id}/`}
                    className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <span className="flex items-center gap-1.5 text-[10.5px] text-muted">
                      <ArrowLeft className="h-3 w-3" />
                      更新一篇
                    </span>
                    <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-slate-300 transition-colors group-hover:text-white">
                      {newer.title}
                    </p>
                  </Link>
                )}
                {older && (
                  <Link
                    href={`/papers/${older.id}/`}
                    className={`group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04] ${
                      newer ? "sm:text-right" : "sm:col-start-2"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-[10.5px] text-muted sm:justify-end">
                      更早一篇
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-slate-300 transition-colors group-hover:text-white">
                      {older.title}
                    </p>
                  </Link>
                )}
              </nav>
            )}

            <div className="mt-6">
              <Link
                href="/papers/"
                className="inline-flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-slate-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                返回论文索引
              </Link>
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {paper.sections && paper.sections.length > 0 && (
              <div className="glass-panel-subtle rounded-2xl p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Contents
                </p>
                <h2 className="mt-1 text-xs font-semibold text-white">本文目录</h2>
                <ol className="mt-3 space-y-1.5">
                  {paper.sections.map((section, index) => (
                    <li key={section.heading}>
                      <a
                        href={`#section-${index + 1}`}
                        className="flex gap-2 text-[11.5px] leading-snug text-slate-400 transition-colors hover:text-slate-100"
                      >
                        <span className="font-mono text-[10px] text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{section.heading}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="glass-panel-subtle rounded-2xl p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Resources
              </p>
              <h2 className="mt-1 text-xs font-semibold text-white">
                附件与引用
              </h2>

              {hasResources ? (
                <div className="mt-3 flex flex-col gap-1.5">
                  {paper.pdfUrl && (
                    <a
                      href={resolveContentUrl(paper.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={resourceLinkClass}
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1">PDF 全文</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted" />
                    </a>
                  )}

                  {paper.codeUrl && (
                    <a
                      href={paper.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={resourceLinkClass}
                    >
                      <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1">源代码</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted" />
                    </a>
                  )}

                  {paper.slidesUrl && (
                    <a
                      href={resolveContentUrl(paper.slidesUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={resourceLinkClass}
                    >
                      <Presentation className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1">幻灯片</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted" />
                    </a>
                  )}

                  {paper.bibtex && (
                    <CopyButton
                      text={paper.bibtex}
                      label="复制 BibTeX"
                      className={resourceLinkClass}
                    />
                  )}
                </div>
              ) : (
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  该条目暂未附资源。
                </p>
              )}

              {paper.bibtex && (
                <details className="group mt-2 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                  <summary className="cursor-pointer px-3 py-2 text-[11px] text-slate-400 transition-colors hover:text-slate-200">
                    查看 BibTeX
                  </summary>
                  <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words border-t border-white/[0.06] p-3 font-mono text-[10px] leading-relaxed text-slate-400">
                    {paper.bibtex}
                  </pre>
                </details>
              )}
            </div>

            {related.length > 0 && (
              <div className="glass-panel-subtle rounded-2xl p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Related
                </p>
                <h2 className="mt-1 text-xs font-semibold text-white">
                  同类论文
                </h2>
                <ul className="mt-3 space-y-2">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/papers/${item.id}/`}
                        className="group block text-[11.5px] leading-snug text-slate-400 transition-colors hover:text-slate-100"
                      >
                        <span className="line-clamp-2">{item.title}</span>
                        <span className="mt-1 block font-mono text-[10px] text-muted">
                          {formatDate(item.date)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </ModuleShell>
  );
}
