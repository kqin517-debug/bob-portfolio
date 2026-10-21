import Link from "next/link";
import { ArrowRight, ArrowUpRight, GraduationCap } from "lucide-react";
import { CourseworkKindBadge } from "@/components/coursework/CourseworkKindBadge";
import { courses } from "@/data/coursework";
import { formatDate } from "@/lib/content";

export function CourseworkSection() {
  const totalItems = courses.reduce(
    (total, course) => total + course.items.length,
    0
  );

  if (totalItems === 0) return null;

  const latest = courses
    .flatMap((course) =>
      course.items.map((item) => ({ course, item }))
    )
    .sort((a, b) => b.item.date.localeCompare(a.item.date))
    .slice(0, 3);

  return (
    <section id="coursework" className="scroll-mt-24 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Coursework
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            课程作业
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            按课程与类型归档，点开条目查看说明、正文和附件。
          </p>
        </div>

        <Link
          href="/coursework/"
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
        >
          浏览作业索引
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="glass-panel-subtle overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            最新条目
          </span>
          <span className="font-mono">
            {courses.length} 门课程 · {totalItems} 项
          </span>
        </div>

        <div>
          {latest.map(({ course, item }) => (
            <Link
              key={`${course.id}-${item.id}`}
              href={`/coursework/${course.id}/${item.id}/`}
              className="group flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.03]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-muted">
                  <CourseworkKindBadge kind={item.kind} />
                  <span>{course.name}</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-white/25" />
                  <time dateTime={item.date} className="font-mono">
                    {formatDate(item.date)}
                  </time>
                </div>

                <h3 className="mt-2 break-words text-sm font-medium leading-snug text-white transition-colors group-hover:text-accent">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-1 line-clamp-1 text-[11.5px] leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                )}
              </div>

              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
