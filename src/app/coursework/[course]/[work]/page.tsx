import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { ArticleBody } from "@/components/content/ArticleBody";
import { CourseFileLink } from "@/components/coursework/CourseFileLink";
import { CourseworkKindBadge } from "@/components/coursework/CourseworkKindBadge";
import { ModuleShell } from "@/components/layout/ModuleShell";
import { GithubIcon } from "@/components/ui/Icons";
import { courses } from "@/data/coursework";
import { formatDate } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.items.map((item) => ({ course: course.id, work: item.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; work: string }>;
}): Promise<Metadata> {
  const { course: courseId, work: workId } = await params;
  const course = courses.find((item) => item.id === courseId);
  const item = course?.items.find((entry) => entry.id === workId);

  if (!course || !item) return { title: "课程作业未找到" };

  return {
    title: `${item.title} | ${course.name}`,
    description: item.description,
  };
}

const resourceLinkClass =
  "flex w-full items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[11.5px] text-slate-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white";

export default async function CourseworkDetailPage({
  params,
}: {
  params: Promise<{ course: string; work: string }>;
}) {
  const { course: courseId, work: workId } = await params;
  const course = courses.find((item) => item.id === courseId);
  const item = course?.items.find((entry) => entry.id === workId);

  if (!course || !item) notFound();

  const sortedItems = [...course.items].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const currentIndex = sortedItems.findIndex(
    (entry) => entry.id === item.id
  );
  const newer = sortedItems[currentIndex - 1];
  const older = sortedItems[currentIndex + 1];
  const siblings = sortedItems.filter((entry) => entry.id !== item.id);
  const hasResources = item.files.length > 0 || Boolean(item.codeUrl);

  return (
    <ModuleShell active="coursework">
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
            href="/coursework/"
            className="transition-colors hover:text-slate-200"
          >
            课程作业
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <Link
            href="/coursework/"
            className="truncate transition-colors hover:text-slate-200"
          >
            {course.name}
          </Link>
          <ChevronRight className="hidden h-3 w-3 text-slate-600 sm:block" />
          <span className="hidden truncate text-slate-400 sm:block">
            {item.title}
          </span>
        </nav>

        <header className="mt-6 border-b border-white/[0.06] pb-7">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <CourseworkKindBadge kind={item.kind} />
            <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-slate-300">
              {course.name}
            </span>
            {course.code && (
              <span className="font-mono text-muted">{course.code}</span>
            )}
            <time dateTime={item.date} className="font-mono text-muted">
              {formatDate(item.date)}
            </time>
          </div>

          <h1 className="mt-4 text-balance text-2xl font-semibold leading-[1.25] tracking-tight text-white sm:text-3xl md:text-4xl">
            {item.title}
          </h1>

          <p className="mt-3 text-[11.5px] text-muted">
            {[course.term, course.instructor].filter(Boolean).join(" · ")}
          </p>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
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
            {item.description && (
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Summary · 条目说明
                </p>
                <p className="mt-3 text-[13.5px] leading-[1.95] text-slate-300">
                  {item.description}
                </p>
              </div>
            )}

            {item.sections && item.sections.length > 0 && (
              <div className={item.description ? "mt-10" : ""}>
                <ArticleBody sections={item.sections} />
              </div>
            )}

            {!item.description &&
              (!item.sections || item.sections.length === 0) && (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:p-6">
                  <p className="text-[13.5px] leading-[1.95] text-slate-300">
                    该条目暂未填写详细说明，附件与代码入口整理在右侧。
                  </p>
                </div>
              )}

            {(newer || older) && (
              <nav
                aria-label="同课程相邻条目"
                className="mt-12 grid gap-3 border-t border-white/[0.06] pt-6 sm:grid-cols-2"
              >
                {newer && (
                  <Link
                    href={`/coursework/${course.id}/${newer.id}/`}
                    className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <span className="flex items-center gap-1.5 text-[10.5px] text-muted">
                      <ArrowLeft className="h-3 w-3" />
                      同课程更新
                    </span>
                    <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-slate-300 transition-colors group-hover:text-white">
                      {newer.title}
                    </p>
                  </Link>
                )}
                {older && (
                  <Link
                    href={`/coursework/${course.id}/${older.id}/`}
                    className={`group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04] ${
                      newer ? "sm:text-right" : "sm:col-start-2"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-[10.5px] text-muted sm:justify-end">
                      同课程更早
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
                href="/coursework/"
                className="inline-flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-slate-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                返回课程作业索引
              </Link>
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="glass-panel-subtle rounded-2xl p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Course
              </p>
              <h2 className="mt-1 text-xs font-semibold text-white">所属课程</h2>
              <p className="mt-2 text-sm font-medium text-white">
                {course.name}
              </p>
              <p className="mt-1 font-mono text-[10px] text-muted">
                {[course.code, course.term, course.instructor]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {course.description && (
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  {course.description}
                </p>
              )}
              <Link
                href="/coursework/"
                className="mt-3 inline-flex items-center gap-1 text-[11px] text-accent transition-colors hover:text-white"
              >
                浏览全部课程
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {hasResources && (
              <div className="glass-panel-subtle rounded-2xl p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Attachments
                </p>
                <h2 className="mt-1 text-xs font-semibold text-white">
                  附件与代码
                </h2>
                <div className="mt-3 flex flex-col gap-1.5">
                  {item.files.map((file) => (
                    <CourseFileLink
                      key={`${item.id}-${file.label}`}
                      file={file}
                      itemTitle={item.title}
                      className="w-full justify-between"
                    />
                  ))}

                  {item.codeUrl && (
                    <a
                      href={item.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={resourceLinkClass}
                    >
                      <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1">源代码</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {siblings.length > 0 && (
              <div className="glass-panel-subtle rounded-2xl p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  More in this course
                </p>
                <h2 className="mt-1 text-xs font-semibold text-white">
                  本课程其他条目
                </h2>
                <ul className="mt-3 space-y-3">
                  {siblings.map((entry) => (
                    <li key={entry.id}>
                      <Link
                        href={`/coursework/${course.id}/${entry.id}/`}
                        className="group block"
                      >
                        <CourseworkKindBadge kind={entry.kind} />
                        <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-snug text-slate-400 transition-colors group-hover:text-slate-100">
                          {entry.title}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-muted">
                          {formatDate(entry.date)}
                        </p>
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
