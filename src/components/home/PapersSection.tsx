import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { papers } from "@/data/papers";
import { formatDate, getPaperCategoryName } from "@/lib/content";

export function PapersSection() {
  if (papers.length === 0) return null;

  const latest = [...papers]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <section id="papers" className="scroll-mt-24 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Papers
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            论文分享
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            按分类与关键词检索，点开条目查看正文、附件与引用。
          </p>
        </div>

        <Link
          href="/papers/"
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
        >
          浏览论文索引
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="glass-panel-subtle overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            最新条目
          </span>
          <span className="font-mono">{papers.length} 篇论文</span>
        </div>

        <div>
          {latest.map((paper) => (
            <Link
              key={paper.id}
              href={`/papers/${paper.id}/`}
              className="group flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.03]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10.5px] text-muted">
                  <span>{getPaperCategoryName(paper.category)}</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-white/25" />
                  <time dateTime={paper.date}>{formatDate(paper.date)}</time>
                </div>

                <h3 className="mt-1.5 break-words text-sm font-medium leading-snug text-white transition-colors group-hover:text-accent">
                  {paper.title}
                </h3>

                <p className="mt-1 line-clamp-1 text-[11.5px] leading-relaxed text-slate-400">
                  {paper.abstract}
                </p>
              </div>

              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
