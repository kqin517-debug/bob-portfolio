import {
  BookOpen,
  ClipboardList,
  FlaskConical,
  FolderGit2,
  type LucideIcon,
} from "lucide-react";
import type { CourseworkKind } from "@/data/coursework";
import { courseworkKindLabels } from "@/lib/content";

export const courseworkKindIcons: Record<CourseworkKind, LucideIcon> = {
  homework: ClipboardList,
  lab: FlaskConical,
  project: FolderGit2,
  notes: BookOpen,
};

export function CourseworkKindBadge({
  kind,
  className = "",
}: {
  kind: CourseworkKind;
  className?: string;
}) {
  const Icon = courseworkKindIcons[kind];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-slate-300 ${className}`}
    >
      <Icon className="h-3.5 w-3.5 text-accent" />
      {courseworkKindLabels[kind]}
    </span>
  );
}
