"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, SearchX, SlidersHorizontal } from "lucide-react";
import { SearchField } from "@/components/content/SearchField";
import {
  paperCategories,
  papers,
  type PaperItem,
} from "@/data/papers";
import { formatDate, getPaperCategoryName } from "@/lib/content";

export function PapersExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");

  const categoryGroups = useMemo(() => {
    const registered = paperCategories
      .map((item) => ({
        ...item,
        count: papers.filter((paper) => paper.category === item.id).length,
      }))
      .filter((item) => item.count > 0);

    // 即便新增论文时忘了登记分类，条目也不会从“全部论文”里消失。
    const registeredIds = new Set(paperCategories.map((item) => item.id));
    const unregistered = Array.from(
      new Set(papers.map((paper) => paper.category))
    )
      .filter((categoryId) => !registeredIds.has(categoryId))
      .map((categoryId) => ({
        id: categoryId,
        name: categoryId,
        description: "未登记分类，请同步到 paperCategories。",
        count: papers.filter((paper) => paper.category === categoryId).length,
      }));

    return [...registered, ...unregistered];
  }, []);

  const years = useMemo(
    () =>
      Array.from(new Set(papers.map((paper) => paper.date.slice(0, 4)))).sort(
        (a, b) => b.localeCompare(a)
      ),
    []
  );

  const filtered = useMemo(() => {
    const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return papers
      .filter((paper) => {
        if (category !== "all" && paper.category !== category) return false;
        if (year !== "all" && !paper.date.startsWith(year)) return false;
        if (keywords.length === 0) return true;

        const sectionText = (paper.sections ?? [])
          .flatMap((section) => [
            section.heading,
            ...section.paragraphs,
            ...(section.bullets ?? []),
          ])
          .join(" ");

        const haystack = [
          paper.title,
          paper.abstract,
          sectionText,
          paper.authors.join(" "),
          paper.tags.join(" "),
          paper.venue ?? "",
          paper.course ?? "",
          getPaperCategoryName(paper.category),
        ]
          .join(" ")
          .toLowerCase();

        return keywords.every((keyword) => haystack.includes(keyword));
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [category, query, year]);

  const visibleGroups = categoryGroups
    .map((group) => ({
      ...group,
      items: filtered.filter((paper) => paper.category === group.id),
    }))
    .filter((group) => group.items.length > 0);

  const latestDate = papers
    .map((paper) => paper.date)
    .sort()
    .at(-1);

  const hasFilters = query.trim() !== "" || category !== "all" || year !== "all";

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setYear("all");
  };

  return (
    <div>
      <header className="border-b border-white/[0.06] pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              <span className="h-px w-8 bg-accent/50" />
              Index · Papers
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              论文索引
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-[1.8] text-slate-300">
              按分类、年份或关键词检索论文。索引只保留必要信息，点开条目后才会展示摘要、正文、附件与引用。
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted">
            <span>
              <span className="font-mono text-slate-200">{papers.length}</span>{" "}
              篇论文
            </span>
            <span>
              <span className="font-mono text-slate-200">
                {categoryGroups.length}
              </span>{" "}
              个分类
            </span>
            {latestDate && (
              <span>
                最近更新{" "}
                <span className="font-mono text-slate-200">
                  {formatDate(latestDate)}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 max-w-2xl">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="搜索标题、正文、作者或标签…"
            label="搜索论文"
          />
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside
          aria-label="论文筛选"
          className="space-y-4 lg:sticky lg:top-24 lg:self-start"
        >
          <div className="glass-panel-subtle rounded-2xl p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              分类
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
              <FilterButton
                active={category === "all"}
                label="全部论文"
                count={papers.length}
                onClick={() => setCategory("all")}
              />
              {categoryGroups.map((group) => (
                <FilterButton
                  key={group.id}
                  active={category === group.id}
                  label={group.name}
                  count={group.count}
                  onClick={() => setCategory(group.id)}
                />
              ))}
            </div>
          </div>

          {years.length > 1 && (
            <div className="glass-panel-subtle rounded-2xl p-4">
              <p className="text-[11px] text-muted">年份</p>
              <div className="mt-3 flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
                <FilterButton
                  active={year === "all"}
                  label="全部年份"
                  count={papers.length}
                  onClick={() => setYear("all")}
                />
                {years.map((item) => (
                  <FilterButton
                    key={item}
                    active={year === item}
                    label={item}
                    count={papers.filter((paper) =>
                      paper.date.startsWith(item)
                    ).length}
                    onClick={() => setYear(item)}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="px-1 text-[11px] leading-relaxed text-muted">
            论文按类型归档；分类与条目均在
            <code className="mx-1 rounded bg-white/[0.04] px-1 py-0.5 font-mono text-[10px] text-slate-300">
              data/papers.ts
            </code>
            中维护。
          </p>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11.5px] text-slate-400" aria-live="polite">
              找到{" "}
              <span className="font-mono text-slate-200">{filtered.length}</span>{" "}
              篇论文
              {query.trim() && (
                <>
                  ，关键词
                  <span className="text-slate-200">“{query.trim()}”</span>
                </>
              )}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-muted transition-colors hover:text-slate-200"
              >
                清除筛选
              </button>
            )}
          </div>

          {visibleGroups.length > 0 ? (
            <div className="space-y-10">
              {visibleGroups.map((group) => (
                <section
                  key={group.id}
                  aria-labelledby={`paper-group-${group.id}`}
                >
                  <div className="mb-3 flex items-end justify-between gap-4 border-b border-white/[0.06] pb-3">
                    <div>
                      <h2
                        id={`paper-group-${group.id}`}
                        className="text-sm font-semibold text-white"
                      >
                        {group.name}
                      </h2>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {group.description}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-muted">
                      {group.items.length} 篇
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.items.map((paper) => (
                      <PaperEntry key={paper.id} paper={paper} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <PaperEmptyState query={query.trim()} onReset={resetFilters} />
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11.5px] transition-colors lg:flex lg:w-full lg:justify-between ${
        active
          ? "glass-menu-active font-medium"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`font-mono text-[10px] ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function PaperEntry({ paper }: { paper: PaperItem }) {
  const categoryName = getPaperCategoryName(paper.category);
  const venue =
    paper.venue && paper.venue !== categoryName ? paper.venue : undefined;

  return (
    <Link
      href={`/papers/${paper.id}/`}
      className="group block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10.5px] text-muted">
            <time dateTime={paper.date}>{formatDate(paper.date)}</time>
            {venue && (
              <>
                <span className="h-0.5 w-0.5 rounded-full bg-white/25" />
                <span>{venue}</span>
              </>
            )}
            {paper.authors.length > 0 && (
              <>
                <span className="h-0.5 w-0.5 rounded-full bg-white/25" />
                <span>{paper.authors.join("、")}</span>
              </>
            )}
          </div>

          <h3 className="mt-2 break-words text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-accent">
            {paper.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.8] text-slate-400">
            {paper.abstract}
          </p>
        </div>

        <span className="mt-0.5 hidden shrink-0 rounded-full border border-white/[0.08] p-1.5 text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent sm:inline-flex">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-300"
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-muted transition-colors group-hover:text-slate-200">
          阅读条目
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function PaperEmptyState({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <div className="glass-panel-subtle flex flex-col items-center rounded-3xl px-6 py-14 text-center">
      <span className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-muted">
        <SearchX className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-medium text-white">没有找到匹配的论文</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
        {query
          ? `没有与“${query}”匹配的条目，试试更短的关键词，或按分类浏览。`
          : "当前筛选条件下没有条目，换一个分类或年份看看。"}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
      >
        清除筛选
      </button>
    </div>
  );
}
