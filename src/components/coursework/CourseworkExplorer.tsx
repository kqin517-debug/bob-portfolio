"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, SearchX, SlidersHorizontal } from "lucide-react";
import { SearchField } from "@/components/content/SearchField";
import { CourseworkKindBadge } from "@/components/coursework/CourseworkKindBadge";
import {
  courses,
  type Course,
  type CourseworkItem,
  type CourseworkKind,
} from "@/data/coursework";
import { courseworkKindLabels, formatDate } from "@/lib/content";

export function CourseworkExplorer() {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState<"all" | CourseworkKind>("all");

  const totalItems = courses.reduce(
    (total, course) => total + course.items.length,
    0
  );

  const kindGroups = useMemo(() => {
    const counts = new Map<CourseworkKind, number>();

    courses.forEach((course) => {
      course.items.forEach((item) => {
        counts.set(item.kind, (counts.get(item.kind) ?? 0) + 1);
      });
    });

    return (Object.keys(courseworkKindLabels) as CourseworkKind[])
      .filter((kind) => (counts.get(kind) ?? 0) > 0)
      .map((kind) => ({ kind, count: counts.get(kind) ?? 0 }));
  }, []);

  const visibleGroups = useMemo(() => {
    const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return courses
      .map((course) => {
        const items = course.items
          .filter((item) => {
            if (courseFilter !== "all" && course.id !== courseFilter) {
              return false;
            }
            if (kindFilter !== "all" && item.kind !== kindFilter) {
              return false;
            }
            if (keywords.length === 0) return true;

            const sectionText = (item.sections ?? [])
              .flatMap((section) => [
                section.heading,
                ...section.paragraphs,
                ...(section.bullets ?? []),
              ])
              .join(" ");

            const haystack = [
              course.name,
              course.code ?? "",
              course.term,
              course.instructor ?? "",
              courseworkKindLabels[item.kind],
              item.title,
              item.description ?? "",
              sectionText,
              (item.tags ?? []).join(" "),
              item.files.map((file) => file.label).join(" "),
            ]
              .join(" ")
              .toLowerCase();

            return keywords.every((keyword) => haystack.includes(keyword));
          })
          .sort((a, b) => b.date.localeCompare(a.date));

        return { course, items };
      })
      .filter((group) => group.items.length > 0);
  }, [courseFilter, kindFilter, query]);

  const resultCount = visibleGroups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  const latestDate = courses
    .flatMap((course) => course.items.map((item) => item.date))
    .sort()
    .at(-1);

  const hasFilters =
    query.trim() !== "" || courseFilter !== "all" || kindFilter !== "all";

  const resetFilters = () => {
    setQuery("");
    setCourseFilter("all");
    setKindFilter("all");
  };

  return (
    <div>
      <header className="border-b border-white/[0.06] pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              <span className="h-px w-8 bg-accent/50" />
              Index · Coursework
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              课程作业索引
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-[1.8] text-slate-300">
              按课程与类型归档作业、实验、课程项目和笔记。先定位条目，再进入详情页查看说明、正文与附件。
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted">
            <span>
              <span className="font-mono text-slate-200">{courses.length}</span>{" "}
              门课程
            </span>
            <span>
              <span className="font-mono text-slate-200">{totalItems}</span>{" "}
              项条目
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
            placeholder="搜索课程、标题、正文或附件…"
            label="搜索课程作业"
          />
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside
          aria-label="课程作业筛选"
          className="space-y-4 lg:sticky lg:top-24 lg:self-start"
        >
          <div className="glass-panel-subtle rounded-2xl p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              课程
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
              <FilterButton
                active={courseFilter === "all"}
                label="全部课程"
                count={totalItems}
                onClick={() => setCourseFilter("all")}
              />
              {courses.map((course) => (
                <FilterButton
                  key={course.id}
                  active={courseFilter === course.id}
                  label={course.name}
                  hint={[course.code, course.term].filter(Boolean).join(" · ")}
                  count={course.items.length}
                  onClick={() => setCourseFilter(course.id)}
                />
              ))}
            </div>
          </div>

          <div className="glass-panel-subtle rounded-2xl p-4">
            <p className="text-[11px] text-muted">类型</p>
            <div className="mt-3 flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
              <FilterButton
                active={kindFilter === "all"}
                label="全部类型"
                count={totalItems}
                onClick={() => setKindFilter("all")}
              />
              {kindGroups.map((group) => (
                <FilterButton
                  key={group.kind}
                  active={kindFilter === group.kind}
                  label={courseworkKindLabels[group.kind]}
                  count={group.count}
                  onClick={() => setKindFilter(group.kind)}
                />
              ))}
            </div>
          </div>

          <p className="px-1 text-[11px] leading-relaxed text-muted">
            课程是作业的一级分类；新增课程与条目在
            <code className="mx-1 rounded bg-white/[0.04] px-1 py-0.5 font-mono text-[10px] text-slate-300">
              data/coursework.ts
            </code>
            中维护。
          </p>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11.5px] text-slate-400" aria-live="polite">
              找到{" "}
              <span className="font-mono text-slate-200">{resultCount}</span>{" "}
              项条目
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
              {visibleGroups.map(({ course, items }) => (
                <CourseGroup key={course.id} course={course} items={items} />
              ))}
            </div>
          ) : (
            <CourseworkEmptyState
              query={query.trim()}
              onReset={resetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  label,
  hint,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  hint?: string;
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
      <span className="min-w-0">
        <span className="block truncate">{label}</span>
        {hint && (
          <span
            className={`mt-0.5 hidden truncate font-mono text-[9.5px] lg:block ${
              active ? "text-accent/80" : "text-muted"
            }`}
          >
            {hint}
          </span>
        )}
      </span>
      <span
        className={`shrink-0 font-mono text-[10px] ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function CourseGroup({
  course,
  items,
}: {
  course: Course;
  items: CourseworkItem[];
}) {
  return (
    <section aria-labelledby={`course-group-${course.id}`}>
      <div className="mb-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2
              id={`course-group-${course.id}`}
              className="text-sm font-semibold text-white"
            >
              {course.name}
            </h2>
            <p className="mt-1 text-[11px] text-muted">
              {[course.code, course.term, course.instructor]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <span className="shrink-0 font-mono text-[11px] text-muted">
            {items.length} 项
          </span>
        </div>
        {course.description && (
          <p className="mt-2 max-w-2xl text-[11.5px] leading-relaxed text-slate-400">
            {course.description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <CourseworkEntry key={item.id} course={course} item={item} />
        ))}
      </div>
    </section>
  );
}

function CourseworkEntry({
  course,
  item,
}: {
  course: Course;
  item: CourseworkItem;
}) {
  const attachmentCount = item.files.length;

  return (
    <Link
      href={`/coursework/${course.id}/${item.id}/`}
      className="group block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
            <CourseworkKindBadge kind={item.kind} />
            <time dateTime={item.date} className="font-mono text-muted">
              {formatDate(item.date)}
            </time>
          </div>

          <h3 className="mt-2 break-words text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-accent">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.8] text-slate-400">
              {item.description}
            </p>
          )}
        </div>

        <span className="mt-0.5 hidden shrink-0 rounded-full border border-white/[0.08] p-1.5 text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent sm:inline-flex">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {(item.tags ?? []).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-300"
          >
            {tag}
          </span>
        ))}

        {attachmentCount > 0 && (
          <span className="font-mono text-[10px] text-muted">
            {attachmentCount} 个附件
          </span>
        )}
        {item.codeUrl && (
          <span className="font-mono text-[10px] text-muted">含代码</span>
        )}

        <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-muted transition-colors group-hover:text-slate-200">
          查看条目
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function CourseworkEmptyState({
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
      <p className="mt-4 text-sm font-medium text-white">没有找到匹配的条目</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
        {query
          ? `没有与“${query}”匹配的作业或笔记，试试课程名、类型或更短的关键词。`
          : "当前筛选条件下没有条目，换一门课程或类型看看。"}
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
