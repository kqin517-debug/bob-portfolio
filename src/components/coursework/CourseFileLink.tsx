import {
  ExternalLink,
  FileArchive,
  FileText,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import type { ContentFileKind, CourseFile } from "@/data/coursework";
import { isExternalUrl, resolveContentUrl } from "@/lib/utils";

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

export function CourseFileLink({
  file,
  itemTitle,
  className = "",
}: {
  file: CourseFile;
  itemTitle: string;
  className?: string;
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
      className={`${fileLinkClass} ${className}`}
      aria-label={`${shouldDownload ? "下载" : "打开"}《${itemTitle}》${file.label}`}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{file.label}</span>
      </span>
      {file.size && <span className="shrink-0 text-muted">{file.size}</span>}
    </a>
  );
}
