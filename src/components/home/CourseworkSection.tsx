"use client";

import {
  BookOpen,
  ClipboardList,
  ExternalLink,
  FileArchive,
  FileText,
  FlaskConical,
  FolderGit2,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import {
  courses,
  type ContentFileKind,
  type CourseFile,
  type CourseworkKind,
} from "@/data/coursework";
import { courseworkKindLabels, formatDate } from "@/lib/content";
import { isExternalUrl, resolveContentUrl } from "@/lib/utils";

const kindIcons: Record<CourseworkKind, LucideIcon> = {
  homework: ClipboardList,
  lab: FlaskConical,
  project: FolderGit2,
  notes: BookOpen,
};

const fileIcons: Record<ContentFileKind, LucideIcon> = {
  pdf: FileText,
  zip: FileArchive,
  docx: FileText,
  pptx: Presentation,
  ipynb: FileText,
  link: ExternalLink,
};

const fileLinkClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white";

export function CourseworkSection() {
  if (courses.length === 0) return null;

  return (
    <section id="coursework" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Coursework
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            课程作业
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-right">
          按课程整理的作业、实验与课程项目，附件可直接预览或下载。
        </p>
      </div>

      <div className="space-y-7">
        {courses.map((course) => (
          <div
            key={course.id}
            id={`course-${course.id}`}
            className="scroll-mt-24"
          >
            <div className="flex flex-col gap-1 border-b border-white/[0.06] pb-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {course.name}
                </h3>
                <p className="mt-1 text-[11px] text-muted">
                  {[course.code, course.term, course.instructor]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <span className="font-mono text-[11px] text-muted">
                {course.items.length} 项
              </span>
            </div>

            {course.description && (
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {course.description}
              </p>
            )}

            <div className="mt-3 space-y-3">
              {course.items.map((item) => {
                const KindIcon = kindIcons[item.kind];

                return (
                  <article
                    key={item.id}
                    id={`work-${item.id}`}
                    className="scroll-mt-24 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-medium text-slate-300">
                        <KindIcon className="h-3.5 w-3.5 text-accent" />
                        {courseworkKindLabels[item.kind]}
                      </span>
                      <time
                        dateTime={item.date}
                        className="font-mono text-muted"
                      >
                        {formatDate(item.date)}
                      </time>
                    </div>

                    <h4 className="mt-2 break-words text-sm font-medium text-white">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {item.description}
                      </p>
                    )}

                    {(item.files.length > 0 || item.codeUrl) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.files.map((file) => (
                          <CourseFileLink
                            key={`${item.id}-${file.label}`}
                            file={file}
                            itemTitle={item.title}
                          />
                        ))}

                        {item.codeUrl && (
                          <a
                            href={item.codeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={fileLinkClass}
                            aria-label={`打开《${item.title}》源代码`}
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                            代码
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CourseFileLink({
  file,
  itemTitle,
}: {
  file: CourseFile;
  itemTitle: string;
}) {
  const Icon = fileIcons[file.kind];
  const external = isExternalUrl(file.url);
  const shouldDownload =
    !external && file.kind !== "pdf" && file.kind !== "link";

  return (
    <a
      href={resolveContentUrl(file.url)}
      target="_blank"
      rel="noopener noreferrer"
      download={shouldDownload ? "" : undefined}
      className={fileLinkClass}
      aria-label={`${shouldDownload ? "下载" : "打开"}《${itemTitle}》${file.label}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{file.label}</span>
      {file.size && <span className="text-muted">{file.size}</span>}
    </a>
  );
}
